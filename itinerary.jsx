/* Tina's Birthday — itinerary page. One <ItineraryApp variant="…"> renders the
   whole mobile page; `variant` ('soft' | 'timeline' | 'sealed') swaps the
   card/marker treatment while sharing the hero, countdown logic and confetti.
   Locked items stay blank (countdown only) — title + details reveal on unlock.

   Reveal timing: each card unlocks at `startsAt − BDAY.revealLeadMinutes` (real
   wall-clock time). On page load, anything past its unlock time is already shown.

   Ticking lives in leaf <Countdown>/<SealedLocked> components so the parent only
   re-renders on actual unlock events — that keeps reveal animations from
   restarting every second. */
const { useState, useEffect, useRef, useCallback } = React;

function pad(n) { return String(n).padStart(2, "0"); }
function fmt(ms) {
  if (ms <= 0) return null;
  let s = Math.ceil(ms / 1000);
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  if (d > 0) return { big: d + "d", rest: `${pad(h)}:${pad(m)}:${pad(s)}` };
  return { big: null, rest: `${pad(h)}:${pad(m)}:${pad(s)}` };
}
function CountTime({ c }) {
  return (
    <span className="count-time">
      {c && c.big && <em>{c.big} </em>}
      {c ? c.rest : "00:00:00"}
    </span>
  );
}

/* self-ticking countdown leaf (re-renders only itself) */
function useNow() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}
function Countdown({ revealAt }) {
  const now = useNow();
  return <CountTime c={fmt(revealAt - now)} />;
}

/* CSS-drawn lock glyph */
function Lock({ open }) {
  return <span className={"lock" + (open ? " lock--open" : "")} aria-hidden="true" />;
}

/* reveal — only mounted when open; expands with a one-shot keyframe */
function Reveal({ open, variant, children }) {
  if (!open) return null;
  return <div className={"reveal reveal--" + variant}>{children}</div>;
}

function Avatar({ size }) {
  return (
    <div className="avatar-ring" style={{ width: size, height: size }}>
      <img className="avatar-img" src="assets/tina.jpg" alt="Tina" />
    </div>
  );
}

function Hero({ variant }) {
  return (
    <header className={"hero hero--" + variant}>
      <div className="hero-text">
        <h1 className="hero-title">{BDAY.name}'s<br />Birthday</h1>
        <div className="hero-date">{BDAY.dateLabel}</div>
      </div>
      <Avatar size={variant === "sealed" ? 104 : 92} />
    </header>
  );
}

/* Sealed variant ring progress: ramps from page-load to revealAt so the ring
   visibly fills as the unlock approaches. */
function calcProgress(loadTime, revealAt, now) {
  const total = revealAt - loadTime;
  if (total <= 0) return 1;
  return Math.max(0, Math.min(1, (now - loadTime) / total));
}

/* ===== Variant A: soft ===== */
function SoftCard({ item, unlocked, open, revealAt, onTap, cardRef }) {
  return (
    <li ref={cardRef}
      className={"card soft-card" + (unlocked ? " is-unlocked" : " is-locked") + (open ? " is-open" : "")}
      onClick={onTap}>
      {unlocked ? (
        <React.Fragment>
          <div className="soft-head">
            <div className="soft-meta">
              <span className="soft-time">{item.time}</span>
              <h3 className="soft-title">{item.title}</h3>
            </div>
            <span className="chev" aria-hidden="true" />
          </div>
          <Reveal open={open} variant="soft">
            <div className="reveal-place">{item.place}</div>
            <p className="reveal-note">{item.note}</p>
          </Reveal>
        </React.Fragment>
      ) : (
        <div className="locked-body">
          <Lock />
          <div className="locked-count">
            <span className="count-label">unlocks in</span>
            <Countdown revealAt={revealAt} />
          </div>
        </div>
      )}
    </li>
  );
}

/* ===== Variant B: timeline ===== */
function TimelineCard({ item, unlocked, open, revealAt, onTap, cardRef }) {
  return (
    <li ref={cardRef} className={"tl-row" + (unlocked ? " is-unlocked" : " is-locked")}>
      <div className="tl-rail"><span className="tl-node">{unlocked && <span className="tl-dot" />}</span></div>
      <div className={"card tl-card" + (open ? " is-open" : "")} onClick={onTap}>
        {unlocked ? (
          <React.Fragment>
            <div className="tl-time">{item.time}</div>
            <div className="tl-head">
              <h3 className="tl-title">{item.title}</h3>
              <span className="chev" aria-hidden="true" />
            </div>
            <Reveal open={open} variant="tl">
              <div className="reveal-place">{item.place}</div>
              <p className="reveal-note">{item.note}</p>
            </Reveal>
          </React.Fragment>
        ) : (
          <div className="locked-body locked-body--tl">
            <Lock />
            <div className="locked-count">
              <span className="count-label">unlocks in</span>
              <Countdown revealAt={revealAt} />
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

/* ===== Variant C: sealed (ring progress) ===== */
function Ring({ progress }) {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <svg className="ring" viewBox="0 0 64 64" width="58" height="58">
      <circle className="ring-track" cx="32" cy="32" r={r} />
      <circle className="ring-fill" cx="32" cy="32" r={r}
        strokeDasharray={c} strokeDashoffset={c * (1 - progress)} />
    </svg>
  );
}
function SealedLocked({ revealAt, loadTime }) {
  const now = useNow();
  return (
    <React.Fragment>
      <div className="sealed-ring">
        <Ring progress={calcProgress(loadTime, revealAt, now)} />
        <span className="sealed-lock"><Lock /></span>
      </div>
      <div className="sealed-meta">
        <span className="count-label">unlocks in</span>
        <CountTime c={fmt(revealAt - now)} />
      </div>
    </React.Fragment>
  );
}
function SealedCard({ item, unlocked, open, revealAt, loadTime, onTap, cardRef }) {
  return (
    <li ref={cardRef}
      className={"card sealed-card" + (unlocked ? " is-unlocked" : " is-locked") + (open ? " is-open" : "")}
      onClick={onTap}>
      {unlocked ? (
        <React.Fragment>
          <div className="sealed-head">
            <div className="sealed-ring">
              <Ring progress={1} />
              <span className="sealed-lock"><Lock open /></span>
            </div>
            <div className="sealed-meta">
              <span className="sealed-time">{item.time}</span>
              <h3 className="sealed-title">{item.title}</h3>
            </div>
            <span className="chev" aria-hidden="true" />
          </div>
          <Reveal open={open} variant="sealed">
            <div className="reveal-place">{item.place}</div>
            <p className="reveal-note">{item.note}</p>
          </Reveal>
        </React.Fragment>
      ) : (
        <div className="sealed-head">
          <SealedLocked revealAt={revealAt} loadTime={loadTime} />
        </div>
      )}
    </li>
  );
}

function ItineraryApp({ variant }) {
  const loadRef = useRef(Date.now());
  const leadMs = (BDAY.revealLeadMinutes || 15) * 60000;
  const revealAts = useRef(
    BDAY.items.map((it) => new Date(it.startsAt).getTime() - leadMs)
  );
  const [unlocked, setUnlocked] = useState(() => {
    const s = {};
    BDAY.items.forEach((it, i) => { if (revealAts.current[i] <= loadRef.current) s[it.id] = true; });
    return s;
  });
  const [open, setOpen] = useState({});
  const frameRef = useRef(null);
  const cardRefs = useRef([]);

  const burst = useCallback((idx) => {
    const frame = frameRef.current, el = cardRefs.current[idx];
    if (!frame || !el || !window.fireConfetti) return;
    const fr = frame.getBoundingClientRect(), cr = el.getBoundingClientRect();
    window.fireConfetti(frame, cr.left - fr.left + cr.width / 2,
      cr.top - fr.top + Math.min(cr.height / 2, 56), { count: 90 });
  }, []);

  // schedule each future unlock once (no per-second re-render of the tree)
  useEffect(() => {
    const timers = [];
    BDAY.items.forEach((it, i) => {
      const delay = revealAts.current[i] - Date.now();
      if (delay > 0) {
        timers.push(setTimeout(() => {
          setUnlocked((u) => ({ ...u, [it.id]: true }));
          setOpen((o) => ({ ...o, [it.id]: true }));
          setTimeout(() => burst(i), 160);
        }, delay));
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [burst]);

  const tap = (it, i) => {
    if (!unlocked[it.id]) {
      const el = cardRefs.current[i];
      if (el) { el.classList.remove("nudge"); void el.offsetWidth; el.classList.add("nudge"); }
      return;
    }
    setOpen((o) => {
      const opening = !o[it.id];
      if (opening) setTimeout(() => burst(i), 60);
      return { ...o, [it.id]: opening };
    });
  };

  const Card = variant === "timeline" ? TimelineCard : variant === "sealed" ? SealedCard : SoftCard;

  return (
    <div className={"bday-app app--" + variant} ref={frameRef}>
      <div className="bg-waves" aria-hidden="true">
        <span className="blob blob-1" /><span className="blob blob-2" /><span className="blob blob-3" />
      </div>
      <div className="scroll">
        <Hero variant={variant} />
        <div className="list-head">
          <span className="list-head-line" />
          <span className="list-head-label">The Itinerary</span>
          <span className="list-head-line" />
        </div>
        <ul className={"list list--" + variant}>
          {BDAY.items.map((it, i) => (
            <Card key={it.id} item={it} unlocked={!!unlocked[it.id]} open={!!open[it.id]}
              revealAt={revealAts.current[i]} loadTime={loadRef.current}
              onTap={() => tap(it, i)}
              cardRef={(el) => (cardRefs.current[i] = el)} />
          ))}
        </ul>
        <footer className="foot">made with love · {BDAY.dateLong}</footer>
      </div>
    </div>
  );
}

window.ItineraryApp = ItineraryApp;
