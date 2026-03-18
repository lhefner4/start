import { useGameState } from "./hooks";
import {
  SetupPhase,
  RoleRevealPhase,
  OpeningNarrativePhase,
  NightPhase,
  DayRevealPhase,
  DayPhase,
  VotePhase,
  VoteResultPhase,
  GameOverPhase,
} from "./phases";

export default function YakPeak() {
  const g = useGameState();

  switch (g.phase) {
    case "setup":             return <SetupPhase g={g} />;
    case "roleReveal":        return <RoleRevealPhase g={g} />;
    case "openingNarrative":  return <OpeningNarrativePhase g={g} />;
    case "night":             return <NightPhase g={g} />;
    case "dayReveal":         return <DayRevealPhase g={g} />;
    case "dayPhase":          return <DayPhase g={g} />;
    case "vote":              return <VotePhase g={g} />;
    case "voteResult":        return <VoteResultPhase g={g} />;
    case "gameOver":          return <GameOverPhase g={g} />;
    default:                  return null;
  }
}
