import React, { useEffect, useMemo, useState } from "react";

const LS_KEYS = {
  tasks: "smartCampusTasks",
  tasksCompletedCount: "smartCampusCompletedTasks",
  notes: "smartCampusNotes",
  notesCompletedCount: "smartCampusCompletedNotes",
  goals: "smartCampusGoals",
  goalsCompletedCount: "smartCampusCompletedGoals",
  user: "smartCampusUser",
};

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeJsonParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function readArray(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = safeJsonParse(raw, []);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readNumber(key, fallback = 0) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = safeJsonParse(raw, fallback);
    return typeof parsed === "number" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeNumber(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUserLabel() {
  try {
    const raw = localStorage.getItem(LS_KEYS.user);
    if (!raw) return "Student";
    const parsed = safeJsonParse(raw, null);
    return parsed?.username || parsed?.email || "Student";
  } catch {
    return "Student";
  }
}

function cardStyle() {
  return {
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
  };
}

function Section({ title, subtitle, id, children }) {
  return (
    <section id={id} style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, letterSpacing: 0.1 }}>{title}</h2>
          {subtitle ? <p style={{ margin: "6px 0 0", color: "rgba(0,0,0,0.65)", fontSize: 13 }}>{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function Dashboard() {
  // Tasks
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");

  // Notes
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDescription, setNoteDescription] = useState("");

  // Goals
  const [goals, setGoals] = useState([]);
  const [goalTitle, setGoalTitle] = useState("");

  // Load from Local Storage
  useEffect(() => {
    setTasks(readArray(LS_KEYS.tasks));
    setNotes(readArray(LS_KEYS.notes));
    setGoals(readArray(LS_KEYS.goals));
  }, []);

  // Persist + completed counts
  useEffect(() => {
    writeArray(LS_KEYS.tasks, tasks);
    writeNumber(LS_KEYS.tasksCompletedCount, tasks.filter((t) => t.completed).length);
  }, [tasks]);

  useEffect(() => {
    writeArray(LS_KEYS.notes, notes);
    writeNumber(LS_KEYS.notesCompletedCount, notes.filter((n) => n.completed).length);
  }, [notes]);

  useEffect(() => {
    writeArray(LS_KEYS.goals, goals);
    writeNumber(LS_KEYS.goalsCompletedCount, goals.filter((g) => g.completed).length);
  }, [goals]);

  const completedTasks = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);
  const completedNotes = useMemo(() => notes.filter((n) => n.completed).length, [notes]);
  const completedGoals = useMemo(() => goals.filter((g) => g.completed).length, [goals]);

  const totals = useMemo(() => {
    const totalTasks = tasks.length;
    const totalNotes = notes.length;
    const totalGoals = goals.length;

    const totalItems = totalTasks + totalNotes + totalGoals;
    const completedItems = completedTasks + completedNotes + completedGoals;

    const completionPercentage =
      totalItems === 0 ? 0 : Math.min(100, Math.round((completedItems / totalItems) * 100));

    return {
      totalTasks,
      totalNotes,
      totalGoals,
      completedTasks,
      completedNotes,
      completedGoals,
      completionPercentage,
    };
  }, [tasks, notes, goals, completedTasks, completedNotes, completedGoals]);

  const userLabel = useMemo(() => getUserLabel(), []);

  // Handlers
  const addTask = (e) => {
    e.preventDefault();
    const title = taskTitle.trim();
    if (!title) return;

    const newTask = {
      id: uid(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setTaskTitle("");
  };

  const toggleTaskCompleted = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addNote = (e) => {
    e.preventDefault();
    const title = noteTitle.trim();
    const description = noteDescription.trim();
    if (!title || !description) return;

    const newNote = {
      id: uid(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setNoteTitle("");
    setNoteDescription("");
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const addGoal = (e) => {
    e.preventDefault();
    const title = goalTitle.trim();
    if (!title) return;

    const newGoal = {
      id: uid(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setGoals((prev) => [newGoal, ...prev]);
    setGoalTitle("");
  };

  const toggleGoalAchieved = (id) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const buttonStyle = {
    padding: "10px 14px",
    borderRadius: 12,
    border: 0,
    background: "#1976d2",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.15)",
    outline: "none",
  };

  const textareaStyle = {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.15)",
    outline: "none",
    resize: "vertical",
    minHeight: 96,
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontSize: 26 }}>Student Dashboard</h1>
        <p style={{ margin: "8px 0 0", color: "rgba(0,0,0,0.65)" }}>
          Welcome, {userLabel}. Manage tasks, notes, and goals in one place.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 18 }}>
        <div style={cardStyle()}>
          <div style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", fontWeight: 900 }}>Completion Percentage</div>
          <div style={{ fontSize: 40, fontWeight: 950, marginTop: 6 }}>{totals.completionPercentage}%</div>
          <div style={{ marginTop: 12, height: 12, borderRadius: 999, overflow: "hidden", background: "rgba(0,0,0,0.06)" }}>
            <div
              style={{
                width: `${totals.completionPercentage}%`,
                height: "100%",
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              }}
            />
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: "rgba(0,0,0,0.65)" }}>
            Completed {totals.completedTasks + totals.completedNotes + totals.completedGoals} / {totals.totalTasks + totals.totalNotes + totals.totalGoals}
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", fontWeight: 900 }}>Total Tasks</div>
          <div style={{ fontSize: 34, fontWeight: 950, marginTop: 6 }}>{totals.totalTasks}</div>
          <div style={{ marginTop: 10, fontSize: 13, color: "rgba(0,0,0,0.65)" }}>
            Completed <b style={{ color: "#0f5aa5" }}>{totals.completedTasks}</b>
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", fontWeight: 900 }}>Total Notes</div>
          <div style={{ fontSize: 34, fontWeight: 950, marginTop: 6 }}>{totals.totalNotes}</div>
          <div style={{ marginTop: 10, fontSize: 13, color: "rgba(0,0,0,0.65)" }}>
            Completed <b style={{ color: "#0f5aa5" }}>{totals.completedNotes}</b>
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", fontWeight: 900 }}>Total Goals</div>
          <div style={{ fontSize: 34, fontWeight: 950, marginTop: 6 }}>{totals.totalGoals}</div>
          <div style={{ marginTop: 10, fontSize: 13, color: "rgba(0,0,0,0.65)" }}>
            Achieved <b style={{ color: "#0f5aa5" }}>{totals.completedGoals}</b>
          </div>
        </div>
      </div>

      <Section id="tasks" title="Task Management" subtitle="Add tasks, mark them complete, and delete when done.">
        <div style={{ ...cardStyle(), padding: 16 }}>
          <form onSubmit={addTask} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12 }}>
            <input
              style={inputStyle}
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Add a task..."
              type="text"
            />
            <button type="submit" style={{ ...buttonStyle, whiteSpace: "nowrap" }}>
              Add Task
            </button>
          </form>

          <div style={{ marginTop: 14 }}>
            {tasks.length === 0 ? (
              <div style={{ color: "rgba(0,0,0,0.65)" }}>No tasks yet.</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                {tasks.map((t) => (
                  <li
                    key={t.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "28px 1fr auto",
                      gap: 12,
                      alignItems: "center",
                      padding: 12,
                      borderRadius: 14,
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "#fff",
                    }}
                  >
                    <input type="checkbox" checked={t.completed} onChange={() => toggleTaskCompleted(t.id)} />
                    <div>
                      <div
                        style={{
                          fontWeight: 900,
                          textDecoration: t.completed ? "line-through" : "none",
                          color: t.completed ? "rgba(0,0,0,0.45)" : "#000",
                        }}
                      >
                        {t.title}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
                        {new Date(t.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteTask(t.id)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: 0,
                        background: "#d32f2f",
                        color: "#fff",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>

      <Section id="notes" title="Notes" subtitle="Add notes, view them instantly, and delete when needed.">
        <div style={cardStyle()}>
          <form onSubmit={addNote} style={{ display: "grid", gap: 12 }}>
            <input
              style={inputStyle}
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note title"
              type="text"
            />
            <textarea
              style={textareaStyle}
              value={noteDescription}
              onChange={(e) => setNoteDescription(e.target.value)}
              placeholder="Write note description..."
            />
            <button type="submit" style={{ ...buttonStyle, width: "fit-content" }}>
              Add Note
            </button>
          </form>

          <div style={{ marginTop: 14 }}>
            {notes.length === 0 ? (
              <div style={{ color: "rgba(0,0,0,0.65)" }}>No notes yet.</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
                {notes.map((n) => (
                  <li
                    key={n.id}
                    style={{
                      border: "1px solid rgba(0,0,0,0.08)",
                      borderRadius: 16,
                      padding: 14,
                      background: "#fff",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 950, fontSize: 16 }}>{n.title}</div>
                        <div style={{ marginTop: 8, color: "rgba(0,0,0,0.75)", whiteSpace: "pre-wrap", lineHeight: 1.35 }}>
                          {n.description}
                        </div>
                        <div style={{ marginTop: 8, fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteNote(n.id)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 12,
                          border: 0,
                          background: "#d32f2f",
                          color: "#fff",
                          fontWeight: 900,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
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
      </Section>

      <Section id="goals" title="Goals" subtitle="Add goals, mark them as achieved, and delete any time.">
        <div style={cardStyle()}>
          <form onSubmit={addGoal} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12 }}>
            <input
              style={inputStyle}
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="Add a goal..."
              type="text"
            />
            <button type="submit" style={{ ...buttonStyle, whiteSpace: "nowrap" }}>
              Add Goal
            </button>
          </form>

          <div style={{ marginTop: 14 }}>
            {goals.length === 0 ? (
              <div style={{ color: "rgba(0,0,0,0.65)" }}>No goals yet.</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                {goals.map((g) => (
                  <li
                    key={g.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "28px 1fr auto",
                      gap: 12,
                      alignItems: "center",
                      padding: 12,
                      borderRadius: 14,
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "#fff",
                    }}
                  >
                    <input type="checkbox" checked={g.completed} onChange={() => toggleGoalAchieved(g.id)} />
                    <div>
                      <div
                        style={{
                          fontWeight: 900,
                          textDecoration: g.completed ? "line-through" : "none",
                          color: g.completed ? "rgba(0,0,0,0.45)" : "#000",
                        }}
                      >
                        {g.title}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
                        {new Date(g.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteGoal(g.id)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: 0,
                        background: "#d32f2f",
                        color: "#fff",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>

      <Section id="progress" title="Progress" subtitle="Your completion status based on tasks, notes, and goals.">
        <div style={cardStyle()}>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div style={{ fontWeight: 950 }}>Completion Percentage</div>
                <div style={{ fontWeight: 950, color: "#0f5aa5" }}>{totals.completionPercentage}%</div>
              </div>
              <div style={{ marginTop: 10, height: 12, borderRadius: 999, overflow: "hidden", background: "rgba(0,0,0,0.06)" }}>
                <div
                  style={{
                    width: `${totals.completionPercentage}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 14, background: "#f9fbff" }}>
                <div style={{ fontWeight: 950 }}>Tasks</div>
                <div style={{ marginTop: 8, color: "rgba(0,0,0,0.7)" }}>
                  Completed <b style={{ color: "#0f5aa5" }}>{totals.completedTasks}</b> / {totals.totalTasks}
                </div>
              </div>
              <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 14, background: "#f9fbff" }}>
                <div style={{ fontWeight: 950 }}>Notes</div>
                <div style={{ marginTop: 8, color: "rgba(0,0,0,0.7)" }}>
                  Completed <b style={{ color: "#0f5aa5" }}>{totals.completedNotes}</b> / {totals.totalNotes}
                </div>
              </div>
              <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 14, background: "#f9fbff" }}>
                <div style={{ fontWeight: 950 }}>Goals</div>
                <div style={{ marginTop: 8, color: "rgba(0,0,0,0.7)" }}>
                  Achieved <b style={{ color: "#0f5aa5" }}>{totals.completedGoals}</b> / {totals.totalGoals}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div style={{ height: 10 }} />
    </div>
  );
}

