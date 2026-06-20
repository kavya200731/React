import React, { useMemo } from "react";

function readNumberFromLocalStorage(key, fallback = 0) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (typeof parsed === "number") return parsed;
    if (Array.isArray(parsed)) return parsed.length;
    if (parsed && typeof parsed === "object") return Object.keys(parsed).length;
    return fallback;
  } catch {
    return fallback;
  }
}

function readUserLabel() {
  try {
    const raw = localStorage.getItem("smartCampusUser");
    if (!raw) return "Student";
    const parsed = JSON.parse(raw);
    return parsed?.username || parsed?.email || "Student";
  } catch {
    return "Student";
  }
}

const cardStyle = {
  background: "#ffffff",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 12,
  padding: 16,
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
};

export default function Progress() {
  const { totalTasks, totalNotes, totalGoals, completedTasks, completedNotes, completedGoals, progressPercentage } = useMemo(() => {
    const totalTasks = readNumberFromLocalStorage("smartCampusTasks", 0);
    const totalNotes = readNumberFromLocalStorage("smartCampusNotes", 0);
    const totalGoals = readNumberFromLocalStorage("smartCampusGoals", 0);

    const completedTasks = readNumberFromLocalStorage("smartCampusCompletedTasks", 0);
    const completedNotes = readNumberFromLocalStorage("smartCampusCompletedNotes", 0);
    const completedGoals = readNumberFromLocalStorage("smartCampusCompletedGoals", 0);

    const totalItems = totalTasks + totalNotes + totalGoals;
    const completedItems = completedTasks + completedNotes + completedGoals;

    const pct = totalItems === 0 ? 0 : Math.min(100, Math.round((completedItems / totalItems) * 100));

    return { totalTasks, totalNotes, totalGoals, completedTasks, completedNotes, completedGoals, progressPercentage: pct };
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 14px" }}>Progress</h1>
      <p style={{ marginTop: 0, color: "rgba(0,0,0,0.65)" }}>
        {readUserLabel()}, here is your overall learning progress.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, alignItems: "stretch" }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 14, color: "rgba(0,0,0,0.65)" }}>Overall Progress</div>
          <div style={{ fontSize: 42, fontWeight: 800, marginTop: 6 }}>{progressPercentage}%</div>

          <div style={{ marginTop: 14, background: "rgba(0,0,0,0.06)", borderRadius: 999, height: 12, overflow: "hidden" }}>
            <div style={{ width: `${progressPercentage}%`, height: "100%", background: "#1976d2" }} />
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
            Based on completed items across tasks, notes, and goals.
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontWeight: 700 }}>Tasks</div>
          <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
            <div style={{ fontSize: 14, color: "rgba(0,0,0,0.7)" }}>
              Completed: <b>{completedTasks}</b>
            </div>
            <div style={{ fontSize: 14, color: "rgba(0,0,0,0.7)" }}>
              Total: <b>{totalTasks}</b>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontWeight: 700 }}>Notes</div>
          <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
            <div style={{ fontSize: 14, color: "rgba(0,0,0,0.7)" }}>
              Completed: <b>{completedNotes}</b>
            </div>
            <div style={{ fontSize: 14, color: "rgba(0,0,0,0.7)" }}>
              Total: <b>{totalNotes}</b>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontWeight: 700 }}>Goals</div>
          <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
            <div style={{ fontSize: 14, color: "rgba(0,0,0,0.7)" }}>
              Completed: <b>{completedGoals}</b>
            </div>
            <div style={{ fontSize: 14, color: "rgba(0,0,0,0.7)" }}>
              Total: <b>{totalGoals}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

