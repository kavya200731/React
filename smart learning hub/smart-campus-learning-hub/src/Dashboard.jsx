import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "./Navbar";
import "./Dashboard.css";
import TasksInline from "./Tasks";
import NotesInline from "./Notes";
import GoalsInline from "./Goals";

const SECTION_GAP = 24;

function safeParseJson(raw, fallback) {
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function loadArrayFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = safeParseJson(raw, []);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadNumberFromStorage(key, fallback = 0) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = safeParseJson(raw, fallback);
    if (typeof parsed === "number") return parsed;
    if (Array.isArray(parsed)) return parsed.length;
    if (parsed && typeof parsed === "object") return Object.keys(parsed).length;
    return fallback;
  } catch {
    return fallback;
  }
}

function getUserLabel() {
  try {
    const raw = localStorage.getItem("smartCampusUser");
    if (!raw) return "Student";
    const parsed = safeParseJson(raw, null);
    return parsed?.username || parsed?.email || "Student";
  } catch {
    return "Student";
  }
}

export default function Dashboard() {
  const tasksRef = useRef(null);
  const notesRef = useRef(null);
  const goalsRef = useRef(null);
  const progressRef = useRef(null);

  const [storageTick, setStorageTick] = useState(0);

  // Keep totals/progress fresh when user changes data in other sections.
  useEffect(() => {
    const onStorage = (e) => {
      // Update when relevant localStorage keys change.
      if (!e?.key) return;
      const watched = [
        "smartCampusTasks",
        "smartCampusCompletedTasks",
        "smartCampusNotes",
        "smartCampusCompletedNotes",
        "smartCampusGoals",
        "smartCampusCompletedGoals",
        "smartCampusUser",
      ];
      if (watched.includes(e.key)) setStorageTick((t) => t + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const totals = useMemo(() => {
    const totalTasks = loadArrayFromStorage("smartCampusTasks").length;
    const totalNotes = loadArrayFromStorage("smartCampusNotes").length;
    const totalGoals = loadArrayFromStorage("smartCampusGoals").length;

    const completedTasks = loadNumberFromStorage("smartCampusCompletedTasks", 0);
    const completedNotes = loadNumberFromStorage("smartCampusCompletedNotes", 0);
    const completedGoals = loadNumberFromStorage("smartCampusCompletedGoals", 0);

    const totalItems = totalTasks + totalNotes + totalGoals;
    const completedItems = completedTasks + completedNotes + completedGoals;

    const progressPercentage = totalItems === 0 ? 0 : Math.min(100, Math.round((completedItems / totalItems) * 100));

    return { totalTasks, totalNotes, totalGoals, completedTasks, completedNotes, completedGoals, progressPercentage };
  }, [storageTick]);

  // Smooth scroll helpers for the navbar-like anchors.
  const scrollTo = (ref) => {
    if (!ref?.current) return;
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Listen for custom events from Navbar links (when routes still go by /dashboard).
  useEffect(() => {
    const handler = (ev) => {
      const to = ev?.detail?.to;
      if (!to) return;
      if (to === "/tasks") scrollTo(tasksRef);
      if (to === "/notes") scrollTo(notesRef);
      if (to === "/goals") scrollTo(goalsRef);
      if (to === "/progress") scrollTo(progressRef);
    };
    window.addEventListener("sc-scroll-to", handler);
    return () => window.removeEventListener("sc-scroll-to", handler);
  }, []);

  // Sections: Task/Notes/Goals/Progress content is rendered by their existing components.
  // To keep everything on ONE page, we render those components inline.


  return (
    <div className="sc-shell">
      <Navbar />

      <main style={{ padding: 20, maxWidth: 1120, margin: "0 auto" }}>

        <header style={{ marginBottom: SECTION_GAP }}>
          <h1 style={{ margin: "0 0 10px" }}>Welcome, {getUserLabel()}</h1>
          <p style={{ margin: 0, color: "rgba(0,0,0,0.65)" }}>Everything in one place—tasks, notes, goals, and your progress.</p>

            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            <div className="sc-glass">
              <div style={{ fontSize: 14, color: "rgba(234,241,255,0.72)", fontWeight: 800 }}>Total Tasks</div>
              <div style={{ fontSize: 34, fontWeight: 900, marginTop: 6 }}>{totals.totalTasks}</div>
            </div>
            <div className="sc-glass">
              <div style={{ fontSize: 14, color: "rgba(234,241,255,0.72)", fontWeight: 800 }}>Total Notes</div>
              <div style={{ fontSize: 34, fontWeight: 900, marginTop: 6 }}>{totals.totalNotes}</div>
            </div>
            <div className="sc-glass">
              <div style={{ fontSize: 14, color: "rgba(234,241,255,0.72)", fontWeight: 800 }}>Total Goals</div>
              <div style={{ fontSize: 34, fontWeight: 900, marginTop: 6 }}>{totals.totalGoals}</div>
            </div>
            <div className="sc-glass sc-glass--accent" ref={progressRef}>
              <div style={{ fontSize: 14, color: "rgba(234,241,255,0.72)", fontWeight: 800 }}>Progress</div>
              <div style={{ fontSize: 34, fontWeight: 900, marginTop: 6 }}>{totals.progressPercentage}%</div>
              <div style={{ marginTop: 12, height: 12, borderRadius: 999, background: "rgba(255,255,255,0.10)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ width: `${totals.progressPercentage}%`, height: "100%", background: "linear-gradient(90deg, #1976d2, #42a5f5)" }} />
              </div>
            </div>
          </div>

        </header>

        <section ref={tasksRef} style={{ marginBottom: SECTION_GAP }} aria-label="Tasks section">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <h2 style={{ margin: 0 }}>Tasks</h2>
            <button
              type="button"
              className="btn btnSecondary"
              style={{ padding: "8px 12px", fontWeight: 900 }}
              onClick={() => setStorageTick((t) => t + 1)}
            >
              Refresh
            </button>
          </div>
          <div style={{ background: "transparent" }}>
            <TasksInline />
          </div>
        </section>

        <section ref={notesRef} style={{ marginBottom: SECTION_GAP }} aria-label="Notes section">
          <h2 style={{ margin: 0, marginBottom: 12 }}>Notes</h2>
          <NotesInline />
        </section>

        <section ref={goalsRef} style={{ marginBottom: SECTION_GAP }} aria-label="Goals section">
          <h2 style={{ margin: 0, marginBottom: 12 }}>Goals</h2>
          <GoalsInline />
        </section>

        <section aria-label="Progress details" style={{ marginBottom: 30 }}>
          <div className="sc-glass" style={{ padding: 18 }}>

            <h2 style={{ margin: 0, marginBottom: 10 }}>Progress Details</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              <div style={{ background: "rgba(25, 118, 210, 0.06)", border: "1px solid rgba(25,118,210,0.18)", borderRadius: 14, padding: 14 }}>
                <div style={{ fontWeight: 900, color: "rgba(15,23,42,0.85)" }}>Tasks</div>
                <div style={{ marginTop: 6, color: "rgba(15,23,42,0.7)" }}>
                  Completed <b style={{ color: "#0f5aa5" }}>{totals.completedTasks}</b> / {totals.totalTasks}
                </div>
              </div>
              <div style={{ background: "rgba(25, 118, 210, 0.06)", border: "1px solid rgba(25,118,210,0.18)", borderRadius: 14, padding: 14 }}>
                <div style={{ fontWeight: 900, color: "rgba(15,23,42,0.85)" }}>Notes</div>
                <div style={{ marginTop: 6, color: "rgba(15,23,42,0.7)" }}>
                  Completed <b style={{ color: "#0f5aa5" }}>{totals.completedNotes}</b> / {totals.totalNotes}
                </div>
              </div>
              <div style={{ background: "rgba(25, 118, 210, 0.06)", border: "1px solid rgba(25,118,210,0.18)", borderRadius: 14, padding: 14 }}>
                <div style={{ fontWeight: 900, color: "rgba(15,23,42,0.85)" }}>Goals</div>
                <div style={{ marginTop: 6, color: "rgba(15,23,42,0.7)" }}>
                  Achieved <b style={{ color: "#0f5aa5" }}>{totals.completedGoals}</b> / {totals.totalGoals}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

