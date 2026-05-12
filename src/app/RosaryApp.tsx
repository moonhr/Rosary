"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  buildDecadeSteps,
  DAY_NAMES,
  DAY_TO_MYSTERY,
  MYSTERIES,
  type MysteryId,
} from "@/data/prayers";

// ── Types ──────────────────────────────────────────────────────────────────
type Speed = "slow" | "normal" | "fast";
type Theme = "warm" | "cream" | "night";
type Route = "intro" | "home" | "prayer" | "complete" | "settings";

interface Settings {
  fontSize: number;
  theme: Theme;
  speed: Speed;
  lineSpacing: number;
}

const DEFAULT_SETTINGS: Settings = {
  fontSize: 32,
  theme: "warm",
  speed: "normal",
  lineSpacing: 1.6,
};

const SPEED_MS_PER_CHAR: Record<Speed, number> = { slow: 260, normal: 175, fast: 110 };
const MIN_LINE_MS: Record<Speed, number> = { slow: 1800, normal: 1200, fast: 800 };
const MAX_LINE_MS: Record<Speed, number> = { slow: 9000, normal: 6000, fast: 4000 };

// ── Icons ──────────────────────────────────────────────────────────────────
const PlayIcon = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 5v14l12-7z" />
  </svg>
);
const PauseIcon = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);
const BackIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ForwardIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const SettingsIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const SpeakerIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);
const CheckIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const FlowerIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a3 3 0 00-3 3c0 .8.3 1.5.9 2A3 3 0 005 9c0 .8.3 1.5.9 2A3 3 0 005 14a3 3 0 003 3c.8 0 1.5-.3 2-.9A3 3 0 0013 19a3 3 0 003-3c0-.8-.3-1.5-.9-2A3 3 0 0019 11a3 3 0 00-3-3c-.8 0-1.5.3-2 .9A3 3 0 0012 2zm0 6a3 3 0 110 6 3 3 0 010-6z" />
  </svg>
);
const CrossIcon = ({ size = 24, stroke = 2.5 }: { size?: number; stroke?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round">
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="6" y1="8" x2="18" y2="8" />
  </svg>
);

// ── IntroScreen ────────────────────────────────────────────────────────────
function IntroScreen({ onStart }: { onStart: () => void }) {
  const [dontShow, setDontShow] = useState(false);

  const finish = () => {
    if (dontShow) localStorage.setItem("rosary.introSeen", "1");
    onStart();
  };

  return (
    <div className="screen intro fade-in">
      <div className="complete-cross" style={{ color: "var(--gold)" }}>
        <svg width="72" height="72" viewBox="0 0 56 56" fill="none">
          <line x1="28" y1="4" x2="28" y2="52" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="10" y1="18" x2="46" y2="18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>
      <h1>묵주기도</h1>
      <p className="lead">큰 글씨로, 천천히 함께 바치는 묵주기도</p>

      <div className="feature-list">
        <div className="feature">
          <div className="feature-icon">
            <PlayIcon size={20} />
          </div>
          <div>
            <div className="feature-title">자동으로 한 줄씩</div>
            <div className="feature-desc">기도문이 한 줄씩 떠오르며 현재 줄이 화면 가운데에 크게 표시됩니다.</div>
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon" style={{ background: "var(--bg-deep)" }}>
            <div style={{ display: "flex", gap: 3 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold)" }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold)" }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px solid var(--gold)" }} />
            </div>
          </div>
          <div>
            <div className="feature-title">묵주알이 채워져요</div>
            <div className="feature-desc">성모송 10번을 바칠 때마다 묵주알이 하나씩 차오릅니다.</div>
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <PauseIcon size={20} />
          </div>
          <div>
            <div className="feature-title">언제든 잠시 멈춤</div>
            <div className="feature-desc">큰 가운데 버튼으로 멈추거나 다시 시작할 수 있어요. 속도도 느림·보통·빠름 중 고르세요.</div>
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <FlowerIcon size={22} />
          </div>
          <div>
            <div className="feature-title">오늘의 신비</div>
            <div className="feature-desc">요일에 맞는 신비를 알려드려요. 원하시면 다른 신비도 직접 고르실 수 있습니다.</div>
          </div>
        </div>
      </div>

      <button className="big-btn primary" onClick={finish}>시작하기</button>

      <label className="checkbox-row" onClick={() => setDontShow((v) => !v)}>
        <div className={"checkbox-box " + (dontShow ? "checked" : "")}>
          {dontShow && <CheckIcon />}
        </div>
        <span>다음부터 이 안내 보지 않기</span>
      </label>
    </div>
  );
}

// ── HomeScreen ─────────────────────────────────────────────────────────────
function HomeScreen({
  onStartMystery,
  onOpenSettings,
}: {
  onStartMystery: (id: MysteryId) => void;
  onOpenSettings: () => void;
}) {
  const today = new Date();
  const dayIdx = today.getDay();
  const todayMysteryId = DAY_TO_MYSTERY[dayIdx];
  const order: MysteryId[] = ["joyful", "sorrowful", "glorious", "luminous"];

  return (
    <>
      <header className="appbar">
        <div className="appbar-title">
          <span style={{ color: "var(--gold)" }}>
            <CrossIcon size={22} />
          </span>
          묵주기도
        </div>
        <button className="appbar-btn icon-only" onClick={onOpenSettings} aria-label="설정">
          <SettingsIcon />
        </button>
      </header>

      <div className="screen fade-in">
        <div className="welcome-hero">
          <div className="today">오늘은 {DAY_NAMES[dayIdx]}</div>
          <div className="today-mystery">{MYSTERIES[todayMysteryId].name}</div>
        </div>

        <button className="big-btn primary" onClick={() => onStartMystery(todayMysteryId)}>
          <PlayIcon size={22} /> 오늘의 신비 시작
        </button>

        <div className="divider">또는 직접 고르기</div>

        <div className="mystery-grid">
          {order.map((id) => {
            const m = MYSTERIES[id];
            const isToday = id === todayMysteryId;
            return (
              <button
                key={id}
                className={"mystery-card" + (isToday ? " today" : "")}
                onClick={() => onStartMystery(id)}
              >
                <div className="mystery-icon">
                  <FlowerIcon size={24} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mystery-name">
                    {m.name}
                    {isToday && <span className="badge">오늘</span>}
                  </div>
                  <div className="mystery-sub">{m.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ── Beads ──────────────────────────────────────────────────────────────────
function Beads({ filled, current }: { filled: number; current: number }) {
  return (
    <div className="beads" role="status" aria-label={`성모송 ${filled} / 10`}>
      {Array.from({ length: 10 }).map((_, i) => {
        const cls = i < filled ? "filled" : i === current ? "current" : "";
        return <div key={i} className={"bead " + cls} />;
      })}
    </div>
  );
}

// ── DecadePips ─────────────────────────────────────────────────────────────
function DecadePips({
  decadeIdx,
  stepInDecade,
  totalSteps,
}: {
  decadeIdx: number;
  stepInDecade: number;
  totalSteps: number;
}) {
  return (
    <div className="decade-pips" aria-label={`${decadeIdx + 1}단 / 5단`}>
      {[0, 1, 2, 3, 4].map((i) => {
        let cls = "decade-pip";
        let progress = 0;
        if (i < decadeIdx) cls += " done";
        else if (i === decadeIdx) {
          cls += " active";
          progress = (stepInDecade / totalSteps) * 100;
        }
        return (
          <div
            key={i}
            className={cls}
            style={{ ["--progress" as string]: `${progress}%` }}
          />
        );
      })}
    </div>
  );
}

// ── PrayerScreen ───────────────────────────────────────────────────────────
function PrayerScreen({
  mysteryId,
  settings,
  onExit,
  onComplete,
}: {
  mysteryId: MysteryId;
  settings: Settings;
  onExit: () => void;
  onComplete: () => void;
}) {
  const allDecades = useMemo(
    () => [0, 1, 2, 3, 4].map((i) => buildDecadeSteps(mysteryId, i)),
    [mysteryId]
  );

  const [decadeIdx, setDecadeIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<Speed>(settings.speed);
  const [progress, setProgress] = useState(0);
  const [offset, setOffset] = useState(0);

  const currentSteps = allDecades[decadeIdx];
  const currentStep = currentSteps[stepIdx];

  const beadStats = useMemo(() => {
    let filled = 0;
    let current = -1;
    for (let s = 0; s <= stepIdx; s++) {
      const st = currentSteps[s];
      if (st.kind === "hailMary") {
        if (s < stepIdx) filled++;
        else current = st.beadIndex ?? -1;
      }
    }
    return { filled, current };
  }, [stepIdx, currentSteps]);

  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const linesContainerRef = useRef<HTMLDivElement>(null);

  // Re-center current line in view
  useEffect(() => {
    const el = lineRefs.current[lineIdx];
    const body = bodyRef.current;
    if (!el || !body) return;
    const lineCenter = el.offsetTop + el.offsetHeight / 2;
    const bodyCenter = body.clientHeight / 2;
    setOffset(bodyCenter - lineCenter);
  }, [lineIdx, stepIdx, decadeIdx]);

  // Stable ref so advance closure doesn't go stale
  const stateRef = useRef({ decadeIdx, stepIdx, lineIdx, allDecades, currentSteps, currentStep });
  stateRef.current = { decadeIdx, stepIdx, lineIdx, allDecades, currentSteps, currentStep };

  const advance = useCallback(() => {
    const { lineIdx: li, currentStep: cs, stepIdx: si, currentSteps: cst, decadeIdx: di, allDecades: all } = stateRef.current;
    const lineCount = cs.lines.length;
    if (li + 1 < lineCount) {
      setLineIdx(li + 1);
      return;
    }
    // End of step → next step
    if (si + 1 < cst.length) {
      setStepIdx(si + 1);
      setLineIdx(0);
      return;
    }
    // End of decade → next decade
    if (di + 1 < all.length) {
      setDecadeIdx(di + 1);
      setStepIdx(0);
      setLineIdx(0);
      return;
    }
    // All done
    setPlaying(false);
    setTimeout(() => onComplete(), 200);
  }, [onComplete]);

  // RAF-based progress bar & auto-advance
  useEffect(() => {
    setProgress(0);
    if (!playing) return;

    const line = currentStep.lines[lineIdx] ?? "";
    const charCount = Math.max(line.replace(/\s/g, "").length, 4);
    const base = charCount * SPEED_MS_PER_CHAR[speed];
    let adjusted = Math.min(MAX_LINE_MS[speed], Math.max(MIN_LINE_MS[speed], base));
    if (currentStep.kind === "announce") adjusted *= 1.4;

    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / adjusted);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        advance();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, lineIdx, stepIdx, decadeIdx, currentStep, advance]);

  const stepBack = () => {
    setLineIdx(0);
    if (stepIdx > 0) {
      setStepIdx(stepIdx - 1);
    } else if (decadeIdx > 0) {
      setDecadeIdx(decadeIdx - 1);
      setStepIdx(allDecades[decadeIdx - 1].length - 1);
    }
  };

  const stepForward = () => {
    setLineIdx(0);
    if (stepIdx + 1 < currentSteps.length) {
      setStepIdx(stepIdx + 1);
    } else if (decadeIdx + 1 < allDecades.length) {
      setDecadeIdx(decadeIdx + 1);
      setStepIdx(0);
    } else {
      onComplete();
    }
  };

  const m = MYSTERIES[mysteryId];

  return (
    <div className="prayer-screen fade-in">
      <header className="prayer-header">
        <button className="appbar-btn icon-only" onClick={onExit} aria-label="나가기">
          <BackIcon />
        </button>
        <div className="prayer-header-left" style={{ textAlign: "center" }}>
          <p className="prayer-mystery-name">{m.name}</p>
          <p className="prayer-stage-name">
            {decadeIdx + 1}단 · {currentStep.title}
          </p>
        </div>
        <div style={{ width: 48 }} />
      </header>

      <DecadePips
        decadeIdx={decadeIdx}
        stepInDecade={stepIdx + 1}
        totalSteps={currentSteps.length}
      />

      <div className="prayer-body" ref={bodyRef}>
        <div
          className="prayer-lines"
          ref={linesContainerRef}
          style={{ transform: `translateY(${offset}px)` }}
        >
          {currentStep.lines.map((line, i) => {
            let cls = "prayer-line";
            if (i < lineIdx) cls += " past";
            else if (i === lineIdx) cls += " current";
            else cls += " future";
            if (currentStep.kind === "announce") cls += " announce-marker";
            return (
              <div
                key={i}
                ref={(el) => { lineRefs.current[i] = el; }}
                className={cls}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>

      {currentStep.kind === "hailMary" && (
        <Beads filled={beadStats.filled} current={beadStats.current} />
      )}

      <div className={"line-progress " + (playing ? "" : "paused")}>
        <div className="line-progress-fill" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div className="controls">
        <div className="controls-row">
          {(["slow", "normal", "fast"] as Speed[]).map((s) => (
            <button
              key={s}
              className="ctrl-btn"
              aria-pressed={speed === s}
              onClick={() => setSpeed(s)}
            >
              {s === "slow" ? "느림" : s === "normal" ? "보통" : "빠름"}
              {s === "slow" && <span className="ctrl-label">천천히</span>}
            </button>
          ))}
        </div>

        <div className="controls-row">
          <button className="ctrl-btn" onClick={stepBack} aria-label="이전 기도">
            <BackIcon size={22} />
            <span className="ctrl-label">이전</span>
          </button>
          <button
            className={"ctrl-btn play-pause " + (playing ? "" : "paused")}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <PauseIcon size={28} /> : <PlayIcon size={28} />}
            <span className="ctrl-label">{playing ? "잠시 멈춤" : "이어 바치기"}</span>
          </button>
          <button className="ctrl-btn" onClick={stepForward} aria-label="다음 기도">
            <ForwardIcon size={22} />
            <span className="ctrl-label">다음</span>
          </button>
        </div>

        <button
          className="ctrl-btn"
          disabled
          style={{ background: "transparent", border: "1.5px dashed var(--line)" }}
        >
          <SpeakerIcon size={20} />
          <span className="ctrl-label" style={{ fontSize: 14 }}>음성 낭독 (준비 중)</span>
        </button>
      </div>
    </div>
  );
}

// ── CompleteScreen ─────────────────────────────────────────────────────────
function CompleteScreen({
  mysteryId,
  durationSec,
  onAgain,
  onHome,
}: {
  mysteryId: MysteryId;
  durationSec: number;
  onAgain: () => void;
  onHome: () => void;
}) {
  const m = MYSTERIES[mysteryId];
  const min = Math.floor(durationSec / 60);
  const sec = durationSec % 60;

  return (
    <div className="screen complete fade-in">
      <div className="complete-cross">
        <svg width="84" height="84" viewBox="0 0 56 56" fill="none">
          <line x1="28" y1="4" x2="28" y2="52" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="10" y1="18" x2="46" y2="18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="2" strokeDasharray="3 6" opacity="0.4" />
        </svg>
      </div>
      <h1>수고하셨습니다</h1>
      <p className="sub">
        오늘 {m.name}를 모두<br />마치셨습니다.
      </p>

      <div className="complete-stats">
        <div className="stat">
          <div className="stat-val">5단</div>
          <div className="stat-label">완료</div>
        </div>
        <div className="stat">
          <div className="stat-val">50</div>
          <div className="stat-label">성모송</div>
        </div>
        {durationSec > 0 && (
          <div className="stat">
            <div className="stat-val">{min}분 {sec}초</div>
            <div className="stat-label">소요 시간</div>
          </div>
        )}
      </div>

      <button className="big-btn primary" onClick={onAgain}>다시 바치기</button>
      <div style={{ height: 12 }} />
      <button className="big-btn secondary" onClick={onHome}>처음 화면으로</button>
    </div>
  );
}

// ── SettingsScreen ─────────────────────────────────────────────────────────
function SettingsScreen({
  settings,
  setSettings,
  onBack,
  onShowIntro,
}: {
  settings: Settings;
  setSettings: (s: Settings) => void;
  onBack: () => void;
  onShowIntro: () => void;
}) {
  const SIZES = [
    { v: 26, label: "작게" },
    { v: 32, label: "보통" },
    { v: 40, label: "크게" },
    { v: 48, label: "더 크게" },
  ];
  const THEMES: { v: Theme; label: string; swatch: string }[] = [
    { v: "warm", label: "따뜻한 베이지", swatch: "#f4ead2" },
    { v: "cream", label: "크림 (고대비)", swatch: "#ffffff" },
    { v: "night", label: "밤 모드", swatch: "#1d1813" },
  ];
  const LINE_SPACINGS = [
    { v: 1.4, label: "좁게" },
    { v: 1.6, label: "보통" },
    { v: 1.9, label: "넓게" },
    { v: 2.2, label: "더 넓게" },
  ];
  const SPEEDS: { v: Speed; label: string }[] = [
    { v: "slow", label: "느림" },
    { v: "normal", label: "보통" },
    { v: "fast", label: "빠름" },
  ];

  return (
    <>
      <header className="appbar">
        <button className="appbar-btn icon-only" onClick={onBack} aria-label="뒤로">
          <BackIcon />
        </button>
        <div className="appbar-title">설정</div>
        <div style={{ width: 48 }} />
      </header>

      <div className="screen fade-in">
        <div className="settings-section">
          <div className="settings-label">
            <span>글씨 크기</span>
            <span className="settings-value">{settings.fontSize}px</span>
          </div>
          <div className="size-row">
            {SIZES.map((s) => (
              <button
                key={s.v}
                className="size-btn"
                aria-pressed={settings.fontSize === s.v}
                style={{ fontSize: Math.min(s.v, 22) }}
                onClick={() => setSettings({ ...settings, fontSize: s.v })}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: 18,
              background: "var(--bg-elev)",
              borderRadius: 12,
              border: "1px solid var(--line)",
              fontFamily: "var(--serif)",
              fontSize: settings.fontSize,
              textAlign: "center",
              color: "var(--ink)",
            }}
          >
            은총이 가득하신 마리아님
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-label">
            <span>화면 색</span>
          </div>
          <div className="theme-row">
            {THEMES.map((t) => (
              <button
                key={t.v}
                className="theme-btn"
                aria-pressed={settings.theme === t.v}
                style={{
                  background: t.swatch,
                  color: t.v === "night" ? "#f3e6c8" : "#3a2412",
                }}
                onClick={() => setSettings({ ...settings, theme: t.v })}
              >
                <div className="theme-swatch" style={{ background: t.swatch }} />
                <span style={{ fontSize: 14 }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-label">
            <span>줄 간격</span>
            <span className="settings-value">{settings.lineSpacing.toFixed(1)}</span>
          </div>
          <div className="size-row">
            {LINE_SPACINGS.map((s) => (
              <button
                key={s.v}
                className="size-btn"
                aria-pressed={settings.lineSpacing === s.v}
                onClick={() => setSettings({ ...settings, lineSpacing: s.v })}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: 18,
              background: "var(--bg-elev)",
              borderRadius: 12,
              border: "1px solid var(--line)",
              fontFamily: "var(--serif)",
              fontSize: Math.min(settings.fontSize, 26),
              lineHeight: settings.lineSpacing,
              textAlign: "center",
              color: "var(--ink)",
            }}
          >
            은총이 가득하신<br />마리아님, 기뻐하소서.
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-label">
            <span>기본 속도</span>
          </div>
          <div className="size-row">
            {SPEEDS.map((s) => (
              <button
                key={s.v}
                className="size-btn"
                aria-pressed={settings.speed === s.v}
                onClick={() => setSettings({ ...settings, speed: s.v })}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button className="big-btn ghost" onClick={onShowIntro}>
          사용 안내 다시 보기
        </button>
      </div>
    </>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
export default function RosaryApp() {
  const [mounted, setMounted] = useState(false);
  const [route, setRoute] = useState<Route>("home");
  const [mysteryId, setMysteryId] = useState<MysteryId | null>(null);
  const [settings, setSettingsRaw] = useState<Settings>(DEFAULT_SETTINGS);
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Hydrate from localStorage after mount
  useEffect(() => {
    const introSeen = localStorage.getItem("rosary.introSeen") === "1";
    if (!introSeen) setRoute("intro");

    try {
      const saved = JSON.parse(localStorage.getItem("rosary.settings") ?? "{}");
      setSettingsRaw((prev) => ({ ...prev, ...saved }));
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const setSettings = (s: Settings) => {
    setSettingsRaw(s);
    localStorage.setItem("rosary.settings", JSON.stringify(s));
  };

  // Apply theme/font to document
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", settings.theme);
    document.documentElement.style.setProperty("--fs-base", settings.fontSize + "px");
    document.documentElement.style.setProperty("--line-height", String(settings.lineSpacing));
  }, [mounted, settings.theme, settings.fontSize, settings.lineSpacing]);

  const startMystery = (id: MysteryId) => {
    setMysteryId(id);
    setStartTime(Date.now());
    setRoute("prayer");
  };

  const completePrayer = () => {
    setDuration(Math.floor((Date.now() - startTime) / 1000));
    setRoute("complete");
  };

  // Prevent hydration mismatch — render a minimal shell until mounted
  if (!mounted) {
    return (
      <div className="phone" style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--gold)", fontFamily: "var(--serif)", fontSize: 24 }}>묵주기도</div>
      </div>
    );
  }

  return (
    <div className="phone">
      {route === "intro" && (
        <IntroScreen onStart={() => setRoute("home")} />
      )}
      {route === "home" && (
        <HomeScreen
          onStartMystery={startMystery}
          onOpenSettings={() => setRoute("settings")}
        />
      )}
      {route === "prayer" && mysteryId && (
        <PrayerScreen
          mysteryId={mysteryId}
          settings={settings}
          onExit={() => setRoute("home")}
          onComplete={completePrayer}
        />
      )}
      {route === "complete" && mysteryId && (
        <CompleteScreen
          mysteryId={mysteryId}
          durationSec={duration}
          onAgain={() => startMystery(mysteryId)}
          onHome={() => setRoute("home")}
        />
      )}
      {route === "settings" && (
        <SettingsScreen
          settings={settings}
          setSettings={setSettings}
          onBack={() => setRoute("home")}
          onShowIntro={() => {
            localStorage.removeItem("rosary.introSeen");
            setRoute("intro");
          }}
        />
      )}
    </div>
  );
}
