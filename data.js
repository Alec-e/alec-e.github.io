/* Tina's Birthday — itinerary content.
   `startsAt` is the real clock time of each activity (ISO with timezone offset).
   Cards unlock 15 minutes BEFORE that time. Editing notes for Alec:
     - Edit any line below from github.com/Alec-e/alec-e.github.io on your phone.
     - Commit → live in ~30s. Hard refresh Tina's tab to see the change.
     - PDT = -07:00 (in effect May 29 2026). Keep the offset.
     - `time` is just the label on the card — edit it AND `startsAt` if you shift
       an activity so they don't drift. */
window.BDAY = {
  name: "Tina",
  dateLabel: "5 / 29 / 26",
  dateLong: "Friday, May 29 2026",
  // Minutes BEFORE startsAt that a card unlocks. Bump up if you want her to
  // see the next item further ahead of time.
  revealLeadMinutes: 15,
  items: [
   {
     id: "beauty",
     time: "10:08 PM",
     title: "Beauty Sleep",
     place: "Home",
     note: "Bday Girl gotta get her beauty sleep.",
     startsAt: "2026-05-28T22:08:00-07:00",
   },
    {
      id: "pilates",
      time: "6:00 AM",
      title: "Birthday Pilates",
      place: "Solidcore",
      note: "Gotta start my bday off right with some pilates.",
      startsAt: "2026-05-29T06:00:00-07:00",
    },
    {
      id: "matcha",
      time: "9:00 AM",
      title: "Matcha Time X Pastries",
      place: "Kaizen & Coffee — San Mateo",
      note: "Rikyu | Yutori | Maruwu — the original spot I chose doesn't open till 12.",
      startsAt: "2026-05-29T09:00:00-07:00",
    },
    {
      id: "kayak",
      time: "11:00 AM",
      title: "Kayaking",
      place: "Half Moon Bay Kayaking",
      note: "Surprise! If it all works out we will be on the water with Piper.",
      startsAt: "2026-05-29T11:00:00-07:00",
    },
    {
      id: "lunch",
      time: "12:30 PM",
      title: "Let's Eat",
      place: "The Barn vs Sams Chowder House",
      note: "Enjoy the patio with a beer, burger and Piper vs beer, chowder and Piper.",
      startsAt: "2026-05-29T12:30:00-07:00",
    },
    {
      id: "downtown",
      time: "2:00 PM",
      title: "Explore Downtown Half Moon Bay",
      place: "Downtown",
      note: "Take a stroll, explore and hangout.",
      startsAt: "2026-05-29T14:00:00-07:00",
    },
    {
      id: "checkin",
      time: "3:00 PM",
      title: "Check In!",
      place: "Beachside Cottage",
      note: "We have a cute cottage next to the beach so we can nap, and then explore with Piperdelle.",
      startsAt: "2026-05-29T15:00:00-07:00",
    },
    {
      id: "dinner",
      time: "6:00 PM",
      title: "Dinner!",
      place: "La Costanera",
      note: "It's a Peruvian Restaurant. Tried to reserve, but don't allow reservations for the Patio.",
      startsAt: "2026-05-29T18:00:00-07:00",
    },
    {
      id: "sunset",
      time: "7:30 PM",
      title: "Sunset!",
      place: "Ritz-Carlton",
      note: "Sunset is approximately 8:23. Showing you early so we can get ahead.",
      startsAt: "2026-05-29T19:30:00-07:00",
    },
    {
      id: "relax",
      time: "8:23 PM",
      title: "Let's Relax",
      place: "Airbnb Cottage",
      note: "After a full day we are probably pooped.",
      startsAt: "2026-05-29T20:23:00-07:00",
    },
  ],
};
