import { useState, useEffect, useCallback } from "react";

// ── TRAITS ────────────────────────────────────────────────────────────────────
const TRAITS = [
  { id:"heatSeeker",  icon:"🔥", name:"The Heat Seeker",  flavor:"You came to Yak Peak looking for chaos. The mountain is about to give it to you." },
  { id:"silentReader",icon:"🤐", name:"The Silent Reader", flavor:"You don't say much. You notice everything. By the time anyone else figures it out, you already know." },
  { id:"deflector",   icon:"🔄", name:"The Deflector",     flavor:"When the pressure rises, you redirect it. Not out of strategy — just instinct." },
  { id:"solidGround", icon:"🏔️", name:"The Solid Ground",  flavor:"While the herd panics, you stay level. The mountain respects consistency." },
  { id:"wildCard",    icon:"🎲", name:"The Wild Card",     flavor:"Nobody knows what you're going to do. Not even you. That's the point." },
];

// ── ROLES ─────────────────────────────────────────────────────────────────────
const ROLES = {
  yak:         { name:"Yak",              icon:"🦬", team:"yak",      col:"#f59e0b",
    desc:"You're a Yak. You're just trying to stay dry. No special powers, no secret agenda, no tricks. All you've got is your instincts and your vote. Pay attention. Trust carefully. Try not to get soaked.",
    flavor:"Stay dry. Vote smart. Trust nobody." },
  wyak:        { name:"Wack Yak",         icon:"🌧️", team:"wyak",     col:"#3b82f6",
    desc:"You're the Wack Yak. You know what you did. Each night you choose one yak to SOAK — eliminated at dawn — and one to DRIZZLE — marked with a hidden condition that can fire mid-day. Two moves. Zero mercy. Stay hidden, blend in, and let the storm do its work.",
    flavor:"Two moves. Zero mercy. Stay hidden." },
  blogBoy:     { name:"Blog Boy",         icon:"🗞️", team:"yak",      col:"#fbbf24",
    desc:"Every night you secretly investigate one yak and learn their forecast — DRY means safe, DAMP means Wack Yak. What you do with that information is entirely your call. You are never required to share your findings. WARNING: If you investigate a player who was drizzled that night, the drizzle triggers automatically at dawn. You will know you caused it. Nobody else will.",
    flavor:"Knowledge is your umbrella. Protect it." },
  kingNopeIDo: { name:"King Nope-I-Do",   icon:"👑", team:"yak",      col:"#22c55e",
    desc:"Every night you veto the rain on one yak — no debate accepted, no explanation given. You can protect yourself. IMPORTANT: There is a 20% chance your protection fails. You will see the result privately on the spin wheel before passing the device. If your save holds, the protected player receives a private message the next morning. They will not know who saved them.",
    flavor:"Not tonight. Not you. Nope. I do." },
  missionterry:{ name:"The Missionterry", icon:"🎯", team:"yak",      col:"#a855f7",
    desc:"All game long you sit there. You listen. You stew. You let things build. Then — once, at the exact right moment during the DAY PHASE ONLY — you stand up, name your target, and they are gone immediately. One blow up. One target. No takebacks. If your target turns out to be an innocent Yak and not the Wack Yak, you lose your voting rights for the remainder of the game. Choose the moment carefully. The mountain is watching.",
    flavor:"Calm. Calm. Calm. Then absolutely not calm." },
};

// ── LOCATIONS ────────────────────────────────────────────────────────────────
const LOCS = [
  { name:"The Yak Shack", icon:"🏔️", pos:"Summit", bg:"#060818", bdr:"#f59e0b",
    card:"You're at the summit of Yak Peak — The Yak Shack. Resting stones worn smooth by years of hooves circle the center. The cave walls are covered in carvings — symbols and relics of every yak who came before you, every pack that stood here, every journey that started in this exact spot. A purple-marked territory map stretches across the far wall, trails and ridges documented in careful violet lines. Cold blue light filters through the cave mouth. And somewhere above — just out of sight — something watches. It always watches from up here. The descent hasn't started yet. But whatever is coming started in this room.",
    host:"Night falls at the summit. The blue light dims to almost nothing. The carved walls hold their silence. Somewhere in this circle of resting stones the Wack Yak sits perfectly still — warm, comfortable, exactly where they want to be. Whatever watches from above sees all of it. The storm didn't blow in from outside. It was here before any of you arrived. Night actions begin now — pass the device.",
    day:"Morning at The Yak Shack. The summit is quiet. The purple trail map is unchanged. The gear wall is undisturbed. The presence above is still. The herd has survived the first night on the mountain — but the Wack Yak is still in this circle, watching, waiting. The path down the mountain waits. First — answers. Discuss what you know. Someone in this group is not who they say they are.",
    noSoak:"The storm circled the summit through the night but never touched down. Every resting stone is dry. Every carving intact. The Wack Yak moved through the darkness and came up empty — or chose to wait. Nobody is buying the silence. The herd is alive but the threat remains. Discuss carefully.",
    soak:"Found at the cave mouth at first light — right where the summit shelf drops into the first descent path. Their symbol will not be carved into that wall. The presence above saw exactly what happened and isn't telling. The herd is one yak smaller this morning. Stay sharp — the Wack Yak is still among you." },
  { name:"Donnie's Den", icon:"🍳", pos:"Lower Trail", bg:"#1a0500", bdr:"#f97316",
    card:"You've reached the lower trail — Donnie's Den. A strange warm structure built directly into the mountainside, impossible to explain and impossible to ignore. Smooth stone prep surfaces line the walls. Great iron heating chambers glow amber in the corners. The air here smells different — warm, almost domestic. You feel yourself relaxing. Then you notice the scorch marks on the walls. Then you notice how quiet it gets when the mountain spirit stirs. Donnie's Den welcomes everyone. It just doesn't promise anything.",
    host:"Night settles over Donnie's Den. The iron chambers cool to embers. The prep surfaces are wiped clean. The mountain spirit that inhabits this place moves through the lower trail in the dark — neither protecting nor hunting, simply present, simply watching. The warmth remains. So does the threat. The Wack Yak is in this room right now. Night actions begin — pass the device.",
    day:"Morning in Donnie's Den. The amber glow is back. The mountain spirit has been here all night and the scorch marks on the walls are the only evidence of what it witnessed. The herd gathers around the prep surfaces. Someone here has been playing both sides of the fire. Discuss everything. The spirit is still watching — and in this room, the temperature can shift without warning.",
    noSoak:"The Den held through the night. The mountain spirit moved through and let it go — this time. The scorch marks suggest it hasn't always gone this way. Everyone survived but the Wack Yak is still warm and comfortable in this room. The herd needs to figure out who before the next descent.",
    soak:"Found near the iron chambers at first light — close enough to the warmth that they almost made it. The mountain spirit was in this room all night. The scorch marks absorbed another story. The herd is smaller this morning. The Wack Yak had a good night. Don't let them have another one.",
    spiritStirs:"🌋 HOST — SPIRIT STIRS EVENT: The mountain spirit of Donnie's Den has been disturbed by the heat of this discussion. Point to one player currently under the most suspicion. They must immediately defend themselves or forfeit their vote this round. No debate — the spirit decides." },
  { name:"The Gambling Cave", icon:"🎲", pos:"Early Trail", bg:"#0a0a0a", bdr:"#6b7280",
    card:"Third stop on the descent — The Gambling Cave. The pack didn't find this place so much as the place found them. A wide low-ceilinged cavern carved into the trail's eastern face, dark enough that your eyes never fully adjust, worn smooth by the hooves of every yak herd that has passed through Yak Peak since before anyone can remember. The smell hits first — warm, animal, unmistakably communal. The natural musk of generations baked into the stone. Crude markings on the walls record wagers made and lost by herds long gone. Reputations were built here. More were destroyed. The Gambling Cave doesn't care either way.",
    host:"Night falls inside The Gambling Cave. The darkness here is thicker and older than anywhere else on the mountain. The entire herd is packed into this low-ceilinged space and the Wack Yak is right there among them — invisible in the communal dark. The cave has seen this exact scenario play out more times than those wall markings can count. Night actions begin — pass the device.",
    day:"Morning in The Gambling Cave. The pack stirs slowly — this place has a way of making yaks forget the storm is coming. The wall markings record every wager this herd has made so far. It's time to make another one. Study the faces around you. The Wack Yak has been in this cave all night and they're still standing here acting completely normal. Call it.",
    noSoak:"The Gambling Cave absorbed the night without losing a single yak. The Wack Yak moved through the packed darkness and came up empty. The communal warmth and closeness of the herd may have ironically provided cover to everyone. The cave noted the outcome with complete indifference. The wager continues.",
    soak:"Found in the back of the cavern at first light — pressed against the far wall like they were trying to disappear into the stone. The cave markings behind them record dozens of similar outcomes. Just another wager that didn't pay. The herd moves on but the Wack Yak moves with them." },
  { name:"The Torrential Tunnel", icon:"🚇", pos:"Deep Trail", bg:"#070707", bdr:"#9ca3af",
    card:"The storm forces the pack into The Torrential Tunnel — a long straight passage carved through the mountain's bone. Gray stone walls stretch ahead into darkness. Unfinished. Empty. No alcoves, no side passages, no relief. Just forward. The moment the last yak crosses the threshold, the ancient door seals shut behind the herd with a sound that echoes the entire length of the tunnel. Everyone stops. Everyone understands instantly. You are inside now. The tunnel does not open again until dawn. There is no way back. There is only forward — and the fact that somewhere in this line the Wack Yak is still standing.",
    host:"The Torrential Tunnel is sealed. The gray walls stretch in both directions with no end in sight. The herd is locked in for the night with no exits, no escape routes, and no way to know who in this line is the Wack Yak. The silence here is absolute. The mountain presses in from every side. Night actions begin — pass the device quietly.",
    day:"The herd moves through The Torrential Tunnel in uneasy single file. The gray walls offer nothing — no landmarks, no reference points, no sense of progress. At dawn the far door opens. The herd lines up to exit one by one. The last in line reaches the threshold — and the door closes. A deep echoing rain begins inside the tunnel. Water seeps from the ceiling and rains down on whoever was left behind. The mountain claimed its own. The rest of the herd emerges onto the trail. One fewer yak. The Wack Yak is still among them.",
    noSoak:"The Wack Yak moved through the tunnel darkness and came up empty. Every gray wall accounted for. Every yak made it to the far door this morning. The tunnel noted this with complete indifference. It will have another opportunity.",
    soak:"At the midpoint of The Torrential Tunnel the herd stopped moving. One yak didn't start again. Left exactly where they stood — gray wall on one side, gray wall on the other. The sealed door somewhere impossibly far behind them. The herd moves forward. The door does not reopen.",
    tunnelExit:"At dawn the far door opens. The herd lines up one by one. The last player in line reaches the threshold — the door closes before they can exit. A loud echoing rain begins inside the tunnel. Water begins seeping from the ceiling, raining down on the one left behind. They are eliminated. The mountain kept them." },
  { name:"The Creamery", icon:"🥛", pos:"Near Base Camp", bg:"#0a0800", bdr:"#fcd34d",
    card:"Near base camp — The Creamery. The herd rounds a bend in the lower trail and stops. Something is different here. The stone underfoot is smoother. A modest but unmistakably deliberate structure sits carved into the mountainside — clean lines, well kept, almost suspiciously maintained given everything the herd just survived. A central serving station dominates the space, stocked with the finest yak milk cream known to any mountain dweller. Civilized yaks built this. You are close enough to the bottom of the mountain that civilization has left its mark on the trail. The end is close. The Wack Yak knows it too.",
    host:"Night settles over The Creamery. The serving station sits immaculate in the dark — not a single surface out of place, not a drop of yak cream disturbed. The herd has come far enough down the mountain to find civilization. So has the Wack Yak. They are standing in this impossibly clean room right now, and they are very aware that the end of the mountain is close. Night actions begin — pass the device.",
    day:"Morning at The Creamery. The serving station is exactly as it was — pristine, stocked, absolutely spotless. Nobody knows who keeps it this way. Nobody asks. The yak cream is cold and BFW Pond is close and the Wack Yak is still standing in this group acting like they belong here. This is the second to last chance to get it right. Discuss everything. Trust your gut. The mountain is almost done.",
    noSoak:"The Creamery held through the night without losing a single yak. Even the Wack Yak seemed reluctant to cause chaos in a space this clean. The herd accepts the small miracle and prepares for the final descent to BFW Pond. One more vote. One more night. Do not waste either.",
    soak:"Found near the central serving station at first light — the only visible disruption in an otherwise immaculate space. The Creamery absorbed the loss quietly and cleanly without leaving a mark. The herd is smaller. BFW Pond is close. The Wack Yak is still standing here. This ends soon." },
  { name:"BFW Pond", icon:"🌊", pos:"Base Camp", bg:"#020c08", bdr:"#34d399",
    card:"BFW Pond. You're here. The mountain is behind you and the Illinois countryside stretches in every direction. The air smells clean and calm — completely untouched by whatever was happening up on Yak Peak. A wide green lawn rolls down from the treeline to the water's edge. The pond sits still, lily pads dotting the surface, a modest dock extending to a small aluminum boat tied at its end. The boat is — and there is no diplomatic way to say this — extremely small. The herd came here because this is where yaks come when the mountain becomes too much. The dock is dry. The shoreline is dry. The storm hasn't reached BFW Pond yet. But the Wack Yak is still standing on this lawn. Nobody gets on that boat until this is finished.",
    host:"Night falls over BFW Pond. The water is still. The tiny boat rocks gently at the dock — patient, completely unaware of what this herd survived to reach this shoreline. The Wack Yak is standing somewhere on this lawn right now, looking at that boat, calculating their last move. This is the final night on the mountain. Whatever happens in the dark here determines everything. Night actions begin — pass the device.",
    day:"Morning at BFW Pond. The lawn is dewy. The dock holds. The tiny aluminum boat is tied off exactly where the herd knew it would be, carrying a legendary capacity limit that has never once been successfully challenged. Final vote. Final answer. The herd made it all the way down this mountain together. One of them is the Wack Yak. Figure it out. Then whoever is left gets on that boat.",
    noSoak:"BFW Pond held through the night. The Wack Yak stood on this lawn in the dark and looked at the tiny boat and the lily pads and apparently decided against it tonight. The dock held. The boat held. The pond held. Final vote still awaits. This is the last one. Make it count.",
    soak:"Found on the lawn at BFW Pond at first light — this close to the water, this close to the boat, this close to the end. The pond stays calm. The lily pads haven't moved. The herd is one yak smaller at the final vote. The Wack Yak is still standing on this shoreline. End it now.",
    yakWin:"The last Wack Yak is gone. The shoreline exhales. One by one the surviving yaks walk down the dock and step carefully into the tiny aluminum boat — weight distributed, breath held, the legendary capacity limit treated with the reverence it deserves. The boat holds. Of course it holds. It always holds. The pond opens up ahead, calm and still and completely dry. The storm watches from the mountain's base and cannot follow. The boat pushes off from the dock. The herd made the right call coming here. Every single one of them — dry. 🛶",
    wyakWin:"The math was always wrong. The surviving yaks pile onto the dock in a panic — storm at their backs, the Wack Yak on the shoreline, the tiny aluminum boat the only exit remaining. Too many. Too fast. The legendary capacity limit finally meets its match. The boat goes slowly at first. Then all at once. Every single yak is completely, thoroughly, absolutely soaked — sitting in BFW Pond in the Illinois countryside while the Wack Yak stands dry on the shoreline watching. The herd came to BFW Pond because they thought it would save them. The pond had other plans. 🌊" },
];

// ── ROLE DISTRIBUTION — Always exactly 1 Wack Yak ───────────────────────────
const getDist = (n) => {
  const specials = ["wyak","blogBoy","kingNopeIDo","missionterry"];
  const available = Math.min(n, specials.length);
  const roles = specials.slice(0, available);
  while(roles.length < n) roles.push("yak");
  return roles;
};

const shuffle = a => { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=0|Math.random()*(i+1);[b[i],b[j]]=[b[j],b[i]];} return b; };

// ── SMALL COMPONENTS ──────────────────────────────────────────────────────────
const Btn = ({children,onClick,disabled,col="#f59e0b",txt="black",sm,full=true,cls=""}) => (
  <button onClick={onClick} disabled={disabled}
    style={{background:disabled?"#374151":col,color:disabled?"#6b7280":txt}}
    className={`${full?"w-full":""} ${sm?"py-2 px-4 text-sm":"py-4 px-5 text-base"} rounded-2xl font-black transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed ${cls}`}>
    {children}
  </button>
);
const Card = ({children,style={},cls=""}) => (
  <div style={{background:"rgba(0,0,0,0.45)",border:"1px solid rgba(255,255,255,0.1)",...style}} className={`rounded-2xl p-4 ${cls}`}>{children}</div>
);
const RolePill = ({rk}) => {
  const r=ROLES[rk]; if(!r) return null;
  return <span style={{background:r.col+"22",color:r.col,border:`1px solid ${r.col}44`}} className="px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">{r.icon} {r.name}</span>;
};

// ── SPIN WHEEL ────────────────────────────────────────────────────────────────
const SpinWheel = ({onResult}) => {
  const [rot,setRot]=useState(0); const [spinning,setSpinning]=useState(false); const [result,setResult]=useState(null);
  const spin = () => {
    if(spinning||result) return;
    setSpinning(true);
    const success = Math.random()>0.2;
    const extra = (3+Math.random()*3)*360;
    const base = success ? 90+Math.random()*216 : 306+Math.random()*54;
    setRot(r=>r+extra+base);
    setTimeout(()=>{ setSpinning(false); setResult(success?"✅":"❌"); setTimeout(()=>onResult(success),1200); },2000);
  };
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <svg width="112" height="112" viewBox="0 0 112 112" style={{transform:`rotate(${rot}deg)`,transition:spinning?"transform 2s cubic-bezier(0.17,0.67,0.12,0.99)":"none"}}>
          <path d="M56,56 L56,4 A52,52 0 1,1 39.4,103.4 Z" fill="#22c55e"/>
          <path d="M56,56 L39.4,103.4 A52,52 0 0,1 56,4 Z" fill="#ef4444"/>
          <circle cx="56" cy="56" r="7" fill="white"/>
        </svg>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5" style={{width:0,height:0,borderLeft:"7px solid transparent",borderRight:"7px solid transparent",borderTop:"14px solid white"}}/>
      </div>
      {!result && <Btn onClick={spin} disabled={spinning} col="#22c55e" sm full={false} cls="px-6">{spinning?"Spinning…":"Spin the Wheel 🎡"}</Btn>}
      {result && <p style={{color:result==="✅"?"#22c55e":"#ef4444"}} className="text-xl font-black">{result} {result==="✅"?"Protection HOLDS":"Protection FAILED"}</p>}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
export default function YakPeak() {
  const [phase,   setPhase]   = useState("setup");
  const [players, setPlayers] = useState([]);
  const [pName,setPName]=useState(""); const [pNick,setPNick]=useState(""); const [pTrait,setPTrait]=useState(null);
  const [showRules,setShowRules]=useState(false);
  const [rulesTab,setRulesTab]=useState("overview");

  // reveal
  const [revIdx,setRevIdx]=useState(0); const [showRole,setShowRole]=useState(false);

  // game
  const [round,setRound]=useState(0);
  const [locIdx,setLocIdx]=useState(0);

  // night
  const [nightStep,setNightStep]=useState(0);
  const [waitPass,setWaitPass]=useState(false);
  const [acts,setActs]=useState({soak:null,drizzle:null,protect:null,protectFailed:false,investigate:null,invResult:null,invTriggersDrizzle:false});
  const [spinDone,setSpinDone]=useState(false);

  // drizzle
  const [drizzleId,setDrizzleId]=useState(null);
  const [drizzleTriggeredP,setDrizzleTriggeredP]=useState(null);

  // missionterry
  const [mtUsed,setMtUsed]=useState(false);
  const [mtActivating,setMtActivating]=useState(false);
  const [mtConfirm,setMtConfirm]=useState(null);

  // vote — capped at alive count
  const [votes,setVotes]=useState({});
  const [votedOut,setVotedOut]=useState(null);

  // narrative
  const [nightDead,setNightDead]=useState(null);
  const [narrative,setNarrative]=useState(""); const [loading,setLoading]=useState(false);

  // winner
  const [winner,setWinner]=useState(null);

  const alive = players.filter(p=>p.alive);
  const totalVotesCast = Object.values(votes).reduce((a,b)=>a+b,0);
  const votesRemaining = alive.length - totalVotesCast;
  const loc = LOCS[locIdx % LOCS.length];

  const nightRoles = ["wyak","blogBoy","kingNopeIDo"].filter(r=>alive.some(p=>p.role===r));
  const curNightRole = nightRoles[nightStep];
  const curNightPlayer = alive.find(p=>p.role===curNightRole);

  // ── WIN CHECK ──────────────────────────────────────────────────────────────
  const checkWin = useCallback((ps=players) => {
    const a = ps.filter(p=>p.alive);
    const wyaks = a.filter(p=>p.role==="wyak");
    const village = a.filter(p=>p.role!=="wyak");
    if(wyaks.length===0){ setWinner("yak"); return "yak"; }
    if(wyaks.length>=village.length){ setWinner("wyak"); return "wyak"; }
    return null;
  },[players]);

  useEffect(()=>{
    if(["voteResult","dayReveal"].includes(phase)){
      const w=checkWin();
      if(w) setTimeout(()=>setPhase("gameOver"),2800);
    }
  },[players,phase]);

  // ── SETUP ─────────────────────────────────────────────────────────────────
  const addPlayer = () => {
    if(!pName.trim()||!pTrait||players.length>=12) return;
    setPlayers(p=>[...p,{id:Date.now(),name:pName.trim(),nick:pNick.trim(),trait:pTrait,role:null,alive:true,lostVote:false,savedLast:false}]);
    setPName(""); setPNick(""); setPTrait(null);
  };
  const startGame = () => {
    if(players.length<4) return;
    const roles = shuffle(getDist(players.length));
    setPlayers(p=>p.map((pl,i)=>({...pl,role:roles[i]})));
    setRevIdx(0); setShowRole(false); setPhase("roleReveal");
  };

  // ── NIGHT ─────────────────────────────────────────────────────────────────
  const beginNight = useCallback(()=>{
    setNightStep(0); setWaitPass(true); setSpinDone(false);
    setActs({soak:null,drizzle:null,protect:null,protectFailed:false,investigate:null,invResult:null,invTriggersDrizzle:false});
    setLocIdx(l=>l+1); setPhase("night");
  },[]);

  const advanceNight = () => {
    if(nightStep<nightRoles.length-1){ setNightStep(s=>s+1); setWaitPass(true); }
    else resolveNight();
  };

  const resolveNight = () => {
    const {soak,drizzle,protect,protectFailed,investigate,invTriggersDrizzle} = acts;
    let dead = null;
    let newPlayers = [...players];
    let drizzleFiredPlayer = null;

    if(invTriggersDrizzle && drizzleId){
      const dp = newPlayers.find(p=>p.id===drizzleId&&p.alive);
      if(dp){ drizzleFiredPlayer=dp; newPlayers=newPlayers.map(p=>p.id===dp.id?{...p,alive:false}:p); }
    }
    setDrizzleId(drizzle&&drizzle!=="skip"?drizzle:null);

    const isProtected = protect===soak && !protectFailed;
    if(soak && !isProtected){
      const dp = newPlayers.find(p=>p.id===soak&&p.alive);
      if(dp){ dead=dp; newPlayers=newPlayers.map(p=>p.id===soak?{...p,alive:false}:p); }
    }

    const savedId = (protect&&!protectFailed&&isProtected) ? protect : null;
    newPlayers = newPlayers.map(p=>({...p,savedLast:p.id===savedId}));

    setPlayers(newPlayers);
    setNightDead(dead);
    setDrizzleTriggeredP(drizzleFiredPlayer);
    setRound(r=>r+1);
    setLocIdx(l=>l+1);
    fetchNarrative(dead, drizzleFiredPlayer, newPlayers);
    setPhase("dayReveal");
  };

  const fetchNarrative = async (dead,drizzleDead,ps) => {
    setLoading(true); setNarrative("");
    const currentLoc = LOCS[(locIdx+1)%LOCS.length];
    const plist = ps.filter(p=>p.alive).map(p=>`${p.name}${p.nick?` "${p.nick}"`:""}`).join(", ");
    const deadText = drizzleDead
      ? `${drizzleDead.name}${drizzleDead.nick?` (aka "${drizzleDead.nick}")`:"" } was drizzled — they triggered their own elimination at dawn.`
      : dead
        ? `${dead.name}${dead.nick?` (aka "${dead.nick}")`:"" } was soaked and eliminated overnight.`
        : "Nobody was soaked last night. The Wack Yak missed their mark.";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        model:"claude-sonnet-4-20250514",max_tokens:130,
        messages:[{role:"user",content:`Write a punchy Barstool Sports-style update for a social deduction party game called Yak Peak set at Barstool Sports Chicago. Surviving players: ${plist}. Last night: ${deadText}. Location: ${currentLoc.name} (${currentLoc.pos}). Write a tabloid headline and ONE funny sentence referencing the location and players by name. Format EXACTLY:\nHEADLINE: [text]\nRECAP: [one sentence]\nUnder 75 words total.`}]
      })});
      const d=await res.json();
      setNarrative(d.content?.[0]?.text||fallback(dead||drizzleDead));
    } catch { setNarrative(fallback(dead||drizzleDead)); }
    setLoading(false);
  };
  const fallback = dead => dead
    ? `HEADLINE: ${dead.name} Left Absolutely Drenched on Yak Peak\nRECAP: Soaked from head to hoof — the mountain showed no mercy and neither did the Wack Yak.`
    : `HEADLINE: Wack Yak Strikes Out — Entire Herd Somehow Survives\nRECAP: Against all logic every yak made it through the night and now the paranoia is completely out of control.`;

  // ── DRIZZLE TRIGGER ───────────────────────────────────────────────────────
  const triggerDrizzle = () => {
    const p = players.find(pl=>pl.id===drizzleId&&pl.alive);
    if(!p) return;
    const newPs = players.map(pl=>pl.id===p.id?{...pl,alive:false}:pl);
    setPlayers(newPs); setDrizzleTriggeredP(p); setDrizzleId(null);
    checkWin(newPs);
  };

  // ── MISSIONTERRY ──────────────────────────────────────────────────────────
  const activateMT = (targetId) => {
    const target = players.find(p=>p.id===targetId);
    if(!target) return;
    const innocent = target.role!=="wyak";
    const newPs = players.map(p=>{
      if(p.id===targetId) return {...p,alive:false};
      if(p.role==="missionterry"&&innocent) return {...p,lostVote:true};
      return p;
    });
    setPlayers(newPs); setMtUsed(true); setMtActivating(false); setMtConfirm(null);
    checkWin(newPs);
  };

  // ── VOTE (CAPPED) ─────────────────────────────────────────────────────────
  const addVote = (id) => {
    if(totalVotesCast >= alive.length) return;
    setVotes(v=>({...v,[id]:(v[id]||0)+1}));
  };
  const removeVote = (id) => {
    setVotes(v=>{const n={...v};if((n[id]||0)>0)n[id]--;return n;});
  };
  const resolveVote = () => {
    let max=0,target=null;
    const tied = alive.filter(p=>(votes[p.id]||0)>0&&(()=>{const v=votes[p.id]||0;if(v>max){max=v;target=p;return false;}return v===max&&max>0;})()).length>1;
    // recompute properly
    let maxV=0;
    Object.entries(votes).forEach(([id,v])=>{ if(v>maxV) maxV=v; });
    const topPlayers = alive.filter(p=>(votes[p.id]||0)===maxV&&maxV>0);
    const final = topPlayers.length===1?topPlayers[0]:null;
    setVotedOut(final);
    if(final){ setPlayers(ps=>ps.map(p=>p.id===final.id?{...p,alive:false}:p)); }
    setVotes({}); setPhase("voteResult");
  };

  const reset = () => {
    setPhase("setup");setPlayers([]);setRound(0);setLocIdx(0);
    setRevIdx(0);setShowRole(false);setNightStep(0);setWaitPass(false);
    setActs({soak:null,drizzle:null,protect:null,protectFailed:false,investigate:null,invResult:null,invTriggersDrizzle:false});
    setSpinDone(false);setDrizzleId(null);setDrizzleTriggeredP(null);
    setMtUsed(false);setMtActivating(false);setMtConfirm(null);
    setVotes({});setVotedOut(null);setNightDead(null);setNarrative("");setWinner(null);
    setPName("");setPNick("");setPTrait(null);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ── SETUP SCREEN ──────────────────────────────────────────────────────────
  if(phase==="setup") return (
    <div style={{background:"linear-gradient(135deg,#060818,#0a0018)",minHeight:"100vh"}} className="flex flex-col items-center p-5 text-white">
      <div className="max-w-md w-full space-y-5 pt-4">
        <div className="text-center">
          <div className="text-7xl mb-2">🏔️</div>
          <h1 style={{color:"#f59e0b"}} className="text-5xl font-black tracking-tight">YAK PEAK</h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Social Deduction · Barstool Chicago Edition</p>
          <p className="text-gray-600 text-xs mt-0.5">4–12 players · Pass the phone · One Wack Yak</p>
        </div>

        <button onClick={()=>setShowRules(r=>!r)} style={{color:"#f59e0b"}} className="text-sm font-bold underline w-full text-center">
          {showRules?"▲ Hide Rules":"▼ How to Play — Full Rules"}
        </button>

        {showRules&&<Card>
          {/* Tab nav */}
          <div className="flex gap-1 mb-3">
            {["overview","roles","voting","night"].map(tab=>(
              <button key={tab} onClick={()=>setRulesTab(tab)}
                style={{background:rulesTab===tab?"#f59e0b":"rgba(255,255,255,0.05)",color:rulesTab===tab?"black":"#9ca3af"}}
                className="flex-1 py-1.5 rounded-lg text-xs font-black capitalize transition-all">
                {tab}
              </button>
            ))}
          </div>

          {rulesTab==="overview"&&<div className="text-xs leading-5 text-gray-300 space-y-3">
            <div><b className="text-white block mb-1">🌧️ The Premise</b>
            A storm is rolling into Yak Peak. One player — the Wack Yak — is secretly working to soak the entire herd. The rest of the yaks must identify and banish the Wack Yak before it's too late. The herd descends from the summit through six locations, losing members along the way, before reaching their final destination: BFW Pond.</div>
            <div><b className="text-white block mb-1">🎭 Role Assignment</b>
            Once all players are added, roles are randomly shuffled and assigned automatically. Every game has exactly ONE Wack Yak. The remaining special roles — Blog Boy, King Nope-I-Do, and The Missionterry — fill out the roster. Any remaining players become standard Yaks. Each player sees their role privately by passing the device.</div>
            <div><b className="text-white block mb-1">🏆 Win Conditions</b>
            <span className="text-yellow-400 font-bold">Yaks win</span> when the Wack Yak is identified and banished — the surviving herd boards the boat at BFW Pond and sails away dry.<br/>
            <span className="text-blue-400 font-bold">Wack Yak wins</span> when the Wack Yak equals or outnumbers the remaining yaks — the boat sinks and everyone gets soaked.</div>
            <div><b className="text-white block mb-1">📍 Locations</b>
            The game progresses through six locations: The Yak Shack (Summit) → Donnie's Den → The Gambling Cave → The Torrential Tunnel → The Creamery → BFW Pond (Base Camp). Each location has unique flavor text and host narration read aloud each phase.</div>
          </div>}

          {rulesTab==="roles"&&<div className="space-y-3">
            {Object.entries(ROLES).map(([k,r])=>(
              <div key={k} className="rounded-xl p-3" style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${r.col}33`}}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{r.icon}</span>
                  <span style={{color:r.col}} className="font-black text-sm">{r.name}</span>
                  <span style={{background:r.col+"22",color:r.col}} className="text-xs px-2 py-0.5 rounded-full ml-auto">{r.team==="yak"?"🦬 Yak Team":"🌧️ Wack Yak"}</span>
                </div>
                <p className="text-gray-400 text-xs leading-4">{r.desc}</p>
              </div>
            ))}
          </div>}

          {rulesTab==="voting"&&<div className="text-xs leading-5 text-gray-300 space-y-3">
            <div><b className="text-white block mb-1">🗳️ How Voting Works</b>
            After every night phase and morning reveal, the surviving herd gathers to discuss and vote. Any player can be nominated. Votes are tallied using the + and − buttons on the voting screen.</div>
            <div><b className="text-white block mb-1">📊 Vote Cap Rule</b>
            The total number of votes cast in any round is capped at the number of living players. If 6 yaks are alive, exactly 6 votes can be cast total across all players. This prevents over-voting and keeps elimination math accurate. The screen shows how many votes remain before the cap is hit.</div>
            <div><b className="text-white block mb-1">⚖️ Tied Votes</b>
            If two or more players receive the same highest vote total, the vote is tied and nobody is banished that round. The game proceeds to the next night phase.</div>
            <div><b className="text-white block mb-1">🚫 Lost Vote Penalty</b>
            If The Missionterry eliminates an innocent Yak, they lose their voting rights for the remainder of the game. Their name will show a 🚫 indicator on the voting screen and their votes will not be counted.</div>
            <div><b className="text-white block mb-1">⚡ The Missionterry Exception</b>
            The Missionterry can bypass the vote entirely by activating their power during the day discussion phase. This is an immediate daytime elimination — no vote required. It uses their one-time power permanently.</div>
          </div>}

          {rulesTab==="night"&&<div className="text-xs leading-5 text-gray-300 space-y-3">
            <div><b className="text-white block mb-1">🌙 Night Phase Flow</b>
            When night begins, all players close their eyes. The device is passed privately to each special role in order: Wack Yak first, then Blog Boy, then King Nope-I-Do. Each player takes their action silently and passes the device back face-down before the next role is called.</div>
            <div><b className="text-white block mb-1">🌧️ Wack Yak Night Actions</b>
            The Wack Yak submits TWO targets each night. First: the SOAK target — the yak they want eliminated at dawn. Second: the DRIZZLE target — a yak marked with a hidden condition. Both selections are locked in before passing the device. The Wack Yak cannot soak a fellow Wack Yak.</div>
            <div><b className="text-white block mb-1">💧 The Drizzle System</b>
            The drizzled player carries a hidden mark into the day phase. The HOST watches discussion privately. The drizzle fires and that player is immediately eliminated mid-discussion if they: (1) directly accuse the Wack Yak by name, (2) defend a previously soaked player, or (3) claim to have a special role or special information. The drizzle also fires automatically at dawn if the Blog Boy investigates the drizzled player overnight.</div>
            <div><b className="text-white block mb-1">🗞️ Blog Boy Night Action</b>
            Blog Boy secretly investigates one player and receives a private result: DRY (safe yak) or DAMP (Wack Yak). They are never required to share this. If they investigate the drizzled player, the drizzle triggers at dawn. Blog Boy knows they caused it.</div>
            <div><b className="text-white block mb-1">👑 King Nope-I-Do Night Action</b>
            King Nope-I-Do selects one player to protect. After selecting, they spin the wheel. 80% chance the protection holds. 20% chance it fails. King Nope-I-Do sees the result privately. If it holds, the protected player receives a private saved message the next morning.</div>
          </div>}
        </Card>}

        {/* Add player form */}
        <Card>
          <h2 className="font-black text-lg mb-3">⛰️ Add Players</h2>
          <div className="space-y-2">
            <input value={pName} onChange={e=>setPName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addPlayer()}
              placeholder="Player name *" className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-yellow-500 outline-none text-white placeholder-gray-700 text-sm"/>
            <input value={pNick} onChange={e=>setPNick(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addPlayer()}
              placeholder="Nickname / callsign (optional — used in AI headlines)" className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-yellow-500 outline-none text-white placeholder-gray-700 text-sm"/>
            <p className="text-xs text-gray-600 font-bold uppercase tracking-wider pt-1">Choose your Yak Peak trait *</p>
            {TRAITS.map(t=>(
              <button key={t.id} onClick={()=>setPTrait(t.id)}
                style={{background:pTrait===t.id?"#f59e0b22":"rgba(0,0,0,0.3)",border:pTrait===t.id?"2px solid #f59e0b":"1px solid rgba(255,255,255,0.08)"}}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all hover:brightness-125">
                <span className="text-xl">{t.icon}</span>
                <div>
                  <span className={`font-bold text-sm ${pTrait===t.id?"text-yellow-400":"text-white"}`}>{t.name}</span>
                  <p className="text-gray-600 text-xs">{t.flavor.split(".")[0]}.</p>
                </div>
              </button>
            ))}
            <Btn onClick={addPlayer} disabled={!pName.trim()||!pTrait||players.length>=12} col="#f59e0b" sm>+ Add Player</Btn>
          </div>
        </Card>

        {players.length>0&&<Card>
          <h2 className="font-black text-lg mb-2">🦬 Roster ({players.length}/12)</h2>
          <p className="text-xs text-gray-600 mb-2">This game will have exactly <b className="text-yellow-500">1 Wack Yak</b> regardless of player count.</p>
          <div className="space-y-1.5">
            {players.map((p,i)=>{
              const tr=TRAITS.find(t=>t.id===p.trait);
              return(
                <div key={p.id} className="flex items-center gap-2 bg-gray-900/60 rounded-xl px-3 py-2">
                  <span className="text-gray-700 text-xs w-4">{i+1}</span>
                  <span>{tr?.icon||"🦬"}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-sm">{p.name}</span>
                    {p.nick&&<span className="text-gray-500 text-xs ml-1.5">"{p.nick}"</span>}
                    <span className="text-gray-700 text-xs ml-2">· {tr?.name}</span>
                  </div>
                  <button onClick={()=>setPlayers(ps=>ps.filter(pl=>pl.id!==p.id))} className="text-red-600 text-xl w-6 leading-none hover:text-red-400">×</button>
                </div>
              );
            })}
          </div>
        </Card>}

        <Btn onClick={startGame} disabled={players.length<4} col="#1d4ed8" txt="white">
          {players.length<4?`Need ${4-players.length} more player(s)`:"Assign Roles & Begin the Descent ⛈️"}
        </Btn>
      </div>
    </div>
  );

  // ── ROLE REVEAL ───────────────────────────────────────────────────────────
  if(phase==="roleReveal"){
    const p=players[revIdx]; const r=ROLES[p.role]; const tr=TRAITS.find(t=>t.id===p.trait);
    const isLast=revIdx===players.length-1;
    const next=()=>{ setShowRole(false); if(!isLast){setRevIdx(i=>i+1);}else{setPhase("openingNarrative");} };
    return(
      <div style={{background:"#060818",minHeight:"100vh"}} className="flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-sm w-full space-y-5 text-center">
          {!showRole?<>
            <div className="text-6xl animate-pulse">🔒</div>
            <h2 className="text-2xl font-black">Pass the device to:</h2>
            <div style={{color:"#f59e0b"}} className="text-4xl font-black">{p.name}</div>
            {p.nick&&<p className="text-gray-500">"{p.nick}"</p>}
            <p className="text-gray-700 text-sm">Make sure nobody else can see the screen 👀</p>
            <Btn onClick={()=>setShowRole(true)} col="#f59e0b">I'm {p.name} — Show My Role</Btn>
          </>:<>
            <div className="text-8xl">{r.icon}</div>
            <h2 className="text-3xl font-black" style={{color:r.col}}>{r.name}</h2>
            <span style={{background:r.col+"22",color:r.col,border:`1px solid ${r.col}44`}} className="px-4 py-1 rounded-full text-sm font-bold inline-block">
              {r.team==="yak"?"🦬 Yak Team":"🌧️ Wack Yak"}
            </span>
            <Card><p className="text-gray-300 text-sm leading-relaxed text-left">{r.desc}</p>
              <p style={{color:r.col}} className="text-xs font-bold italic mt-2">"{r.flavor}"</p>
            </Card>
            {tr&&<Card cls="text-left">
              <p className="text-xs text-gray-600 mb-1">Your Yak Peak trait:</p>
              <p style={{color:"#f59e0b"}} className="font-black">{tr.icon} {tr.name}</p>
              <p className="text-gray-500 text-xs mt-1">{tr.flavor}</p>
            </Card>}
            <Btn onClick={next} col="#374151" txt="white">{isLast?"All roles assigned — Continue →":"Got it — Pass the device →"}</Btn>
          </>}
          <p className="text-gray-800 text-xs">{revIdx+1} / {players.length}</p>
        </div>
      </div>
    );
  }

  // ── OPENING NARRATIVE ─────────────────────────────────────────────────────
  if(phase==="openingNarrative"){
    const plist = players.map(p=>p.nick?`${p.name} "${p.nick}"`:p.name).join(", ");
    return(
      <div style={{background:"linear-gradient(135deg,#060818,#0a0a0a)",minHeight:"100vh"}} className="flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="text-7xl mb-3">🏔️</div>
            <h1 style={{color:"#f59e0b"}} className="text-4xl font-black">Welcome to Yak Peak</h1>
            <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Host — Read This Aloud</p>
          </div>
          <Card style={{border:"1px solid #f59e0b44"}}>
            <p className="text-sm leading-7 text-gray-200">
              Welcome to <b className="text-yellow-400">Yak Peak</b>. The mountain is real. The storm is coming. And one of you — sitting in this exact circle right now — is the <b className="text-blue-400">Wack Yak</b>.
            </p>
            <p className="text-sm leading-7 text-gray-200 mt-3">
              You are all yaks: <b className="text-white">{plist}</b>. You started this journey together at the summit — right here at <b className="text-yellow-400">The Yak Shack</b>. The resting stones are warm. The carved walls hold the history of every herd that came before you. The purple trail map on the wall shows the path down. You know where you need to go. The problem is that someone in this circle has been working against the herd since before the first stone was carved.
            </p>
            <p className="text-sm leading-7 text-gray-200 mt-3">
              Each night the mountain goes dark and the Wack Yak makes their move — soaking one yak and marking another with a hidden drizzle. Each morning the herd wakes up, counts who's left, and votes to banish whoever they believe is responsible. The descent continues through six locations: from this summit all the way down to <b className="text-green-400">BFW Pond</b> at the base of the mountain.
            </p>
            <p className="text-sm leading-7 text-gray-200 mt-3">
              If the herd finds and banishes the Wack Yak — <b className="text-yellow-400">everyone who survived gets on the boat and sails away dry</b>. If the Wack Yak outlasts the herd — <b className="text-blue-400">the boat sinks and every yak gets absolutely soaked</b>.
            </p>
            <p className="text-sm leading-7 text-gray-200 mt-3">
              The storm is already here. It started at the summit. It started in this room. One of you knows exactly what they did.
            </p>
            <p style={{color:"#f59e0b"}} className="text-sm font-black mt-4 text-center">The first night on Yak Peak begins now. 🌧️</p>
          </Card>
          <Btn onClick={()=>beginNight()} col="#f59e0b">Begin Night 1 — The Yak Shack 🏔️</Btn>
        </div>
      </div>
    );
  }

  // ── NIGHT ─────────────────────────────────────────────────────────────────
  if(phase==="night"){
    const tBtn=(p,fn,disabled=false)=>(
      <button key={p.id} onClick={()=>!disabled&&fn(p)} disabled={disabled}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:brightness-125 active:scale-95 disabled:opacity-40"
        style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)"}}>
        <span className="text-2xl">🦬</span>
        <div className="flex-1"><span className="font-bold">{p.name}</span>{p.nick&&<span className="text-gray-600 text-xs ml-2">"{p.nick}"</span>}</div>
      </button>
    );

    if(waitPass) return(
      <div style={{background:"#04050f",minHeight:"100vh"}} className="flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-sm w-full space-y-5 text-center">
          <div className="text-7xl animate-pulse">🌧️</div>
          <h1 style={{color:"#60a5fa"}} className="text-4xl font-black">Night {round+1} Falls</h1>
          <div>
            <p style={{color:loc.bdr}} className="font-bold text-xl">{loc.icon} {loc.name}</p>
            <p className="text-gray-600 text-xs">{loc.pos} · {alive.length} yaks remaining</p>
          </div>
          <Card><p className="text-gray-400 text-xs italic leading-5">{loc.host}</p></Card>
          {curNightPlayer&&<>
            <div className="h-px bg-gray-800"/>
            <p className="text-gray-500 text-sm font-bold">All eyes closed. Pass the device to:</p>
            <div style={{color:"#f59e0b"}} className="text-3xl font-black">{curNightPlayer.name}</div>
            {curNightPlayer.nick&&<p className="text-gray-600 text-sm">"{curNightPlayer.nick}"</p>}
            <p style={{color:ROLES[curNightRole]?.col}} className="text-sm font-bold">{ROLES[curNightRole]?.icon} {ROLES[curNightRole]?.name}</p>
            <p className="text-gray-800 text-xs">Everyone else: eyes shut and device face down 👀</p>
            <Btn onClick={()=>setWaitPass(false)} col="#1e3a8a" txt="white">I'm {curNightPlayer.name} — Ready</Btn>
          </>}
        </div>
      </div>
    );

    // WACK YAK NIGHT ACTIONS
    if(curNightRole==="wyak"){
      const soakDone=acts.soak!==null; const drizzleDone=acts.drizzle!==null;
      if(!soakDone) return(
        <div style={{background:"#04050f",minHeight:"100vh"}} className="flex flex-col items-center p-5 text-white">
          <div className="max-w-sm w-full space-y-4 pt-6">
            <div className="text-center"><div className="text-5xl">🌧️</div>
              <h2 className="text-xl font-black mt-1 text-blue-400">Wack Yak — Action 1 of 2</h2>
              <p className="text-white font-bold mt-1">Choose your SOAK target</p>
              <p className="text-gray-600 text-xs mt-1">This yak will be eliminated at dawn unless protected by King Nope-I-Do.</p>
            </div>
            <div className="space-y-2">{alive.map(p=>tBtn(p,t=>setActs(a=>({...a,soak:t.id}))))}</div>
          </div>
        </div>
      );
      if(!drizzleDone) return(
        <div style={{background:"#04050f",minHeight:"100vh"}} className="flex flex-col items-center p-5 text-white">
          <div className="max-w-sm w-full space-y-4 pt-6">
            <div className="text-center"><div className="text-5xl">💧</div>
              <h2 className="text-xl font-black mt-1 text-indigo-400">Wack Yak — Action 2 of 2</h2>
              <p className="text-white font-bold mt-1">Choose your DRIZZLE target</p>
            </div>
            <Card>
              <p className="text-xs text-gray-400 font-bold mb-1">This player is marked. Drizzle fires mid-day if they:</p>
              <ul className="text-xs text-gray-500 space-y-0.5">
                <li>• Directly accuse you (the Wack Yak) by name</li>
                <li>• Defend a previously soaked player</li>
                <li>• Claim to have a special role or special information</li>
                <li>• Were investigated by Blog Boy tonight (triggers at dawn)</li>
              </ul>
            </Card>
            <div className="space-y-2">{alive.filter(p=>p.id!==acts.soak).map(p=>tBtn(p,t=>setActs(a=>({...a,drizzle:t.id}))))}</div>
            <Btn onClick={()=>setActs(a=>({...a,drizzle:"skip"}))} col="#374151" txt="white" sm>Skip drizzle this round</Btn>
          </div>
        </div>
      );
      return(
        <div style={{background:"#04050f",minHeight:"100vh"}} className="flex flex-col items-center justify-center p-6 text-white">
          <div className="max-w-sm w-full space-y-4 text-center">
            <div className="text-5xl">✅</div>
            <h2 className="text-xl font-black text-blue-400">Wack Yak Actions Locked</h2>
            <Card>
              <div className="space-y-2 text-sm text-left">
                <div className="flex gap-2 items-center"><span className="text-gray-500 w-20">💧 Soak:</span><span className="font-bold text-red-400">{players.find(p=>p.id===acts.soak)?.name||"—"}</span></div>
                <div className="flex gap-2 items-center"><span className="text-gray-500 w-20">🌦️ Drizzle:</span><span className="font-bold text-indigo-400">{acts.drizzle==="skip"?"Skipped":players.find(p=>p.id===acts.drizzle)?.name||"—"}</span></div>
              </div>
            </Card>
            <p className="text-gray-700 text-xs">Your actions are locked. Go back to sleep 😴</p>
            <Btn onClick={advanceNight} col="#374151" txt="white" sm>Done — Pass the device face down</Btn>
          </div>
        </div>
      );
    }

    // BLOG BOY NIGHT ACTION
    if(curNightRole==="blogBoy"){
      const {investigate,invResult,invTriggersDrizzle}=acts;
      if(!investigate) return(
        <div style={{background:"#04050f",minHeight:"100vh"}} className="flex flex-col items-center p-5 text-white">
          <div className="max-w-sm w-full space-y-4 pt-6">
            <div className="text-center"><div className="text-5xl">🗞️</div>
              <h2 className="text-xl font-black mt-1 text-yellow-400">Blog Boy — Investigate</h2>
              <p className="text-gray-400 text-xs mt-1">Choose one player to investigate. DRY = safe. DAMP = Wack Yak. Your call what to do with the intel — you are never required to share it.</p>
            </div>
            <div className="space-y-2">{alive.filter(p=>p.role!=="blogBoy").map(p=>tBtn(p,t=>{
              const damp=t.role==="wyak";
              const firesDrizzle=acts.drizzle&&acts.drizzle!=="skip"&&t.id===acts.drizzle;
              setActs(a=>({...a,investigate:t.id,invResult:damp?"DAMP":"DRY",invTriggersDrizzle:!!firesDrizzle}));
            }))}</div>
          </div>
        </div>
      );
      return(
        <div style={{background:"#04050f",minHeight:"100vh"}} className="flex flex-col items-center justify-center p-6 text-white">
          <div className="max-w-sm w-full space-y-5 text-center">
            <div className="text-7xl">{invResult==="DAMP"?"💧":"☀️"}</div>
            <h3 className="text-3xl font-black">{players.find(p=>p.id===investigate)?.name}</h3>
            <div style={{color:invResult==="DAMP"?"#60a5fa":"#4ade80"}} className="text-2xl font-black">
              {invResult==="DAMP"?"💧 DAMP — That's the Wack Yak.":"☀️ DRY — Safe yak."}
            </div>
            {invTriggersDrizzle
              ? <Card style={{border:"1px solid #7f1d1d"}}>
                  <p className="text-red-400 text-sm font-black mb-1">⚠️ Drizzle Triggered</p>
                  <p className="text-gray-300 text-xs leading-5">You investigated <b className="text-white">{players.find(p=>p.id===investigate)?.name}</b> and they were the Wack Yak's drizzle target tonight. Your investigation fires the drizzle automatically at dawn — they will be eliminated before day discussion begins. You know exactly what happened. You do not need to tell anyone else. Use this information carefully.</p>
                </Card>
              : <Card><p className="text-gray-500 text-xs">This intel is yours. Share it, sit on it, or use it strategically. Nobody will know what you found unless you tell them.</p></Card>
            }
            <Btn onClick={advanceNight} col="#374151" txt="white" sm>Noted — Pass the device face down</Btn>
          </div>
        </div>
      );
    }

    // KING NOPE-I-DO NIGHT ACTION
    if(curNightRole==="kingNopeIDo"){
      const {protect,protectFailed}=acts;
      if(!protect) return(
        <div style={{background:"#04050f",minHeight:"100vh"}} className="flex flex-col items-center p-5 text-white">
          <div className="max-w-sm w-full space-y-4 pt-6">
            <div className="text-center"><div className="text-5xl">👑</div>
              <h2 className="text-xl font-black mt-1 text-green-400">King Nope-I-Do — Protect</h2>
              <p className="text-gray-400 text-xs mt-1">Choose one yak to shield from the soak tonight. You may protect yourself. After choosing, you will spin the wheel — 80% success, 20% fail. You will see the result privately.</p>
            </div>
            <div className="space-y-2">{alive.map(p=>tBtn(p,t=>setActs(a=>({...a,protect:t.id}))))}</div>
          </div>
        </div>
      );
      if(!spinDone) return(
        <div style={{background:"#04050f",minHeight:"100vh"}} className="flex flex-col items-center justify-center p-6 text-white">
          <div className="max-w-sm w-full space-y-5 text-center">
            <div className="text-5xl">👑</div>
            <h2 className="text-xl font-black text-green-400">Spin for Protection</h2>
            <p className="text-gray-300 text-sm">Protecting: <b className="text-white">{players.find(p=>p.id===protect)?.name}</b></p>
            <Card>
              <div className="flex justify-around text-xs text-gray-500 mb-3">
                <span>🟢 80% — Holds</span><span>🔴 20% — Fails</span>
              </div>
              <SpinWheel onResult={success=>{setActs(a=>({...a,protectFailed:!success}));setSpinDone(true);}}/>
            </Card>
          </div>
        </div>
      );
      return(
        <div style={{background:"#04050f",minHeight:"100vh"}} className="flex flex-col items-center justify-center p-6 text-white">
          <div className="max-w-sm w-full space-y-5 text-center">
            <div className="text-6xl">{protectFailed?"💔":"👑"}</div>
            <h2 className="text-xl font-black" style={{color:protectFailed?"#ef4444":"#22c55e"}}>
              {protectFailed?"Protection Failed — The Rain Got Through":"Nope-I-Do — Protection Activated"}
            </h2>
            <Card>
              <p className="text-gray-300 text-sm leading-5">
                {protectFailed
                  ? `Your protection attempt on ${players.find(p=>p.id===protect)?.name} failed tonight. The soak will go through if they were targeted. Nobody will know you tried. Carry this privately.`
                  : `${players.find(p=>p.id===protect)?.name} is shielded for tonight. If the Wack Yak targeted them, the soak will not go through. They will receive a private message tomorrow morning letting them know they were saved — but they will not know it was you.`
                }
              </p>
            </Card>
            <Btn onClick={advanceNight} col="#374151" txt="white" sm>Done — Pass the device face down</Btn>
          </div>
        </div>
      );
    }
  }

  // ── DAY REVEAL ────────────────────────────────────────────────────────────
  if(phase==="dayReveal"){
    const revLoc=LOCS[(locIdx-1+LOCS.length)%LOCS.length];
    const hl=narrative.split("\n").find(l=>l.startsWith("HEADLINE:"))?.replace("HEADLINE:","").trim();
    const rc=narrative.split("\n").find(l=>l.startsWith("RECAP:"))?.replace("RECAP:","").trim();
    return(
      <div style={{background:`linear-gradient(135deg,${revLoc.bg},#0a0a18)`,minHeight:"100vh"}} className="flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-md w-full space-y-5 text-center">
          <div className="text-6xl">{revLoc.icon}</div>
          <div>
            <p style={{color:revLoc.bdr}} className="text-sm font-bold uppercase tracking-widest">{revLoc.name}</p>
            <p className="text-gray-600 text-xs">{revLoc.pos} · Morning of Day {round} · {alive.length} yaks remaining</p>
          </div>
          <h1 style={{color:"#fbbf24"}} className="text-2xl font-black">☀️ Dawn Breaks on Yak Peak</h1>

          {drizzleTriggeredP&&<Card style={{border:"1px solid #4338ca"}}>
            <div className="text-4xl mb-1">💧</div>
            <h2 className="text-xl font-black text-indigo-400">Drizzle Fired at Dawn</h2>
            <p className="text-white font-bold text-lg">{drizzleTriggeredP.name} has been soaked</p>
            {drizzleTriggeredP.nick&&<p className="text-gray-500 text-sm">"{drizzleTriggeredP.nick}"</p>}
            <p className="text-gray-500 text-xs mt-2">The Blog Boy's overnight investigation triggered the Wack Yak's drizzle mark. The elimination fired before anyone could speak. The Blog Boy knows what happened. Nobody else does.</p>
            <div className="mt-2"><RolePill rk={drizzleTriggeredP.role}/></div>
          </Card>}

          {nightDead?<Card style={{border:"1px solid #7f1d1d"}}>
            <div className="text-4xl mb-1">💧</div>
            <h2 className="text-xl font-black text-red-400">{nightDead.name} Got Soaked</h2>
            {nightDead.nick&&<p className="text-gray-500 text-sm">"{nightDead.nick}"</p>}
            <p className="text-gray-500 text-xs mt-1 italic">{revLoc.soak}</p>
            <div className="mt-2"><RolePill rk={nightDead.role}/></div>
          </Card>:!drizzleTriggeredP&&<Card style={{border:"1px solid #14532d"}}>
            <div className="text-4xl mb-1">🌤️</div>
            <h2 className="text-xl font-black text-green-400">Nobody Got Soaked Last Night</h2>
            <p className="text-gray-500 text-xs mt-1 italic">{revLoc.noSoak}</p>
          </Card>}

          {loading?<p className="animate-pulse text-gray-600 text-sm">📰 Generating Barstool headline…</p>
          :hl&&<Card>
            <p style={{color:"#fbbf24"}} className="font-black text-base leading-snug">📰 {hl}</p>
            {rc&&<p className="text-gray-400 text-sm mt-2">{rc}</p>}
          </Card>}

          <Btn onClick={()=>{setDrizzleTriggeredP(null);setPhase("dayPhase");}} col="#f59e0b">
            The Herd Gathers — Begin Day Discussion →
          </Btn>
        </div>
      </div>
    );
  }

  // ── DAY PHASE ─────────────────────────────────────────────────────────────
  if(phase==="dayPhase"){
    const dayLoc=LOCS[(locIdx-2+LOCS.length)%LOCS.length];
    const mtPlayer=alive.find(p=>p.role==="missionterry");
    const drizzledName=players.find(p=>p.id===drizzleId)?.name;
    const hasDrizzle=!!drizzleId&&alive.some(p=>p.id===drizzleId);
    return(
      <div style={{background:`linear-gradient(135deg,${dayLoc.bg},#0a0a18)`,minHeight:"100vh"}} className="flex flex-col items-center p-5 text-white">
        <div className="max-w-md w-full space-y-4 pt-4">
          <div className="text-center">
            <div className="text-4xl">{dayLoc.icon}</div>
            <h1 className="text-xl font-black mt-1" style={{color:dayLoc.bdr}}>{dayLoc.name} — Day {round}</h1>
            <p className="text-gray-600 text-xs">{alive.length} yaks remaining · {dayLoc.pos}</p>
          </div>
          <Card><p className="text-gray-300 text-xs italic leading-5">{dayLoc.day}</p></Card>

          {/* Saved player private notification */}
          {alive.filter(p=>p.savedLast).map(p=>(
            <Card key={p.id} style={{border:"1px solid #166534"}}>
              <p className="text-green-400 text-xs font-black mb-1">👑 HOST — Pass device privately to {p.name}</p>
              <p className="text-gray-500 text-xs italic">"Somebody said Nope-I-Do on you last night. You're still dry. Don't waste it."</p>
              <p className="text-gray-600 text-xs mt-1">Pass back after they've read this. Do not reveal who saved them.</p>
            </Card>
          ))}

          {/* Donnie's Den spirit stirs event */}
          {dayLoc.name==="Donnie's Den"&&<Card style={{border:"1px solid #f97316"}}>
            <p className="text-orange-400 text-xs font-bold">{dayLoc.spiritStirs}</p>
          </Card>}

          {/* HOST DRIZZLE MONITOR */}
          {hasDrizzle&&<Card style={{border:"1px solid #991b1b"}}>
            <p className="text-red-400 font-black text-xs mb-1">🌦️ HOST ONLY — Active Drizzle Monitor</p>
            <p className="text-xs text-gray-400 mb-1"><b className="text-white">{drizzledName}</b> is marked. Watch discussion. Trigger immediately if they:</p>
            <ul className="text-xs text-gray-500 space-y-0.5 mb-3">
              <li>• Directly accuse the Wack Yak by name</li>
              <li>• Defend a previously soaked player</li>
              <li>• Claim a special role or special information</li>
            </ul>
            <Btn onClick={triggerDrizzle} col="#7f1d1d" txt="white" sm>
              ⚡ FIRE DRIZZLE — Eliminate {drizzledName} now
            </Btn>
          </Card>}

          {/* The Missionterry panel */}
          {mtPlayer&&!mtUsed&&<Card style={{border:"1px solid #7e22ce"}}>
            {!mtActivating?<>
              <p className="text-purple-400 font-black text-xs mb-1">🎯 The Missionterry — Power Available</p>
              <p className="text-gray-500 text-xs mb-2">Pass device to <b className="text-white">{mtPlayer.name}</b> if they choose to activate their one-time blow-up mid-discussion.</p>
              <Btn onClick={()=>setMtActivating(true)} col="#7e22ce" txt="white" sm>I'm {mtPlayer.name} — Activate The Missionterry</Btn>
            </>:!mtConfirm?<>
              <p className="text-purple-400 font-black text-sm mb-2">🎯 Choose your target — no going back:</p>
              <div className="space-y-1.5">
                {alive.filter(p=>p.role!=="missionterry").map(p=>(
                  <button key={p.id} onClick={()=>setMtConfirm(p.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all hover:brightness-125"
                    style={{background:"rgba(126,34,206,0.15)",border:"1px solid rgba(168,85,247,0.3)"}}>
                    <span>🦬</span><span className="font-bold text-sm">{p.name}</span>
                    {p.nick&&<span className="text-gray-600 text-xs ml-1">"{p.nick}"</span>}
                  </button>
                ))}
              </div>
              <Btn onClick={()=>setMtActivating(false)} col="#374151" txt="white" sm cls="mt-2">Cancel — Not yet</Btn>
            </>:<div className="text-center space-y-3">
              <p className="text-purple-300 font-black text-lg">⚠️ POINT OF NO RETURN</p>
              <p className="text-white">Target: <b style={{color:"#c084fc"}} className="text-lg">{players.find(p=>p.id===mtConfirm)?.name}</b></p>
              <p className="text-gray-500 text-xs">If they are an innocent Yak you will lose your voting rights for the rest of the game. If they are the Wack Yak — the herd wins this moment.</p>
              <div className="flex gap-2">
                <Btn onClick={()=>activateMT(mtConfirm)} col="#7e22ce" txt="white" sm cls="flex-1">🎯 ACTIVATE — No takebacks</Btn>
                <Btn onClick={()=>setMtConfirm(null)} col="#374151" txt="white" sm cls="flex-1">Go back</Btn>
              </div>
            </div>}
          </Card>}
          {mtUsed&&<Card><p className="text-gray-600 text-xs text-center">🎯 The Missionterry has been activated this game. Power spent permanently.</p></Card>}

          {/* Alive players status */}
          <Card>
            <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-2">Surviving Herd — {alive.length} Yaks</p>
            <div className="flex flex-wrap gap-1.5">
              {alive.map(p=>(
                <span key={p.id} style={{background:"rgba(255,255,255,0.07)"}} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold">
                  🦬 {p.name}{p.lostVote&&<span className="text-red-500 ml-1">🚫</span>}
                </span>
              ))}
            </div>
          </Card>

          <Btn onClick={()=>setPhase("vote")} col="#f59e0b">Proceed to Vote — Banish Someone ⚡</Btn>
        </div>
      </div>
    );
  }

  // ── VOTE (CAPPED) ─────────────────────────────────────────────────────────
  if(phase==="vote"){
    const voteLoc=LOCS[(locIdx-2+LOCS.length)%LOCS.length];
    return(
      <div style={{background:`linear-gradient(135deg,${voteLoc.bg},#0a0a18)`,minHeight:"100vh"}} className="flex flex-col items-center p-5 text-white">
        <div className="max-w-md w-full space-y-4 pt-4">
          <div className="text-center">
            <h1 className="text-2xl font-black" style={{color:voteLoc.bdr}}>🗳️ The Vote — Day {round}</h1>
            <p className="text-gray-500 text-xs mt-1">{alive.length} yaks alive · {alive.length} total votes available</p>
          </div>

          {/* Vote cap tracker */}
          <Card style={{border:`1px solid ${votesRemaining===0?"#22c55e44":"#f59e0b44"}`}}>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Votes Remaining</span>
              <span style={{color:votesRemaining===0?"#22c55e":"#f59e0b"}} className="text-2xl font-black">{votesRemaining} / {alive.length}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
              <div style={{width:`${((alive.length-votesRemaining)/alive.length)*100}%`,background:votesRemaining===0?"#22c55e":"#f59e0b"}} className="h-2 rounded-full transition-all"/>
            </div>
            {votesRemaining===0&&<p className="text-green-400 text-xs font-bold mt-1 text-center">All votes cast — ready to banish</p>}
          </Card>

          <div className="space-y-2">
            {alive.map(p=>(
              <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.07)"}}>
                <span className="text-xl">🦬</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{p.name}{p.nick&&<span className="text-gray-600 text-xs ml-1.5">"{p.nick}"</span>}</div>
                  {p.lostVote&&<div className="text-red-500 text-xs">🚫 Voting rights revoked — Missionterry penalty</div>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>removeVote(p.id)}
                    className="w-9 h-9 rounded-xl font-black text-red-300 transition-colors" style={{background:"rgba(127,29,29,0.35)"}}>−</button>
                  <span className="text-2xl font-black w-7 text-center">{votes[p.id]||0}</span>
                  <button onClick={()=>addVote(p.id)} disabled={votesRemaining===0}
                    className="w-9 h-9 rounded-xl font-black text-green-300 transition-colors disabled:opacity-30" style={{background:"rgba(20,83,45,0.35)"}}>+</button>
                </div>
              </div>
            ))}
          </div>

          <Btn onClick={resolveVote} disabled={totalVotesCast===0} col="#dc2626" txt="white">
            {totalVotesCast===0?"Cast at least one vote to proceed":"Banish the Most-Voted Yak ⚡"}
          </Btn>
          <button onClick={()=>{setVotes({});beginNight();}} className="w-full py-2 text-gray-700 text-sm hover:text-gray-400 transition-colors">
            No majority reached — Skip to next night →
          </button>
        </div>
      </div>
    );
  }

  // ── VOTE RESULT ───────────────────────────────────────────────────────────
  if(phase==="voteResult"){
    const vrLoc=LOCS[(locIdx-2+LOCS.length)%LOCS.length];
    return(
      <div style={{background:`linear-gradient(135deg,${vrLoc.bg},#0a0a18)`,minHeight:"100vh"}} className="flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-sm w-full space-y-5 text-center">
          {votedOut?<>
            <div className="text-6xl">🗳️</div>
            <h2 className="text-2xl font-black text-red-400">{votedOut.name} Has Been Banished from Yak Peak</h2>
            {votedOut.nick&&<p className="text-gray-500">"{votedOut.nick}"</p>}
            <Card>
              <p className="text-gray-500 text-xs mb-2">The mountain reveals their true identity:</p>
              <div className="text-5xl mb-1">{ROLES[votedOut.role]?.icon}</div>
              <p className="font-black text-2xl">{ROLES[votedOut.role]?.name}</p>
              <div className="mt-2"><RolePill rk={votedOut.role}/></div>
              {votedOut.role==="wyak"
                ? <p className="text-blue-400 text-xs font-bold mt-2">The Wack Yak has been found. Check win conditions.</p>
                : <p className="text-red-400 text-xs mt-2">An innocent yak was banished. The Wack Yak is still out there.</p>
              }
            </Card>
            {vrLoc.name==="The Torrential Tunnel"&&<Card style={{border:"1px solid #9ca3af"}}>
              <p className="text-gray-300 text-xs leading-5">{vrLoc.tunnelExit}</p>
            </Card>}
          </>:<>
            <div className="text-6xl">🤷</div>
            <h2 className="text-2xl font-black">No Consensus — Vote Tied</h2>
            <p className="text-gray-400 text-sm">The herd couldn't reach a majority. Nobody is banished this round. The Wack Yak survives another day. The storm grows stronger.</p>
          </>}
          <Btn onClick={()=>{setVotedOut(null);beginNight();}} col="#1e3a8a" txt="white">🌧️ Night Falls Again — Continue Descent</Btn>
        </div>
      </div>
    );
  }

  // ── GAME OVER ─────────────────────────────────────────────────────────────
  if(phase==="gameOver"){
    const yakWin=winner==="yak";
    const bfw=LOCS[5];
    return(
      <div style={{background:yakWin?"linear-gradient(135deg,#020c08,#051a10)":"linear-gradient(135deg,#06050f,#0a0418)",minHeight:"100vh"}} className="flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-sm w-full space-y-6 text-center">
          <div className="text-8xl animate-bounce">{yakWin?"⛵":"🌊"}</div>
          <h1 className="text-4xl font-black" style={{color:yakWin?"#34d399":"#3b82f6"}}>
            {yakWin?"The Yaks Stay Dry! 🦬":"The Wack Yak Wins 🌧️"}
          </h1>
          <Card style={{border:`1px solid ${yakWin?"#166534":"#1e3a8a"}`}}>
            <p className="text-sm text-gray-300 leading-relaxed">{yakWin?bfw.yakWin:bfw.wyakWin}</p>
          </Card>
          <Card>
            <p className="font-bold text-gray-400 mb-3 text-sm">⛰️ Yak Peak — Final Roles Revealed</p>
            <div className="space-y-2">
              {players.map(p=>(
                <div key={p.id} className="flex items-center gap-2 text-sm flex-wrap">
                  <span>{ROLES[p.role]?.icon}</span>
                  <span className={p.alive?"text-white font-bold":"text-gray-600 line-through"}>{p.name}</span>
                  {p.nick&&<span className="text-gray-700 text-xs">"{p.nick}"</span>}
                  <RolePill rk={p.role}/>
                  {!p.alive&&<span className="text-gray-700 text-xs">eliminated</span>}
                  {p.lostVote&&<span className="text-red-500 text-xs">🚫 lost vote</span>}
                </div>
              ))}
            </div>
          </Card>
          <Btn onClick={reset} col="#f59e0b">🏔️ Play Again — Back to the Summit</Btn>
        </div>
      </div>
    );
  }

  return null;
}
