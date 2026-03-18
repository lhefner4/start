import { useState } from "react";
import type { RoleKey } from "./types";
import { ROLES } from "./constants";

// ── Btn ──────────────────────────────────────────────────────────────────────
interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  col?: string;
  txt?: string;
  sm?: boolean;
  full?: boolean;
  cls?: string;
}

export const Btn = ({ children, onClick, disabled, col = "#f59e0b", txt = "black", sm, full = true, cls = "" }: BtnProps) => (
  <button onClick={onClick} disabled={disabled}
    style={{ background: disabled ? "#374151" : col, color: disabled ? "#6b7280" : txt }}
    className={`${full ? "w-full" : ""} ${sm ? "py-2 px-4 text-sm" : "py-4 px-5 text-base"} rounded-2xl font-black transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed ${cls}`}>
    {children}
  </button>
);

// ── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  cls?: string;
}

export const Card = ({ children, style = {}, cls = "" }: CardProps) => (
  <div style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.1)", ...style }} className={`rounded-2xl p-4 ${cls}`}>
    {children}
  </div>
);

// ── RolePill ─────────────────────────────────────────────────────────────────
interface RolePillProps {
  rk: RoleKey;
}

export const RolePill = ({ rk }: RolePillProps) => {
  const r = ROLES[rk];
  if (!r) return null;
  return (
    <span style={{ background: r.col + "22", color: r.col, border: `1px solid ${r.col}44` }}
      className="px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
      {r.icon} {r.name}
    </span>
  );
};

// ── SpinWheel ────────────────────────────────────────────────────────────────
interface SpinWheelProps {
  onResult: (success: boolean) => void;
}

export const SpinWheel = ({ onResult }: SpinWheelProps) => {
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const spin = () => {
    if (spinning || result) return;
    setSpinning(true);
    const success = Math.random() > 0.2;
    const extra = (3 + Math.random() * 3) * 360;
    const base = success ? 90 + Math.random() * 216 : 306 + Math.random() * 54;
    setRot(r => r + extra + base);
    setTimeout(() => {
      setSpinning(false);
      setResult(success ? "✅" : "❌");
      setTimeout(() => onResult(success), 1200);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <svg width="112" height="112" viewBox="0 0 112 112"
          style={{ transform: `rotate(${rot}deg)`, transition: spinning ? "transform 2s cubic-bezier(0.17,0.67,0.12,0.99)" : "none" }}>
          <path d="M56,56 L56,4 A52,52 0 1,1 39.4,103.4 Z" fill="#22c55e" />
          <path d="M56,56 L39.4,103.4 A52,52 0 0,1 56,4 Z" fill="#ef4444" />
          <circle cx="56" cy="56" r="7" fill="white" />
        </svg>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5"
          style={{ width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "14px solid white" }} />
      </div>
      {!result && (
        <Btn onClick={spin} disabled={spinning} col="#22c55e" sm full={false} cls="px-6">
          {spinning ? "Spinning…" : "Spin the Wheel 🎡"}
        </Btn>
      )}
      {result && (
        <p style={{ color: result === "✅" ? "#22c55e" : "#ef4444" }} className="text-xl font-black">
          {result} {result === "✅" ? "Protection HOLDS" : "Protection FAILED"}
        </p>
      )}
    </div>
  );
};
