import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "smartCampusTasks";
const COMPLETED_KEY = "smartCampusCompletedTasks";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  const completed = tasks.filter((t) => t.completed).length;
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);

  useEffect(() => {
    const initial = loadTasks();
    setTasks(initial);
  }, []);

  useEffect(() => {
    persistTasks(tasks);
  }, [tasks]);

  const handleAdd = (e) => {
    e.preventDefault();
    setError("");

    const trimmed = title.trim();
    if (!trimmed) {
      setError("Task title is required.");
      return;
    }

    const newTask = {
      id: uid(),
      title: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setTitle("");
  };

  const toggleCompleted = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 14px" }}>Tasks</h1>
      <p style={{ marginTop: 0, color: "rgba(0,0,0,0.65)" }}>
        {tasks.length} total • {completedCount} completed
      </p>

      <div
        className="card"
        style={{ marginBottom: 16, padding: 16, display: "grid", gap: 12 }}
      >
        <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task..."
            style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)" }}
          />
          <button
            type="submit"
            style={{ padding: "10px 14px", borderRadius: 10, border: 0, background: "#1976d2", color: "#fff", fontWeight: 800 }}
          >
            Add
          </button>
        </form>

        {error ? <div className="error" style={{ color: "#b00020", fontWeight: 800 }}>{error}</div> : null}
      </div>

      <div className="card" style={{ padding: 16 }}>
        {tasks.length === 0 ? (
          <div style={{ color: "rgba(0,0,0,0.65)" }}>No tasks yet. Add your first task above.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
            {tasks.map((task) => (
              <li
                key={task.id}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.08)",
                  display: "grid",
                  gridTemplateColumns: "24px 1fr auto",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompleted(task.id)}
                  aria-label="Mark task completed"
                />

                <div>
                  <div
                    style={{
                      fontWeight: 750,
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "rgba(0,0,0,0.45)" : "#000",
                    }}
                  >
                    {task.title}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", marginTop: 2 }}>
                    {new Date(task.createdAt).toLocaleString()}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(task.id)}
                  style={{ padding: "8px 12px", borderRadius: 10, border: 0, background: "#d32f2f", color: "#fff", fontWeight: 800 }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

