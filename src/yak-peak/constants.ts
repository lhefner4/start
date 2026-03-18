import type { Trait, Role, RoleKey, Location } from "./types";

// ── TRAITS ────────────────────────────────────────────────────────────────────
export const TRAITS: Trait[] = [
  { id: "heatSeeker",   icon: "🔥", name: "The Heat Seeker",  flavor: "You came to Yak Peak looking for chaos. The mountain is about to give it to you." },
  { id: "silentReader", icon: "🤐", name: "The Silent Reader", flavor: "You don't say much. You notice everything. By the time anyone else figures it out, you already know." },
  { id: "deflector",    icon: "🔄", name: "The Deflector",     flavor: "When the pressure rises, you redirect it. Not out of strategy — just instinct." },
  { id: "solidGround",  icon: "🏔️", name: "The Solid Ground",  flavor: "While the herd panics, you stay level. The mountain respects consistency." },
  { id: "wildCard",     icon: "🎲", name: "The Wild Card",     flavor: "Nobody knows what you're going to do. Not even you. That's the point." },
];

// ── ROLES ─────────────────────────────────────────────────────────────────────
export const ROLES: Record<RoleKey, Role> = {
  yak: {
    name: "Yak", icon: "🦬", team: "yak", col: "#f59e0b",
    desc: "You're a Yak. You're just trying to stay dry. No special powers, no secret agenda, no tricks. All you've got is your instincts and your vote. Pay attention. Trust carefully. Try not to get soaked.",
    flavor: "Stay dry. Vote smart. Trust nobody.",
  },
  wyak: {
    name: "Wack Yak", icon: "🌧️", team: "wyak", col: "#3b82f6",
    desc: "You're the Wack Yak. You know what you did. Each night you choose one yak to SOAK — eliminated at dawn — and one to DRIZZLE — marked with a hidden condition that can fire mid-day. Two moves. Zero mercy. Stay hidden, blend in, and let the storm do its work.",
    flavor: "Two moves. Zero mercy. Stay hidden.",
  },
  blogBoy: {
    name: "Blog Boy", icon: "🗞️", team: "yak", col: "#fbbf24",
    desc: "Every night you secretly investigate one yak and learn their forecast — DRY means safe, DAMP means Wack Yak. What you do with that information is entirely your call. You are never required to share your findings. WARNING: If you investigate a player who was drizzled that night, the drizzle triggers automatically at dawn. You will know you caused it. Nobody else will.",
    flavor: "Knowledge is your umbrella. Protect it.",
  },
  kingNopeIDo: {
    name: "King Nope-I-Do", icon: "👑", team: "yak", col: "#22c55e",
    desc: "Every night you veto the rain on one yak — no debate accepted, no explanation given. You can protect yourself. IMPORTANT: There is a 20% chance your protection fails. You will see the result privately on the spin wheel before passing the device. If your save holds, the protected player receives a private message the next morning. They will not know who saved them.",
    flavor: "Not tonight. Not you. Nope. I do.",
  },
  missionterry: {
    name: "The Missionterry", icon: "🎯", team: "yak", col: "#a855f7",
    desc: "All game long you sit there. You listen. You stew. You let things build. Then — once, at the exact right moment during the DAY PHASE ONLY — you stand up, name your target, and they are gone immediately. One blow up. One target. No takebacks. If your target turns out to be an innocent Yak and not the Wack Yak, you lose your voting rights for the remainder of the game. Choose the moment carefully. The mountain is watching.",
    flavor: "Calm. Calm. Calm. Then absolutely not calm.",
  },
};

// ── LOCATIONS ────────────────────────────────────────────────────────────────
export const LOCS: Location[] = [
  { name: "The Yak Shack", icon: "🏔️", pos: "Summit", bg: "#060818", bdr: "#f59e0b",
    card: "You're at the summit of Yak Peak — The Yak Shack. Resting stones worn smooth by years of hooves circle the center. The cave walls are covered in carvings — symbols and relics of every yak who came before you, every pack that stood here, every journey that started in this exact spot. A purple-marked territory map stretches across the far wall, trails and ridges documented in careful violet lines. Cold blue light filters through the cave mouth. And somewhere above — just out of sight — something watches. It always watches from up here. The descent hasn't started yet. But whatever is coming started in this room.",
    host: "Night falls at the summit. The blue light dims to almost nothing. The carved walls hold their silence. Somewhere in this circle of resting stones the Wack Yak sits perfectly still — warm, comfortable, exactly where they want to be. Whatever watches from above sees all of it. The storm didn't blow in from outside. It was here before any of you arrived. Night actions begin now — pass the device.",
    day: "Morning at The Yak Shack. The summit is quiet. The purple trail map is unchanged. The gear wall is undisturbed. The presence above is still. The herd has survived the first night on the mountain — but the Wack Yak is still in this circle, watching, waiting. The path down the mountain waits. First — answers. Discuss what you know. Someone in this group is not who they say they are.",
    noSoak: "The storm circled the summit through the night but never touched down. Every resting stone is dry. Every carving intact. The Wack Yak moved through the darkness and came up empty — or chose to wait. Nobody is buying the silence. The herd is alive but the threat remains. Discuss carefully.",
    soak: "Found at the cave mouth at first light — right where the summit shelf drops into the first descent path. Their symbol will not be carved into that wall. The presence above saw exactly what happened and isn't telling. The herd is one yak smaller this morning. Stay sharp — the Wack Yak is still among you." },
  { name: "Donnie's Den", icon: "🍳", pos: "Lower Trail", bg: "#1a0500", bdr: "#f97316",
    card: "You've reached the lower trail — Donnie's Den. A strange warm structure built directly into the mountainside, impossible to explain and impossible to ignore. Smooth stone prep surfaces line the walls. Great iron heating chambers glow amber in the corners. The air here smells different — warm, almost domestic. You feel yourself relaxing. Then you notice the scorch marks on the walls. Then you notice how quiet it gets when the mountain spirit stirs. Donnie's Den welcomes everyone. It just doesn't promise anything.",
    host: "Night settles over Donnie's Den. The iron chambers cool to embers. The prep surfaces are wiped clean. The mountain spirit that inhabits this place moves through the lower trail in the dark — neither protecting nor hunting, simply present, simply watching. The warmth remains. So does the threat. The Wack Yak is in this room right now. Night actions begin — pass the device.",
    day: "Morning in Donnie's Den. The amber glow is back. The mountain spirit has been here all night and the scorch marks on the walls are the only evidence of what it witnessed. The herd gathers around the prep surfaces. Someone here has been playing both sides of the fire. Discuss everything. The spirit is still watching — and in this room, the temperature can shift without warning.",
    noSoak: "The Den held through the night. The mountain spirit moved through and let it go — this time. The scorch marks suggest it hasn't always gone this way. Everyone survived but the Wack Yak is still warm and comfortable in this room. The herd needs to figure out who before the next descent.",
    soak: "Found near the iron chambers at first light — close enough to the warmth that they almost made it. The mountain spirit was in this room all night. The scorch marks absorbed another story. The herd is smaller this morning. The Wack Yak had a good night. Don't let them have another one.",
    spiritStirs: "🌋 HOST — SPIRIT STIRS EVENT: The mountain spirit of Donnie's Den has been disturbed by the heat of this discussion. Point to one player currently under the most suspicion. They must immediately defend themselves or forfeit their vote this round. No debate — the spirit decides." },
  { name: "The Gambling Cave", icon: "🎲", pos: "Early Trail", bg: "#0a0a0a", bdr: "#6b7280",
    card: "Third stop on the descent — The Gambling Cave. The pack didn't find this place so much as the place found them. A wide low-ceilinged cavern carved into the trail's eastern face, dark enough that your eyes never fully adjust, worn smooth by the hooves of every yak herd that has passed through Yak Peak since before anyone can remember. The smell hits first — warm, animal, unmistakably communal. The natural musk of generations baked into the stone. Crude markings on the walls record wagers made and lost by herds long gone. Reputations were built here. More were destroyed. The Gambling Cave doesn't care either way.",
    host: "Night falls inside The Gambling Cave. The darkness here is thicker and older than anywhere else on the mountain. The entire herd is packed into this low-ceilinged space and the Wack Yak is right there among them — invisible in the communal dark. The cave has seen this exact scenario play out more times than those wall markings can count. Night actions begin — pass the device.",
    day: "Morning in The Gambling Cave. The pack stirs slowly — this place has a way of making yaks forget the storm is coming. The wall markings record every wager this herd has made so far. It's time to make another one. Study the faces around you. The Wack Yak has been in this cave all night and they're still standing here acting completely normal. Call it.",
    noSoak: "The Gambling Cave absorbed the night without losing a single yak. The Wack Yak moved through the packed darkness and came up empty. The communal warmth and closeness of the herd may have ironically provided cover to everyone. The cave noted the outcome with complete indifference. The wager continues.",
    soak: "Found in the back of the cavern at first light — pressed against the far wall like they were trying to disappear into the stone. The cave markings behind them record dozens of similar outcomes. Just another wager that didn't pay. The herd moves on but the Wack Yak moves with them." },
  { name: "The Torrential Tunnel", icon: "🚇", pos: "Deep Trail", bg: "#070707", bdr: "#9ca3af",
    card: "The storm forces the pack into The Torrential Tunnel — a long straight passage carved through the mountain's bone. Gray stone walls stretch ahead into darkness. Unfinished. Empty. No alcoves, no side passages, no relief. Just forward. The moment the last yak crosses the threshold, the ancient door seals shut behind the herd with a sound that echoes the entire length of the tunnel. Everyone stops. Everyone understands instantly. You are inside now. The tunnel does not open again until dawn. There is no way back. There is only forward — and the fact that somewhere in this line the Wack Yak is still standing.",
    host: "The Torrential Tunnel is sealed. The gray walls stretch in both directions with no end in sight. The herd is locked in for the night with no exits, no escape routes, and no way to know who in this line is the Wack Yak. The silence here is absolute. The mountain presses in from every side. Night actions begin — pass the device quietly.",
    day: "The herd moves through The Torrential Tunnel in uneasy single file. The gray walls offer nothing — no landmarks, no reference points, no sense of progress. At dawn the far door opens. The herd lines up to exit one by one. The last in line reaches the threshold — and the door closes. A deep echoing rain begins inside the tunnel. Water seeps from the ceiling and rains down on whoever was left behind. The mountain claimed its own. The rest of the herd emerges onto the trail. One fewer yak. The Wack Yak is still among them.",
    noSoak: "The Wack Yak moved through the tunnel darkness and came up empty. Every gray wall accounted for. Every yak made it to the far door this morning. The tunnel noted this with complete indifference. It will have another opportunity.",
    soak: "At the midpoint of The Torrential Tunnel the herd stopped moving. One yak didn't start again. Left exactly where they stood — gray wall on one side, gray wall on the other. The sealed door somewhere impossibly far behind them. The herd moves forward. The door does not reopen.",
    tunnelExit: "At dawn the far door opens. The herd lines up one by one. The last player in line reaches the threshold — the door closes before they can exit. A loud echoing rain begins inside the tunnel. Water begins seeping from the ceiling, raining down on the one left behind. They are eliminated. The mountain kept them." },
  { name: "The Creamery", icon: "🥛", pos: "Near Base Camp", bg: "#0a0800", bdr: "#fcd34d",
    card: "Near base camp — The Creamery. The herd rounds a bend in the lower trail and stops. Something is different here. The stone underfoot is smoother. A modest but unmistakably deliberate structure sits carved into the mountainside — clean lines, well kept, almost suspiciously maintained given everything the herd just survived. A central serving station dominates the space, stocked with the finest yak milk cream known to any mountain dweller. Civilized yaks built this. You are close enough to the bottom of the mountain that civilization has left its mark on the trail. The end is close. The Wack Yak knows it too.",
    host: "Night settles over The Creamery. The serving station sits immaculate in the dark — not a single surface out of place, not a drop of yak cream disturbed. The herd has come far enough down the mountain to find civilization. So has the Wack Yak. They are standing in this impossibly clean room right now, and they are very aware that the end of the mountain is close. Night actions begin — pass the device.",
    day: "Morning at The Creamery. The serving station is exactly as it was — pristine, stocked, absolutely spotless. Nobody knows who keeps it this way. Nobody asks. The yak cream is cold and BFW Pond is close and the Wack Yak is still standing in this group acting like they belong here. This is the second to last chance to get it right. Discuss everything. Trust your gut. The mountain is almost done.",
    noSoak: "The Creamery held through the night without losing a single yak. Even the Wack Yak seemed reluctant to cause chaos in a space this clean. The herd accepts the small miracle and prepares for the final descent to BFW Pond. One more vote. One more night. Do not waste either.",
    soak: "Found near the central serving station at first light — the only visible disruption in an otherwise immaculate space. The Creamery absorbed the loss quietly and cleanly without leaving a mark. The herd is smaller. BFW Pond is close. The Wack Yak is still standing here. This ends soon." },
  { name: "BFW Pond", icon: "🌊", pos: "Base Camp", bg: "#020c08", bdr: "#34d399",
    card: "BFW Pond. You're here. The mountain is behind you and the Illinois countryside stretches in every direction. The air smells clean and calm — completely untouched by whatever was happening up on Yak Peak. A wide green lawn rolls down from the treeline to the water's edge. The pond sits still, lily pads dotting the surface, a modest dock extending to a small aluminum boat tied at its end. The boat is — and there is no diplomatic way to say this — extremely small. The herd came here because this is where yaks come when the mountain becomes too much. The dock is dry. The shoreline is dry. The storm hasn't reached BFW Pond yet. But the Wack Yak is still standing on this lawn. Nobody gets on that boat until this is finished.",
    host: "Night falls over BFW Pond. The water is still. The tiny boat rocks gently at the dock — patient, completely unaware of what this herd survived to reach this shoreline. The Wack Yak is standing somewhere on this lawn right now, looking at that boat, calculating their last move. This is the final night on the mountain. Whatever happens in the dark here determines everything. Night actions begin — pass the device.",
    day: "Morning at BFW Pond. The lawn is dewy. The dock holds. The tiny aluminum boat is tied off exactly where the herd knew it would be, carrying a legendary capacity limit that has never once been successfully challenged. Final vote. Final answer. The herd made it all the way down this mountain together. One of them is the Wack Yak. Figure it out. Then whoever is left gets on that boat.",
    noSoak: "BFW Pond held through the night. The Wack Yak stood on this lawn in the dark and looked at the tiny boat and the lily pads and apparently decided against it tonight. The dock held. The boat held. The pond held. Final vote still awaits. This is the last one. Make it count.",
    soak: "Found on the lawn at BFW Pond at first light — this close to the water, this close to the boat, this close to the end. The pond stays calm. The lily pads haven't moved. The herd is one yak smaller at the final vote. The Wack Yak is still standing on this shoreline. End it now.",
    yakWin: "The last Wack Yak is gone. The shoreline exhales. One by one the surviving yaks walk down the dock and step carefully into the tiny aluminum boat — weight distributed, breath held, the legendary capacity limit treated with the reverence it deserves. The boat holds. Of course it holds. It always holds. The pond opens up ahead, calm and still and completely dry. The storm watches from the mountain's base and cannot follow. The boat pushes off from the dock. The herd made the right call coming here. Every single one of them — dry. 🛶",
    wyakWin: "The math was always wrong. The surviving yaks pile onto the dock in a panic — storm at their backs, the Wack Yak on the shoreline, the tiny aluminum boat the only exit remaining. Too many. Too fast. The legendary capacity limit finally meets its match. The boat goes slowly at first. Then all at once. Every single yak is completely, thoroughly, absolutely soaked — sitting in BFW Pond in the Illinois countryside while the Wack Yak stands dry on the shoreline watching. The herd came to BFW Pond because they thought it would save them. The pond had other plans. 🌊" },
];

// ── ROLE DISTRIBUTION — Always exactly 1 Wack Yak ───────────────────────────
export const getDist = (n: number): RoleKey[] => {
  const specials: RoleKey[] = ["wyak", "blogBoy", "kingNopeIDo", "missionterry"];
  const available = Math.min(n, specials.length);
  const roles = specials.slice(0, available);
  while (roles.length < n) roles.push("yak");
  return roles;
};

export const shuffle = <T,>(a: T[]): T[] => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = 0 | Math.random() * (i + 1);
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
