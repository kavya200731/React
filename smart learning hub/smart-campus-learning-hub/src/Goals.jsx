import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "smartCampusGoals";
const COMPLETED_KEY = "smartCampusCompletedGoals";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadGoals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistGoals(goals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  const completed = goals.filter((g) => g.completed).length;
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
}

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingTargetDate, setEditingTargetDate] = useState("");

  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  useEffect(() => {
    persistGoals(goals);
  }, [goals]);

  const completedCount = useMemo(() => goals.filter((g) => g.completed).length, [goals]);

  const resetForm = () => {
    setTitle("");
    setTargetDate("");
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setError("");

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Goal title is required.");
      return;
    }

    const newGoal = {
      id: uid(),
      title: trimmedTitle,
      targetDate: targetDate || "",
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setGoals((prev) => [newGoal, ...prev]);
    resetForm();
  };

  const toggleAchieved = (id) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  const startEdit = (goal) => {
    setEditingId(goal.id);
    setEditingTitle(goal.title);
    setEditingTargetDate(goal.targetDate || "");
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingTargetDate("");
    setError("");
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedTitle = editingTitle.trim();
    if (!trimmedTitle) {
      setError("Goal title is required.");
      return;
    }

    setGoals((prev) =>
      prev.map((g) =>
        g.id === editingId
          ? { ...g, title: trimmedTitle, targetDate: editingTargetDate || "" }
          : g
      )
    );

    setEditingId(null);
    setEditingTitle("");
    setEditingTargetDate("");
  };

  const handleDelete = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    if (editingId === id) cancelEdit();
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 14px" }}>Goals</h1>
      <p style={{ marginTop: 0, color: "rgba(0,0,0,0.65)" }}>
        {goals.length} total • {completedCount} achieved
      </p>

      <div style={{ display: "grid", gap: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>Add Goal</h2>
          <form onSubmit={handleAdd} style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontWeight: 900, marginBottom: 6 }}>Goal</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Pass Calculus"
                style={{ padding: 11, borderRadius: 12, width: "100%", border: "1px solid rgba(0,0,0,0.15)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 900, marginBottom: 6 }}>Target Date (optional)</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                style={{ padding: 11, borderRadius: 12, width: "100%", border: "1px solid rgba(0,0,0,0.15)" }}
              />
            </div>

            {error ? <div className="error" style={{ color: "#b00020", fontWeight: 900 }}>{error}</div> : null}

            <button
              type="submit"
              style={{ padding: "10px 14px", borderRadius: 12, border: 0, background: "#1976d2", color: "#fff", fontWeight: 900, width: "fit-content" }}
            >
              Add Goal
            </button>
          </form>
        </div>

        {editingId ? (
          <div className="card" style={{ padding: 16 }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>Edit Goal</h2>
            <form onSubmit={saveEdit} style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontWeight: 900, marginBottom: 6 }}>Goal</label>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  style={{ padding: 11, borderRadius: 12, width: "100%", border: "1px solid rgba(0,0,0,0.15)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 900, marginBottom: 6 }}>Target Date</label>
                <input
                  type="date"
                  value={editingTargetDate}
                  onChange={(e) => setEditingTargetDate(e.target.value)}
                  style={{ padding: 11, borderRadius: 12, width: "100%", border: "1px solid rgba(0,0,0,0.15)" }}
                />
              </div>

              {error ? <div className="error" style={{ color: "#b00020", fontWeight: 900 }}>{error}</div> : null}

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="submit"
                  style={{ padding: "10px 14px", borderRadius: 12, border: 0, background: "#1976d2", color: "#fff", fontWeight: 900 }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.15)", background: "#fff", color: "rgba(15,23,42,0.9)", fontWeight: 900 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="card" style={{ padding: 16 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>Your Goals</h2>

          {goals.length === 0 ? (
            <div style={{ color: "rgba(0,0,0,0.65)" }}>No goals yet. Add one above.</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
              {goals.map((goal) => (
                <li
                  key={goal.id}
                  style={{
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 12,
                    padding: 14,
                    background: "#fff",
                    display: "grid",
                    gridTemplateColumns: "24px 1fr auto",
                    gap: 12,
                    alignItems: "start",
                  }}
                >
                  <input type="checkbox" checked={goal.completed} onChange={() => toggleAchieved(goal.id)} aria-label="Mark goal achieved" />

                  <div>
                    <div style={{ fontWeight: 950, textDecoration: goal.completed ? "line-through" : "none", color: goal.completed ? "rgba(0,0,0,0.45)" : "#000" }}>
                      {goal.title}
                    </div>
                    {goal.targetDate ? (
                      <div style={{ marginTop: 6, fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
                        Target: {goal.targetDate}
                      </div>
                    ) : null}
                    <div style={{ marginTop: 6, fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
                      Created: {new Date(goal.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => startEdit(goal)}
                      style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)", background: "#fff", fontWeight: 900 }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(goal.id)}
                      style={{ padding: "8px 10px", borderRadius: 10, border: 0, background: "#d32f2f", color: "#fff", fontWeight: 900 }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

