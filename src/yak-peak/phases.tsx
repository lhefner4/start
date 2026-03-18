import type { GameState } from "./hooks";
import { TRAITS, ROLES, LOCS } from "./constants";
import { Btn, Card, RolePill, SpinWheel } from "./components";

// ── SETUP PHASE ──────────────────────────────────────────────────────────────
export function SetupPhase({ g }: { g: GameState }) {
  const { players, pName, pNick, pTrait, showRules, rulesTab } = g;
  const { setPName, setPNick, setPTrait, setShowRules, setRulesTab, setPlayers, addPlayer, startGame } = g;

  return (
    <div style={{ background: "linear-gradient(135deg,#060818,#0a0018)", minHeight: "100vh" }} className="flex flex-col items-center p-5 text-white">
      <div className="max-w-md w-full space-y-5 pt-4">
        <div className="text-center">
          <div className="text-7xl mb-2">🏔️</div>
          <h1 style={{ color: "#f59e0b" }} className="text-5xl font-black tracking-tight">YAK PEAK</h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Social Deduction · Barstool Chicago Edition</p>
          <p className="text-gray-600 text-xs mt-0.5">4–12 players · Pass the phone · One Wack Yak</p>
        </div>

        <button onClick={() => setShowRules(r => !r)} style={{ color: "#f59e0b" }} className="text-sm font-bold underline w-full text-center">
          {showRules ? "▲ Hide Rules" : "▼ How to Play — Full Rules"}
        </button>

        {showRules && <Card>
          <div className="flex gap-1 mb-3">
            {["overview", "roles", "voting", "night"].map(tab => (
              <button key={tab} onClick={() => setRulesTab(tab)}
                style={{ background: rulesTab === tab ? "#f59e0b" : "rgba(255,255,255,0.05)", color: rulesTab === tab ? "black" : "#9ca3af" }}
                className="flex-1 py-1.5 rounded-lg text-xs font-black capitalize transition-all">
                {tab}
              </button>
            ))}
          </div>

          {rulesTab === "overview" && <div className="text-xs leading-5 text-gray-300 space-y-3">
            <div><b className="text-white block mb-1">🌧️ The Premise</b>
              A storm is rolling into Yak Peak. One player — the Wack Yak — is secretly working to soak the entire herd. The rest of the yaks must identify and banish the Wack Yak before it's too late. The herd descends from the summit through six locations, losing members along the way, before reaching their final destination: BFW Pond.</div>
            <div><b className="text-white block mb-1">🎭 Role Assignment</b>
              Once all players are added, roles are randomly shuffled and assigned automatically. Every game has exactly ONE Wack Yak. The remaining special roles — Blog Boy, King Nope-I-Do, and The Missionterry — fill out the roster. Any remaining players become standard Yaks. Each player sees their role privately by passing the device.</div>
            <div><b className="text-white block mb-1">🏆 Win Conditions</b>
              <span className="text-yellow-400 font-bold">Yaks win</span> when the Wack Yak is identified and banished — the surviving herd boards the boat at BFW Pond and sails away dry.<br />
              <span className="text-blue-400 font-bold">Wack Yak wins</span> when the Wack Yak equals or outnumbers the remaining yaks — the boat sinks and everyone gets soaked.</div>
            <div><b className="text-white block mb-1">📍 Locations</b>
              The game progresses through six locations: The Yak Shack (Summit) → Donnie's Den → The Gambling Cave → The Torrential Tunnel → The Creamery → BFW Pond (Base Camp). Each location has unique flavor text and host narration read aloud each phase.</div>
          </div>}

          {rulesTab === "roles" && <div className="space-y-3">
            {Object.entries(ROLES).map(([k, r]) => (
              <div key={k} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${r.col}33` }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{r.icon}</span>
                  <span style={{ color: r.col }} className="font-black text-sm">{r.name}</span>
                  <span style={{ background: r.col + "22", color: r.col }} className="text-xs px-2 py-0.5 rounded-full ml-auto">{r.team === "yak" ? "🦬 Yak Team" : "🌧️ Wack Yak"}</span>
                </div>
                <p className="text-gray-400 text-xs leading-4">{r.desc}</p>
              </div>
            ))}
          </div>}

          {rulesTab === "voting" && <div className="text-xs leading-5 text-gray-300 space-y-3">
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

          {rulesTab === "night" && <div className="text-xs leading-5 text-gray-300 space-y-3">
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
            <input value={pName} onChange={e => setPName(e.target.value)} onKeyDown={e => e.key === "Enter" && addPlayer()}
              placeholder="Player name *" className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-yellow-500 outline-none text-white placeholder-gray-700 text-sm" />
            <input value={pNick} onChange={e => setPNick(e.target.value)} onKeyDown={e => e.key === "Enter" && addPlayer()}
              placeholder="Nickname / callsign (optional — used in AI headlines)" className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-yellow-500 outline-none text-white placeholder-gray-700 text-sm" />
            <p className="text-xs text-gray-600 font-bold uppercase tracking-wider pt-1">Choose your Yak Peak trait *</p>
            {TRAITS.map(t => (
              <button key={t.id} onClick={() => setPTrait(t.id)}
                style={{ background: pTrait === t.id ? "#f59e0b22" : "rgba(0,0,0,0.3)", border: pTrait === t.id ? "2px solid #f59e0b" : "1px solid rgba(255,255,255,0.08)" }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all hover:brightness-125">
                <span className="text-xl">{t.icon}</span>
                <div>
                  <span className={`font-bold text-sm ${pTrait === t.id ? "text-yellow-400" : "text-white"}`}>{t.name}</span>
                  <p className="text-gray-600 text-xs">{t.flavor.split(".")[0]}.</p>
                </div>
              </button>
            ))}
            <Btn onClick={addPlayer} disabled={!pName.trim() || !pTrait || players.length >= 12} col="#f59e0b" sm>+ Add Player</Btn>
          </div>
        </Card>

        {players.length > 0 && <Card>
          <h2 className="font-black text-lg mb-2">🦬 Roster ({players.length}/12)</h2>
          <p className="text-xs text-gray-600 mb-2">This game will have exactly <b className="text-yellow-500">1 Wack Yak</b> regardless of player count.</p>
          <div className="space-y-1.5">
            {players.map((p, i) => {
              const tr = TRAITS.find(t => t.id === p.trait);
              return (
                <div key={p.id} className="flex items-center gap-2 bg-gray-900/60 rounded-xl px-3 py-2">
                  <span className="text-gray-700 text-xs w-4">{i + 1}</span>
                  <span>{tr?.icon || "🦬"}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-sm">{p.name}</span>
                    {p.nick && <span className="text-gray-500 text-xs ml-1.5">"{p.nick}"</span>}
                    <span className="text-gray-700 text-xs ml-2">· {tr?.name}</span>
                  </div>
                  <button onClick={() => setPlayers(ps => ps.filter(pl => pl.id !== p.id))} className="text-red-600 text-xl w-6 leading-none hover:text-red-400">×</button>
                </div>
              );
            })}
          </div>
        </Card>}

        <Btn onClick={startGame} disabled={players.length < 4} col="#1d4ed8" txt="white">
          {players.length < 4 ? `Need ${4 - players.length} more player(s)` : "Assign Roles & Begin the Descent ⛈️"}
        </Btn>
      </div>
    </div>
  );
}

// ── ROLE REVEAL PHASE ────────────────────────────────────────────────────────
export function RoleRevealPhase({ g }: { g: GameState }) {
  const { players, revIdx, showRole } = g;
  const { setShowRole, setRevIdx, setPhase } = g;
  const p = players[revIdx];
  const r = ROLES[p.role!];
  const tr = TRAITS.find(t => t.id === p.trait);
  const isLast = revIdx === players.length - 1;
  const next = () => { setShowRole(false); if (!isLast) { setRevIdx(i => i + 1); } else { setPhase("openingNarrative"); } };

  return (
    <div style={{ background: "#060818", minHeight: "100vh" }} className="flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-sm w-full space-y-5 text-center">
        {!showRole ? <>
          <div className="text-6xl animate-pulse">🔒</div>
          <h2 className="text-2xl font-black">Pass the device to:</h2>
          <div style={{ color: "#f59e0b" }} className="text-4xl font-black">{p.name}</div>
          {p.nick && <p className="text-gray-500">"{p.nick}"</p>}
          <p className="text-gray-700 text-sm">Make sure nobody else can see the screen 👀</p>
          <Btn onClick={() => setShowRole(true)} col="#f59e0b">I'm {p.name} — Show My Role</Btn>
        </> : <>
          <div className="text-8xl">{r.icon}</div>
          <h2 className="text-3xl font-black" style={{ color: r.col }}>{r.name}</h2>
          <span style={{ background: r.col + "22", color: r.col, border: `1px solid ${r.col}44` }} className="px-4 py-1 rounded-full text-sm font-bold inline-block">
            {r.team === "yak" ? "🦬 Yak Team" : "🌧️ Wack Yak"}
          </span>
          <Card><p className="text-gray-300 text-sm leading-relaxed text-left">{r.desc}</p>
            <p style={{ color: r.col }} className="text-xs font-bold italic mt-2">"{r.flavor}"</p>
          </Card>
          {tr && <Card cls="text-left">
            <p className="text-xs text-gray-600 mb-1">Your Yak Peak trait:</p>
            <p style={{ color: "#f59e0b" }} className="font-black">{tr.icon} {tr.name}</p>
            <p className="text-gray-500 text-xs mt-1">{tr.flavor}</p>
          </Card>}
          <Btn onClick={next} col="#374151" txt="white">{isLast ? "All roles assigned — Continue →" : "Got it — Pass the device →"}</Btn>
        </>}
        <p className="text-gray-800 text-xs">{revIdx + 1} / {players.length}</p>
      </div>
    </div>
  );
}

// ── OPENING NARRATIVE PHASE ──────────────────────────────────────────────────
export function OpeningNarrativePhase({ g }: { g: GameState }) {
  const { players, beginNight } = g;
  const plist = players.map(p => p.nick ? `${p.name} "${p.nick}"` : p.name).join(", ");

  return (
    <div style={{ background: "linear-gradient(135deg,#060818,#0a0a0a)", minHeight: "100vh" }} className="flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="text-7xl mb-3">🏔️</div>
          <h1 style={{ color: "#f59e0b" }} className="text-4xl font-black">Welcome to Yak Peak</h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Host — Read This Aloud</p>
        </div>
        <Card style={{ border: "1px solid #f59e0b44" }}>
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
          <p style={{ color: "#f59e0b" }} className="text-sm font-black mt-4 text-center">The first night on Yak Peak begins now. 🌧️</p>
        </Card>
        <Btn onClick={() => beginNight()} col="#f59e0b">Begin Night 1 — The Yak Shack 🏔️</Btn>
      </div>
    </div>
  );
}

// ── NIGHT PHASE ──────────────────────────────────────────────────────────────
export function NightPhase({ g }: { g: GameState }) {
  const { alive, players, round, loc, waitPass, acts, spinDone, curNightRole, curNightPlayer } = g;
  const { setWaitPass, setActs, setSpinDone, advanceNight } = g;

  const tBtn = (p: typeof players[0], fn: (p: typeof players[0]) => void, disabled = false) => (
    <button key={p.id} onClick={() => !disabled && fn(p)} disabled={disabled}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:brightness-125 active:scale-95 disabled:opacity-40"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
      <span className="text-2xl">🦬</span>
      <div className="flex-1"><span className="font-bold">{p.name}</span>{p.nick && <span className="text-gray-600 text-xs ml-2">"{p.nick}"</span>}</div>
    </button>
  );

  // Pass device screen
  if (waitPass) return (
    <div style={{ background: "#04050f", minHeight: "100vh" }} className="flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-sm w-full space-y-5 text-center">
        <div className="text-7xl animate-pulse">🌧️</div>
        <h1 style={{ color: "#60a5fa" }} className="text-4xl font-black">Night {round + 1} Falls</h1>
        <div>
          <p style={{ color: loc.bdr }} className="font-bold text-xl">{loc.icon} {loc.name}</p>
          <p className="text-gray-600 text-xs">{loc.pos} · {alive.length} yaks remaining</p>
        </div>
        <Card><p className="text-gray-400 text-xs italic leading-5">{loc.host}</p></Card>
        {curNightPlayer && <>
          <div className="h-px bg-gray-800" />
          <p className="text-gray-500 text-sm font-bold">All eyes closed. Pass the device to:</p>
          <div style={{ color: "#f59e0b" }} className="text-3xl font-black">{curNightPlayer.name}</div>
          {curNightPlayer.nick && <p className="text-gray-600 text-sm">"{curNightPlayer.nick}"</p>}
          <p style={{ color: ROLES[curNightRole]?.col }} className="text-sm font-bold">{ROLES[curNightRole]?.icon} {ROLES[curNightRole]?.name}</p>
          <p className="text-gray-800 text-xs">Everyone else: eyes shut and device face down 👀</p>
          <Btn onClick={() => setWaitPass(false)} col="#1e3a8a" txt="white">I'm {curNightPlayer.name} — Ready</Btn>
        </>}
      </div>
    </div>
  );

  // WACK YAK NIGHT ACTIONS
  if (curNightRole === "wyak") {
    const soakDone = acts.soak !== null;
    const drizzleDone = acts.drizzle !== null;
    if (!soakDone) return (
      <div style={{ background: "#04050f", minHeight: "100vh" }} className="flex flex-col items-center p-5 text-white">
        <div className="max-w-sm w-full space-y-4 pt-6">
          <div className="text-center"><div className="text-5xl">🌧️</div>
            <h2 className="text-xl font-black mt-1 text-blue-400">Wack Yak — Action 1 of 2</h2>
            <p className="text-white font-bold mt-1">Choose your SOAK target</p>
            <p className="text-gray-600 text-xs mt-1">This yak will be eliminated at dawn unless protected by King Nope-I-Do.</p>
          </div>
          <div className="space-y-2">{alive.map(p => tBtn(p, t => setActs(a => ({ ...a, soak: t.id }))))}</div>
        </div>
      </div>
    );
    if (!drizzleDone) return (
      <div style={{ background: "#04050f", minHeight: "100vh" }} className="flex flex-col items-center p-5 text-white">
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
          <div className="space-y-2">{alive.filter(p => p.id !== acts.soak).map(p => tBtn(p, t => setActs(a => ({ ...a, drizzle: t.id }))))}</div>
          <Btn onClick={() => setActs(a => ({ ...a, drizzle: "skip" }))} col="#374151" txt="white" sm>Skip drizzle this round</Btn>
        </div>
      </div>
    );
    return (
      <div style={{ background: "#04050f", minHeight: "100vh" }} className="flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-sm w-full space-y-4 text-center">
          <div className="text-5xl">✅</div>
          <h2 className="text-xl font-black text-blue-400">Wack Yak Actions Locked</h2>
          <Card>
            <div className="space-y-2 text-sm text-left">
              <div className="flex gap-2 items-center"><span className="text-gray-500 w-20">💧 Soak:</span><span className="font-bold text-red-400">{players.find(p => p.id === acts.soak)?.name || "—"}</span></div>
              <div className="flex gap-2 items-center"><span className="text-gray-500 w-20">🌦️ Drizzle:</span><span className="font-bold text-indigo-400">{acts.drizzle === "skip" ? "Skipped" : players.find(p => p.id === acts.drizzle)?.name || "—"}</span></div>
            </div>
          </Card>
          <p className="text-gray-700 text-xs">Your actions are locked. Go back to sleep 😴</p>
          <Btn onClick={advanceNight} col="#374151" txt="white" sm>Done — Pass the device face down</Btn>
        </div>
      </div>
    );
  }

  // BLOG BOY NIGHT ACTION
  if (curNightRole === "blogBoy") {
    const { investigate, invResult, invTriggersDrizzle } = acts;
    if (!investigate) return (
      <div style={{ background: "#04050f", minHeight: "100vh" }} className="flex flex-col items-center p-5 text-white">
        <div className="max-w-sm w-full space-y-4 pt-6">
          <div className="text-center"><div className="text-5xl">🗞️</div>
            <h2 className="text-xl font-black mt-1 text-yellow-400">Blog Boy — Investigate</h2>
            <p className="text-gray-400 text-xs mt-1">Choose one player to investigate. DRY = safe. DAMP = Wack Yak. Your call what to do with the intel — you are never required to share it.</p>
          </div>
          <div className="space-y-2">{alive.filter(p => p.role !== "blogBoy").map(p => tBtn(p, t => {
            const damp = t.role === "wyak";
            const firesDrizzle = acts.drizzle && acts.drizzle !== "skip" && t.id === acts.drizzle;
            setActs(a => ({ ...a, investigate: t.id, invResult: damp ? "DAMP" : "DRY", invTriggersDrizzle: !!firesDrizzle }));
          }))}</div>
        </div>
      </div>
    );
    return (
      <div style={{ background: "#04050f", minHeight: "100vh" }} className="flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-sm w-full space-y-5 text-center">
          <div className="text-7xl">{invResult === "DAMP" ? "💧" : "☀️"}</div>
          <h3 className="text-3xl font-black">{players.find(p => p.id === investigate)?.name}</h3>
          <div style={{ color: invResult === "DAMP" ? "#60a5fa" : "#4ade80" }} className="text-2xl font-black">
            {invResult === "DAMP" ? "💧 DAMP — That's the Wack Yak." : "☀️ DRY — Safe yak."}
          </div>
          {invTriggersDrizzle
            ? <Card style={{ border: "1px solid #7f1d1d" }}>
              <p className="text-red-400 text-sm font-black mb-1">⚠️ Drizzle Triggered</p>
              <p className="text-gray-300 text-xs leading-5">You investigated <b className="text-white">{players.find(p => p.id === investigate)?.name}</b> and they were the Wack Yak's drizzle target tonight. Your investigation fires the drizzle automatically at dawn — they will be eliminated before day discussion begins. You know exactly what happened. You do not need to tell anyone else. Use this information carefully.</p>
            </Card>
            : <Card><p className="text-gray-500 text-xs">This intel is yours. Share it, sit on it, or use it strategically. Nobody will know what you found unless you tell them.</p></Card>
          }
          <Btn onClick={advanceNight} col="#374151" txt="white" sm>Noted — Pass the device face down</Btn>
        </div>
      </div>
    );
  }

  // KING NOPE-I-DO NIGHT ACTION
  if (curNightRole === "kingNopeIDo") {
    const { protect, protectFailed } = acts;
    if (!protect) return (
      <div style={{ background: "#04050f", minHeight: "100vh" }} className="flex flex-col items-center p-5 text-white">
        <div className="max-w-sm w-full space-y-4 pt-6">
          <div className="text-center"><div className="text-5xl">👑</div>
            <h2 className="text-xl font-black mt-1 text-green-400">King Nope-I-Do — Protect</h2>
            <p className="text-gray-400 text-xs mt-1">Choose one yak to shield from the soak tonight. You may protect yourself. After choosing, you will spin the wheel — 80% success, 20% fail. You will see the result privately.</p>
          </div>
          <div className="space-y-2">{alive.map(p => tBtn(p, t => setActs(a => ({ ...a, protect: t.id }))))}</div>
        </div>
      </div>
    );
    if (!spinDone) return (
      <div style={{ background: "#04050f", minHeight: "100vh" }} className="flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-sm w-full space-y-5 text-center">
          <div className="text-5xl">👑</div>
          <h2 className="text-xl font-black text-green-400">Spin for Protection</h2>
          <p className="text-gray-300 text-sm">Protecting: <b className="text-white">{players.find(p => p.id === protect)?.name}</b></p>
          <Card>
            <div className="flex justify-around text-xs text-gray-500 mb-3">
              <span>🟢 80% — Holds</span><span>🔴 20% — Fails</span>
            </div>
            <SpinWheel onResult={success => { setActs(a => ({ ...a, protectFailed: !success })); setSpinDone(true); }} />
          </Card>
        </div>
      </div>
    );
    return (
      <div style={{ background: "#04050f", minHeight: "100vh" }} className="flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-sm w-full space-y-5 text-center">
          <div className="text-6xl">{protectFailed ? "💔" : "👑"}</div>
          <h2 className="text-xl font-black" style={{ color: protectFailed ? "#ef4444" : "#22c55e" }}>
            {protectFailed ? "Protection Failed — The Rain Got Through" : "Nope-I-Do — Protection Activated"}
          </h2>
          <Card>
            <p className="text-gray-300 text-sm leading-5">
              {protectFailed
                ? `Your protection attempt on ${players.find(p => p.id === protect)?.name} failed tonight. The soak will go through if they were targeted. Nobody will know you tried. Carry this privately.`
                : `${players.find(p => p.id === protect)?.name} is shielded for tonight. If the Wack Yak targeted them, the soak will not go through. They will receive a private message tomorrow morning letting them know they were saved — but they will not know it was you.`
              }
            </p>
          </Card>
          <Btn onClick={advanceNight} col="#374151" txt="white" sm>Done — Pass the device face down</Btn>
        </div>
      </div>
    );
  }

  return null;
}

// ── DAY REVEAL PHASE ─────────────────────────────────────────────────────────
export function DayRevealPhase({ g }: { g: GameState }) {
  const { locIdx, nightDead, drizzleTriggeredP, narrative, loading, alive, round } = g;
  const { setDrizzleTriggeredP, setPhase } = g;
  const revLoc = LOCS[(locIdx - 1 + LOCS.length) % LOCS.length];
  const hl = narrative.split("\n").find(l => l.startsWith("HEADLINE:"))?.replace("HEADLINE:", "").trim();
  const rc = narrative.split("\n").find(l => l.startsWith("RECAP:"))?.replace("RECAP:", "").trim();

  return (
    <div style={{ background: `linear-gradient(135deg,${revLoc.bg},#0a0a18)`, minHeight: "100vh" }} className="flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-md w-full space-y-5 text-center">
        <div className="text-6xl">{revLoc.icon}</div>
        <div>
          <p style={{ color: revLoc.bdr }} className="text-sm font-bold uppercase tracking-widest">{revLoc.name}</p>
          <p className="text-gray-600 text-xs">{revLoc.pos} · Morning of Day {round} · {alive.length} yaks remaining</p>
        </div>
        <h1 style={{ color: "#fbbf24" }} className="text-2xl font-black">☀️ Dawn Breaks on Yak Peak</h1>

        {drizzleTriggeredP && <Card style={{ border: "1px solid #4338ca" }}>
          <div className="text-4xl mb-1">💧</div>
          <h2 className="text-xl font-black text-indigo-400">Drizzle Fired at Dawn</h2>
          <p className="text-white font-bold text-lg">{drizzleTriggeredP.name} has been soaked</p>
          {drizzleTriggeredP.nick && <p className="text-gray-500 text-sm">"{drizzleTriggeredP.nick}"</p>}
          <p className="text-gray-500 text-xs mt-2">The Blog Boy's overnight investigation triggered the Wack Yak's drizzle mark. The elimination fired before anyone could speak. The Blog Boy knows what happened. Nobody else does.</p>
          <div className="mt-2"><RolePill rk={drizzleTriggeredP.role!} /></div>
        </Card>}

        {nightDead ? <Card style={{ border: "1px solid #7f1d1d" }}>
          <div className="text-4xl mb-1">💧</div>
          <h2 className="text-xl font-black text-red-400">{nightDead.name} Got Soaked</h2>
          {nightDead.nick && <p className="text-gray-500 text-sm">"{nightDead.nick}"</p>}
          <p className="text-gray-500 text-xs mt-1 italic">{revLoc.soak}</p>
          <div className="mt-2"><RolePill rk={nightDead.role!} /></div>
        </Card> : !drizzleTriggeredP && <Card style={{ border: "1px solid #14532d" }}>
          <div className="text-4xl mb-1">🌤️</div>
          <h2 className="text-xl font-black text-green-400">Nobody Got Soaked Last Night</h2>
          <p className="text-gray-500 text-xs mt-1 italic">{revLoc.noSoak}</p>
        </Card>}

        {loading ? <p className="animate-pulse text-gray-600 text-sm">📰 Generating Barstool headline…</p>
          : hl && <Card>
            <p style={{ color: "#fbbf24" }} className="font-black text-base leading-snug">📰 {hl}</p>
            {rc && <p className="text-gray-400 text-sm mt-2">{rc}</p>}
          </Card>}

        <Btn onClick={() => { setDrizzleTriggeredP(null); setPhase("dayPhase"); }} col="#f59e0b">
          The Herd Gathers — Begin Day Discussion →
        </Btn>
      </div>
    </div>
  );
}

// ── DAY PHASE ────────────────────────────────────────────────────────────────
export function DayPhase({ g }: { g: GameState }) {
  const { locIdx, alive, players, round, drizzleId, mtUsed, mtActivating, mtConfirm } = g;
  const { setPhase, setMtActivating, setMtConfirm, triggerDrizzle, activateMT } = g;
  const dayLoc = LOCS[(locIdx - 2 + LOCS.length) % LOCS.length];
  const mtPlayer = alive.find(p => p.role === "missionterry");
  const drizzledName = players.find(p => p.id === drizzleId)?.name;
  const hasDrizzle = !!drizzleId && alive.some(p => p.id === drizzleId);

  return (
    <div style={{ background: `linear-gradient(135deg,${dayLoc.bg},#0a0a18)`, minHeight: "100vh" }} className="flex flex-col items-center p-5 text-white">
      <div className="max-w-md w-full space-y-4 pt-4">
        <div className="text-center">
          <div className="text-4xl">{dayLoc.icon}</div>
          <h1 className="text-xl font-black mt-1" style={{ color: dayLoc.bdr }}>{dayLoc.name} — Day {round}</h1>
          <p className="text-gray-600 text-xs">{alive.length} yaks remaining · {dayLoc.pos}</p>
        </div>
        <Card><p className="text-gray-300 text-xs italic leading-5">{dayLoc.day}</p></Card>

        {/* Saved player private notification */}
        {alive.filter(p => p.savedLast).map(p => (
          <Card key={p.id} style={{ border: "1px solid #166534" }}>
            <p className="text-green-400 text-xs font-black mb-1">👑 HOST — Pass device privately to {p.name}</p>
            <p className="text-gray-500 text-xs italic">"Somebody said Nope-I-Do on you last night. You're still dry. Don't waste it."</p>
            <p className="text-gray-600 text-xs mt-1">Pass back after they've read this. Do not reveal who saved them.</p>
          </Card>
        ))}

        {/* Donnie's Den spirit stirs event */}
        {dayLoc.name === "Donnie's Den" && <Card style={{ border: "1px solid #f97316" }}>
          <p className="text-orange-400 text-xs font-bold">{dayLoc.spiritStirs}</p>
        </Card>}

        {/* HOST DRIZZLE MONITOR */}
        {hasDrizzle && <Card style={{ border: "1px solid #991b1b" }}>
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
        {mtPlayer && !mtUsed && <Card style={{ border: "1px solid #7e22ce" }}>
          {!mtActivating ? <>
            <p className="text-purple-400 font-black text-xs mb-1">🎯 The Missionterry — Power Available</p>
            <p className="text-gray-500 text-xs mb-2">Pass device to <b className="text-white">{mtPlayer.name}</b> if they choose to activate their one-time blow-up mid-discussion.</p>
            <Btn onClick={() => setMtActivating(true)} col="#7e22ce" txt="white" sm>I'm {mtPlayer.name} — Activate The Missionterry</Btn>
          </> : !mtConfirm ? <>
            <p className="text-purple-400 font-black text-sm mb-2">🎯 Choose your target — no going back:</p>
            <div className="space-y-1.5">
              {alive.filter(p => p.role !== "missionterry").map(p => (
                <button key={p.id} onClick={() => setMtConfirm(p.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all hover:brightness-125"
                  style={{ background: "rgba(126,34,206,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}>
                  <span>🦬</span><span className="font-bold text-sm">{p.name}</span>
                  {p.nick && <span className="text-gray-600 text-xs ml-1">"{p.nick}"</span>}
                </button>
              ))}
            </div>
            <Btn onClick={() => setMtActivating(false)} col="#374151" txt="white" sm cls="mt-2">Cancel — Not yet</Btn>
          </> : <div className="text-center space-y-3">
            <p className="text-purple-300 font-black text-lg">⚠️ POINT OF NO RETURN</p>
            <p className="text-white">Target: <b style={{ color: "#c084fc" }} className="text-lg">{players.find(p => p.id === mtConfirm)?.name}</b></p>
            <p className="text-gray-500 text-xs">If they are an innocent Yak you will lose your voting rights for the rest of the game. If they are the Wack Yak — the herd wins this moment.</p>
            <div className="flex gap-2">
              <Btn onClick={() => activateMT(mtConfirm)} col="#7e22ce" txt="white" sm cls="flex-1">🎯 ACTIVATE — No takebacks</Btn>
              <Btn onClick={() => setMtConfirm(null)} col="#374151" txt="white" sm cls="flex-1">Go back</Btn>
            </div>
          </div>}
        </Card>}
        {mtUsed && <Card><p className="text-gray-600 text-xs text-center">🎯 The Missionterry has been activated this game. Power spent permanently.</p></Card>}

        {/* Alive players status */}
        <Card>
          <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-2">Surviving Herd — {alive.length} Yaks</p>
          <div className="flex flex-wrap gap-1.5">
            {alive.map(p => (
              <span key={p.id} style={{ background: "rgba(255,255,255,0.07)" }} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold">
                🦬 {p.name}{p.lostVote && <span className="text-red-500 ml-1">🚫</span>}
              </span>
            ))}
          </div>
        </Card>

        <Btn onClick={() => setPhase("vote")} col="#f59e0b">Proceed to Vote — Banish Someone ⚡</Btn>
      </div>
    </div>
  );
}

// ── VOTE PHASE ───────────────────────────────────────────────────────────────
export function VotePhase({ g }: { g: GameState }) {
  const { locIdx, alive, round, votes, totalVotesCast, votesRemaining } = g;
  const { addVote, removeVote, resolveVote, beginNight } = g;
  const { setVotes } = g;
  const voteLoc = LOCS[(locIdx - 2 + LOCS.length) % LOCS.length];

  return (
    <div style={{ background: `linear-gradient(135deg,${voteLoc.bg},#0a0a18)`, minHeight: "100vh" }} className="flex flex-col items-center p-5 text-white">
      <div className="max-w-md w-full space-y-4 pt-4">
        <div className="text-center">
          <h1 className="text-2xl font-black" style={{ color: voteLoc.bdr }}>🗳️ The Vote — Day {round}</h1>
          <p className="text-gray-500 text-xs mt-1">{alive.length} yaks alive · {alive.length} total votes available</p>
        </div>

        {/* Vote cap tracker */}
        <Card style={{ border: `1px solid ${votesRemaining === 0 ? "#22c55e44" : "#f59e0b44"}` }}>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Votes Remaining</span>
            <span style={{ color: votesRemaining === 0 ? "#22c55e" : "#f59e0b" }} className="text-2xl font-black">{votesRemaining} / {alive.length}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
            <div style={{ width: `${((alive.length - votesRemaining) / alive.length) * 100}%`, background: votesRemaining === 0 ? "#22c55e" : "#f59e0b" }} className="h-2 rounded-full transition-all" />
          </div>
          {votesRemaining === 0 && <p className="text-green-400 text-xs font-bold mt-1 text-center">All votes cast — ready to banish</p>}
        </Card>

        <div className="space-y-2">
          {alive.map(p => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-xl">🦬</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">{p.name}{p.nick && <span className="text-gray-600 text-xs ml-1.5">"{p.nick}"</span>}</div>
                {p.lostVote && <div className="text-red-500 text-xs">🚫 Voting rights revoked — Missionterry penalty</div>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => removeVote(p.id)}
                  className="w-9 h-9 rounded-xl font-black text-red-300 transition-colors" style={{ background: "rgba(127,29,29,0.35)" }}>−</button>
                <span className="text-2xl font-black w-7 text-center">{votes[p.id] || 0}</span>
                <button onClick={() => addVote(p.id)} disabled={votesRemaining === 0}
                  className="w-9 h-9 rounded-xl font-black text-green-300 transition-colors disabled:opacity-30" style={{ background: "rgba(20,83,45,0.35)" }}>+</button>
              </div>
            </div>
          ))}
        </div>

        <Btn onClick={resolveVote} disabled={totalVotesCast === 0} col="#dc2626" txt="white">
          {totalVotesCast === 0 ? "Cast at least one vote to proceed" : "Banish the Most-Voted Yak ⚡"}
        </Btn>
        <button onClick={() => { setVotes({}); beginNight(); }} className="w-full py-2 text-gray-700 text-sm hover:text-gray-400 transition-colors">
          No majority reached — Skip to next night →
        </button>
      </div>
    </div>
  );
}

// ── VOTE RESULT PHASE ────────────────────────────────────────────────────────
export function VoteResultPhase({ g }: { g: GameState }) {
  const { locIdx, votedOut } = g;
  const { setVotedOut, beginNight } = g;
  const vrLoc = LOCS[(locIdx - 2 + LOCS.length) % LOCS.length];

  return (
    <div style={{ background: `linear-gradient(135deg,${vrLoc.bg},#0a0a18)`, minHeight: "100vh" }} className="flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-sm w-full space-y-5 text-center">
        {votedOut ? <>
          <div className="text-6xl">🗳️</div>
          <h2 className="text-2xl font-black text-red-400">{votedOut.name} Has Been Banished from Yak Peak</h2>
          {votedOut.nick && <p className="text-gray-500">"{votedOut.nick}"</p>}
          <Card>
            <p className="text-gray-500 text-xs mb-2">The mountain reveals their true identity:</p>
            <div className="text-5xl mb-1">{ROLES[votedOut.role!]?.icon}</div>
            <p className="font-black text-2xl">{ROLES[votedOut.role!]?.name}</p>
            <div className="mt-2"><RolePill rk={votedOut.role!} /></div>
            {votedOut.role === "wyak"
              ? <p className="text-blue-400 text-xs font-bold mt-2">The Wack Yak has been found. Check win conditions.</p>
              : <p className="text-red-400 text-xs mt-2">An innocent yak was banished. The Wack Yak is still out there.</p>
            }
          </Card>
          {vrLoc.name === "The Torrential Tunnel" && <Card style={{ border: "1px solid #9ca3af" }}>
            <p className="text-gray-300 text-xs leading-5">{vrLoc.tunnelExit}</p>
          </Card>}
        </> : <>
          <div className="text-6xl">🤷</div>
          <h2 className="text-2xl font-black">No Consensus — Vote Tied</h2>
          <p className="text-gray-400 text-sm">The herd couldn't reach a majority. Nobody is banished this round. The Wack Yak survives another day. The storm grows stronger.</p>
        </>}
        <Btn onClick={() => { setVotedOut(null); beginNight(); }} col="#1e3a8a" txt="white">🌧️ Night Falls Again — Continue Descent</Btn>
      </div>
    </div>
  );
}

// ── GAME OVER PHASE ──────────────────────────────────────────────────────────
export function GameOverPhase({ g }: { g: GameState }) {
  const { winner, players } = g;
  const { reset } = g;
  const yakWin = winner === "yak";
  const bfw = LOCS[5];

  return (
    <div style={{ background: yakWin ? "linear-gradient(135deg,#020c08,#051a10)" : "linear-gradient(135deg,#06050f,#0a0418)", minHeight: "100vh" }} className="flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-sm w-full space-y-6 text-center">
        <div className="text-8xl animate-bounce">{yakWin ? "⛵" : "🌊"}</div>
        <h1 className="text-4xl font-black" style={{ color: yakWin ? "#34d399" : "#3b82f6" }}>
          {yakWin ? "The Yaks Stay Dry! 🦬" : "The Wack Yak Wins 🌧️"}
        </h1>
        <Card style={{ border: `1px solid ${yakWin ? "#166534" : "#1e3a8a"}` }}>
          <p className="text-sm text-gray-300 leading-relaxed">{yakWin ? bfw.yakWin : bfw.wyakWin}</p>
        </Card>
        <Card>
          <p className="font-bold text-gray-400 mb-3 text-sm">⛰️ Yak Peak — Final Roles Revealed</p>
          <div className="space-y-2">
            {players.map(p => (
              <div key={p.id} className="flex items-center gap-2 text-sm flex-wrap">
                <span>{ROLES[p.role!]?.icon}</span>
                <span className={p.alive ? "text-white font-bold" : "text-gray-600 line-through"}>{p.name}</span>
                {p.nick && <span className="text-gray-700 text-xs">"{p.nick}"</span>}
                <RolePill rk={p.role!} />
                {!p.alive && <span className="text-gray-700 text-xs">eliminated</span>}
                {p.lostVote && <span className="text-red-500 text-xs">🚫 lost vote</span>}
              </div>
            ))}
          </div>
        </Card>
        <Btn onClick={reset} col="#f59e0b">🏔️ Play Again — Back to the Summit</Btn>
      </div>
    </div>
  );
}
