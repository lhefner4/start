import { useState, useEffect, useCallback } from "react";
import type { GamePhase, Player, NightActions, Winner, TraitId, RoleKey, Location } from "./types";
import { TRAITS, ROLES, LOCS, getDist, shuffle } from "./constants";

const INITIAL_ACTS: NightActions = {
  soak: null, drizzle: null, protect: null, protectFailed: false,
  investigate: null, invResult: null, invTriggersDrizzle: false,
};

export function useGameState() {
  // ── Phase & Players ──────────────────────────────────────────────────────
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [players, setPlayers] = useState<Player[]>([]);

  // ── Setup form ───────────────────────────────────────────────────────────
  const [pName, setPName] = useState("");
  const [pNick, setPNick] = useState("");
  const [pTrait, setPTrait] = useState<TraitId | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [rulesTab, setRulesTab] = useState("overview");

  // ── Role reveal ──────────────────────────────────────────────────────────
  const [revIdx, setRevIdx] = useState(0);
  const [showRole, setShowRole] = useState(false);

  // ── Game progression ─────────────────────────────────────────────────────
  const [round, setRound] = useState(0);
  const [locIdx, setLocIdx] = useState(0);

  // ── Night ────────────────────────────────────────────────────────────────
  const [nightStep, setNightStep] = useState(0);
  const [waitPass, setWaitPass] = useState(false);
  const [acts, setActs] = useState<NightActions>(INITIAL_ACTS);
  const [spinDone, setSpinDone] = useState(false);

  // ── Drizzle ──────────────────────────────────────────────────────────────
  const [drizzleId, setDrizzleId] = useState<number | null>(null);
  const [drizzleTriggeredP, setDrizzleTriggeredP] = useState<Player | null>(null);

  // ── Missionterry ─────────────────────────────────────────────────────────
  const [mtUsed, setMtUsed] = useState(false);
  const [mtActivating, setMtActivating] = useState(false);
  const [mtConfirm, setMtConfirm] = useState<number | null>(null);

  // ── Vote ─────────────────────────────────────────────────────────────────
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [votedOut, setVotedOut] = useState<Player | null>(null);

  // ── Narrative ────────────────────────────────────────────────────────────
  const [nightDead, setNightDead] = useState<Player | null>(null);
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Winner ───────────────────────────────────────────────────────────────
  const [winner, setWinner] = useState<Winner>(null);

  // ── Derived values ───────────────────────────────────────────────────────
  const alive = players.filter(p => p.alive);
  const totalVotesCast = Object.values(votes).reduce((a, b) => a + b, 0);
  const votesRemaining = alive.length - totalVotesCast;
  const loc = LOCS[locIdx % LOCS.length];

  const nightRoles = (["wyak", "blogBoy", "kingNopeIDo"] as RoleKey[]).filter(r => alive.some(p => p.role === r));
  const curNightRole = nightRoles[nightStep];
  const curNightPlayer = alive.find(p => p.role === curNightRole);

  // ── WIN CHECK ────────────────────────────────────────────────────────────
  const checkWin = useCallback((ps: Player[] = players): Winner => {
    const a = ps.filter(p => p.alive);
    const wyaks = a.filter(p => p.role === "wyak");
    const village = a.filter(p => p.role !== "wyak");
    if (wyaks.length === 0) { setWinner("yak"); return "yak"; }
    if (wyaks.length >= village.length) { setWinner("wyak"); return "wyak"; }
    return null;
  }, [players]);

  useEffect(() => {
    if (["voteResult", "dayReveal"].includes(phase)) {
      const w = checkWin();
      if (w) setTimeout(() => setPhase("gameOver"), 2800);
    }
  }, [players, phase, checkWin]);

  // ── SETUP ────────────────────────────────────────────────────────────────
  const addPlayer = () => {
    if (!pName.trim() || !pTrait || players.length >= 12) return;
    setPlayers(p => [...p, {
      id: Date.now(), name: pName.trim(), nick: pNick.trim(), trait: pTrait,
      role: null, alive: true, lostVote: false, savedLast: false,
    }]);
    setPName(""); setPNick(""); setPTrait(null);
  };

  const startGame = () => {
    if (players.length < 4) return;
    const roles = shuffle(getDist(players.length));
    setPlayers(p => p.map((pl, i) => ({ ...pl, role: roles[i] })));
    setRevIdx(0); setShowRole(false); setPhase("roleReveal");
  };

  // ── NIGHT ────────────────────────────────────────────────────────────────
  const beginNight = useCallback(() => {
    setNightStep(0); setWaitPass(true); setSpinDone(false);
    setActs(INITIAL_ACTS);
    setLocIdx(l => l + 1); setPhase("night");
  }, []);

  const advanceNight = () => {
    if (nightStep < nightRoles.length - 1) { setNightStep(s => s + 1); setWaitPass(true); }
    else resolveNight();
  };

  const resolveNight = () => {
    const { soak, drizzle, protect, protectFailed, invTriggersDrizzle } = acts;
    let dead: Player | null = null;
    let newPlayers = [...players];
    let drizzleFiredPlayer: Player | null = null;

    if (invTriggersDrizzle && drizzleId) {
      const dp = newPlayers.find(p => p.id === drizzleId && p.alive);
      if (dp) { drizzleFiredPlayer = dp; newPlayers = newPlayers.map(p => p.id === dp.id ? { ...p, alive: false } : p); }
    }
    setDrizzleId(drizzle && drizzle !== "skip" ? drizzle as number : null);

    const isProtected = protect === soak && !protectFailed;
    if (soak && !isProtected) {
      const dp = newPlayers.find(p => p.id === soak && p.alive);
      if (dp) { dead = dp; newPlayers = newPlayers.map(p => p.id === soak ? { ...p, alive: false } : p); }
    }

    const savedId = (protect && !protectFailed && isProtected) ? protect : null;
    newPlayers = newPlayers.map(p => ({ ...p, savedLast: p.id === savedId }));

    setPlayers(newPlayers);
    setNightDead(dead);
    setDrizzleTriggeredP(drizzleFiredPlayer);
    setRound(r => r + 1);
    setLocIdx(l => l + 1);
    fetchNarrative(dead, drizzleFiredPlayer, newPlayers);
    setPhase("dayReveal");
  };

  const fetchNarrative = async (dead: Player | null, drizzleDead: Player | null, ps: Player[]) => {
    setLoading(true); setNarrative("");
    const currentLoc = LOCS[(locIdx + 1) % LOCS.length];
    const plist = ps.filter(p => p.alive).map(p => `${p.name}${p.nick ? ` "${p.nick}"` : ""}`).join(", ");
    const deadText = drizzleDead
      ? `${drizzleDead.name}${drizzleDead.nick ? ` (aka "${drizzleDead.nick}")` : ""} was drizzled — they triggered their own elimination at dawn.`
      : dead
        ? `${dead.name}${dead.nick ? ` (aka "${dead.nick}")` : ""} was soaked and eliminated overnight.`
        : "Nobody was soaked last night. The Wack Yak missed their mark.";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 130,
          messages: [{ role: "user", content: `Write a punchy Barstool Sports-style update for a social deduction party game called Yak Peak set at Barstool Sports Chicago. Surviving players: ${plist}. Last night: ${deadText}. Location: ${currentLoc.name} (${currentLoc.pos}). Write a tabloid headline and ONE funny sentence referencing the location and players by name. Format EXACTLY:\nHEADLINE: [text]\nRECAP: [one sentence]\nUnder 75 words total.` }],
        }),
      });
      const d = await res.json();
      setNarrative(d.content?.[0]?.text || fallback(dead || drizzleDead));
    } catch {
      setNarrative(fallback(dead || drizzleDead));
    }
    setLoading(false);
  };

  const fallback = (dead: Player | null): string => dead
    ? `HEADLINE: ${dead.name} Left Absolutely Drenched on Yak Peak\nRECAP: Soaked from head to hoof — the mountain showed no mercy and neither did the Wack Yak.`
    : `HEADLINE: Wack Yak Strikes Out — Entire Herd Somehow Survives\nRECAP: Against all logic every yak made it through the night and now the paranoia is completely out of control.`;

  // ── DRIZZLE TRIGGER ──────────────────────────────────────────────────────
  const triggerDrizzle = () => {
    const p = players.find(pl => pl.id === drizzleId && pl.alive);
    if (!p) return;
    const newPs = players.map(pl => pl.id === p.id ? { ...pl, alive: false } : pl);
    setPlayers(newPs); setDrizzleTriggeredP(p); setDrizzleId(null);
    checkWin(newPs);
  };

  // ── MISSIONTERRY ─────────────────────────────────────────────────────────
  const activateMT = (targetId: number) => {
    const target = players.find(p => p.id === targetId);
    if (!target) return;
    const innocent = target.role !== "wyak";
    const newPs = players.map(p => {
      if (p.id === targetId) return { ...p, alive: false };
      if (p.role === "missionterry" && innocent) return { ...p, lostVote: true };
      return p;
    });
    setPlayers(newPs); setMtUsed(true); setMtActivating(false); setMtConfirm(null);
    checkWin(newPs);
  };

  // ── VOTE (CAPPED) ───────────────────────────────────────────────────────
  const addVote = (id: number) => {
    if (totalVotesCast >= alive.length) return;
    setVotes(v => ({ ...v, [id]: (v[id] || 0) + 1 }));
  };

  const removeVote = (id: number) => {
    setVotes(v => { const n = { ...v }; if ((n[id] || 0) > 0) n[id]--; return n; });
  };

  const resolveVote = () => {
    let maxV = 0;
    Object.entries(votes).forEach(([, v]) => { if (v > maxV) maxV = v; });
    const topPlayers = alive.filter(p => (votes[p.id] || 0) === maxV && maxV > 0);
    const final = topPlayers.length === 1 ? topPlayers[0] : null;
    setVotedOut(final);
    if (final) { setPlayers(ps => ps.map(p => p.id === final.id ? { ...p, alive: false } : p)); }
    setVotes({}); setPhase("voteResult");
  };

  // ── RESET ────────────────────────────────────────────────────────────────
  const reset = () => {
    setPhase("setup"); setPlayers([]); setRound(0); setLocIdx(0);
    setRevIdx(0); setShowRole(false); setNightStep(0); setWaitPass(false);
    setActs(INITIAL_ACTS);
    setSpinDone(false); setDrizzleId(null); setDrizzleTriggeredP(null);
    setMtUsed(false); setMtActivating(false); setMtConfirm(null);
    setVotes({}); setVotedOut(null); setNightDead(null); setNarrative(""); setWinner(null);
    setPName(""); setPNick(""); setPTrait(null);
  };

  return {
    // State
    phase, players, pName, pNick, pTrait, showRules, rulesTab,
    revIdx, showRole, round, locIdx,
    nightStep, waitPass, acts, spinDone,
    drizzleId, drizzleTriggeredP,
    mtUsed, mtActivating, mtConfirm,
    votes, votedOut,
    nightDead, narrative, loading,
    winner,

    // Derived
    alive, totalVotesCast, votesRemaining, loc,
    nightRoles, curNightRole, curNightPlayer,

    // Setters (exposed for phase components)
    setPhase, setPlayers,
    setPName, setPNick, setPTrait, setShowRules, setRulesTab,
    setRevIdx, setShowRole,
    setWaitPass, setActs, setSpinDone,
    setDrizzleTriggeredP,
    setMtActivating, setMtConfirm,

    // Actions
    addPlayer, startGame,
    beginNight, advanceNight,
    triggerDrizzle, activateMT,
    addVote, removeVote, resolveVote,
    reset,
  };
}

export type GameState = ReturnType<typeof useGameState>;
