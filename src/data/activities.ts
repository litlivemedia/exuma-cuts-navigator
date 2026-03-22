import type { Activity } from '../types/activity.ts'

export const activities: Activity[] = [
  {
    id: 'lazy-river',
    name: 'The Lazy River',
    subtitle: 'Moriah Harbour Cay National Park',
    lat: 23.463,
    lon: -75.652,
    nearestCutId: 'conch-cay-cut',
    icon: '🌊',
    tideWindow: { relativeToHigh: [-2, 2] },
    gpxFile: '/gpx/chat-chill-lazy-river.gpx',
    guide: {
      overview:
        'A natural tidal creek winding through the mangroves of Moriah Harbour Cay National Park. When the tide is moving, the current carries you effortlessly through crystal-clear channels — a real-life lazy river surrounded by mangroves, sea turtles, and stingrays. The creek exits at Lazy River Beach where the open ocean meets the harbour.',
      gettingThere:
        'Dinghy ride from Georgetown anchorages in Elizabeth Harbour. Head southeast past Stocking Island toward Moriah Harbour Cay — about 40 minutes by dinghy. Enter via Ferry Bridge where you\'ll see the openings of two mangrove creeks. A GPX track from Chat & Chill to the Lazy River is available for download below.',
      bestConditions:
        'Best from about 2 hours before high tide to 2 hours after high tide. The rising tide gives you current to ride through the creeks and enough depth to clear the shallow spots. After 2 hours past high, the return trip gets too shallow — you may run aground. At slack tide the water barely moves, which defeats the purpose. Avoid approaching at low tide when depths drop to just 6 inches in spots.',
      tips: [
        'Time your arrival for 2 hours before high tide — ride the flood in, explore, and return before it gets too shallow',
        'Approach from the harbour side, not the ocean side — the ocean entrance has rough currents and breaking waves',
        'Bring snorkel gear — turtles and rays are everywhere in these protected mangrove channels',
        'The creek ranges from 6 feet deep to 6 inches — a rising tide gives you the best clearance',
        'Several tour operators run trips from Georgetown if you prefer a guided experience',
      ],
      warnings: [
        'Do not attempt the return trip more than 2 hours after high tide — you will run aground in the shallow sections',
        'The dinghy ride from Georgetown can be sporty in strong east or southeast winds — check conditions before heading out',
        'The current through the narrow sections can be surprisingly strong — keep control of your dinghy',
        'This is a national park — no anchoring on coral, no taking anything, and respect wildlife',
      ],
    },
  },
  {
    id: 'washing-machine',
    name: 'The Washing Machine',
    subtitle: 'Shroud Cay — Exuma Land & Sea Park',
    lat: 24.524,
    lon: -76.775,
    nearestCutId: 'wide-opening',
    icon: '🌀',
    bestWithStrongCurrent: true,
    guide: {
      overview:
        'Sanctuary Creek winds through the mangroves of Shroud Cay from the Bahama Bank side to the Exuma Sound. Where the creek exits on the east side, tidal currents concentrate and rush around a small beach peninsula creating river rapids — the legendary "Washing Machine." Jump in on one side and the current zips you around to the other side. The surrounding mangrove creeks are a nursery for sea turtles, conch, and juvenile fish.',
      gettingThere:
        'Anchor at North Shroud Cay anchorage (check ActiveCaptain for coordinates). Take your dinghy through Sanctuary Creek — the largest mangrove channel, navigable by motorized dinghy. At every fork, go left when heading east toward the Sound. The washing machine is at the eastern exit near Camp Driftwood. Kayaks and paddleboards can explore the smaller side creeks.',
      bestConditions:
        'Best when tides are flowing strongest — the rapids are most exciting during peak ebb or flood, roughly 3 hours after high or low tide when current velocity peaks. Enter the creek on a rising tide, at least halfway between low and high, so you have plenty of water depth for the return trip. The washing machine effect is created by the volume of water funneling through the narrow exit.',
      tips: [
        'Enter on a rising tide to ensure adequate depth for the return trip',
        'At every fork heading east (toward the Sound), bear left; heading back west, bear right',
        'The washing machine area has a sandy beach — great for a picnic between rides',
        'Bring snorkel gear — the turtle population here is extraordinary due to park protections',
        'Kayaking the smaller side creeks is magical — motorized boats are prohibited in these channels',
        'This is inside Exuma Cays Land and Sea Park — strict no-take zone, no fishing, no collecting',
      ],
      warnings: [
        'Do NOT enter the creek at low tide — you will run aground and be stuck until the tide rises',
        'The washing machine currents are strong — not suitable for weak swimmers or young children',
        'For divers: the drift dive version through the boulder chute (40ft to 15ft) requires intermediate+ experience',
        'Respect the park — no anchoring on coral, no taking shells, no fishing of any kind',
      ],
    },
  },
  {
    id: 'rachels-bubble-bath',
    name: "Rachel's Bubble Bath",
    subtitle: 'Compass Cay',
    lat: 24.283,
    lon: -76.522,
    nearestCutId: 'conch-cut',
    icon: '🫧',
    bestWithRoughSeas: true,
    preferredWindDirRange: [0, 90],
    guide: {
      overview:
        'A deep, crystal-clear blue lagoon on the northeast tip of Compass Cay — one of the best natural swimming holes in the Caribbean. The pool is separated from the open Exuma Sound by a thin rock bar. When waves crash over the rocks, they churn the lagoon into a fizzing, foaming natural jacuzzi. Jump in during the foam and you sink — it\'s more air than water. When the foam settles, you\'re floating in a warm, turquoise pool surrounded by marine life.',
      gettingThere:
        'Compass Cay is a short dinghy ride from Staniel Cay. Dock at the Compass Cay Marina ($5 docking fee) or anchor in the bay on the bank side. Beach your dinghy on the northwest shore and follow the shallow creek bed northeast for about half a mile. The Bubble Bath is on the northeast tip — you can\'t see it from the beach, so keep following the creek.',
      bestConditions:
        'Best in rough weather with north to east winds producing big waves on the Exuma Sound side. The waves need to be large enough to crash over the rock embankment and into the lagoon. Higher tides also help — more water over the rocks means more dramatic bubbling. On calm days with low tide, it\'s just a pretty pool with no bubbles. The sweet spot is a good north or northeast swell combined with high tide.',
      tips: [
        'Wear water shoes — the lagoon floor is covered with sea urchins',
        'Bring snorkel gear — stingrays and tropical fish inhabit the pool',
        'The walk from the dinghy landing is about 15 minutes — bring water and sunscreen',
        'Best visited as a half-day trip combined with the Compass Cay nurse sharks',
        'The island is private but the owner welcomes day visitors for the marina fee',
        'Swim goggles help when the bubbles are really going — the foam stings eyes slightly',
      ],
      warnings: [
        'Sea urchins are everywhere — on the rocks AND the lagoon floor. Water shoes are essential',
        'Do not stand on the rock bar when waves are crashing — you can be swept into the rocks',
        'The trail to the Bubble Bath is unmarked — follow the creek bed and stay northeast',
        'No facilities — bring everything you need including drinking water',
      ],
    },
  },
]
