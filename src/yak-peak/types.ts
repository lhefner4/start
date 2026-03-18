export type Team = "yak" | "wyak";

export type RoleKey = "yak" | "wyak" | "blogBoy" | "kingNopeIDo" | "missionterry";

export interface Role {
  name: string;
  icon: string;
  team: Team;
  col: string;
  desc: string;
  flavor: string;
}

export type TraitId = "heatSeeker" | "silentReader" | "deflector" | "solidGround" | "wildCard";

export interface Trait {
  id: TraitId;
  icon: string;
  name: string;
  flavor: string;
}

export interface Player {
  id: number;
  name: string;
  nick: string;
  trait: TraitId;
  role: RoleKey | null;
  alive: boolean;
  lostVote: boolean;
  savedLast: boolean;
}

export interface Location {
  name: string;
  icon: string;
  pos: string;
  bg: string;
  bdr: string;
  card: string;
  host: string;
  day: string;
  noSoak: string;
  soak: string;
  spiritStirs?: string;
  tunnelExit?: string;
  yakWin?: string;
  wyakWin?: string;
}

export type GamePhase =
  | "setup"
  | "roleReveal"
  | "openingNarrative"
  | "night"
  | "dayReveal"
  | "dayPhase"
  | "vote"
  | "voteResult"
  | "gameOver";

export interface NightActions {
  soak: number | null;
  drizzle: number | "skip" | null;
  protect: number | null;
  protectFailed: boolean;
  investigate: number | null;
  invResult: "DRY" | "DAMP" | null;
  invTriggersDrizzle: boolean;
}

export type Winner = "yak" | "wyak" | null;
