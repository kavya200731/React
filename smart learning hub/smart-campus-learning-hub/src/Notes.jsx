import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "smartCampusNotes";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const noteCount = useMemo(() => notes.length, [notes]);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  useEffect(() => {
    persistNotes(notes);
  }, [notes]);

  const handleAdd = (e) => {
    e.preventDefault();
    setError("");

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setError("Note title is required.");
      return;
    }

    if (!trimmedDescription) {
      setError("Note description is required.");
      return;
    }

    const newNote = {
      id: uid(),
      title: trimmedTitle,
      description: trimmedDescription,
      createdAt: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setTitle("");
    setDescription("");
  };

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 14px" }}>Notes</h1>
      <p style={{ marginTop: 0, color: "rgba(0,0,0,0.65)" }}>{noteCount} total notes</p>

      <div className="card" style={{ marginBottom: 16, padding: 16 }}>
        <form onSubmit={handleAdd} style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontWeight: 800, marginBottom: 6, color: "rgba(15,23,42,0.75)" }}>
              Add Note Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Chapter 1 Summary"
              style={{ width: "100%", padding: 11, borderRadius: 12, border: "1px solid rgba(0,0,0,0.15)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 800, marginBottom: 6, color: "rgba(15,23,42,0.75)" }}>
              Add Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your note details..."
              rows={5}
              style={{ width: "100%", padding: 11, borderRadius: 12, border: "1px solid rgba(0,0,0,0.15)", resize: "vertical" }}
            />
          </div>

          {error ? <div className="error" style={{ color: "#b00020", fontWeight: 900 }}>{error}</div> : null}

          <button
            type="submit"
            style={{ padding: "10px 14px", borderRadius: 12, border: 0, background: "#1976d2", color: "#fff", fontWeight: 900, width: "fit-content" }}
          >
            Add Note
          </button>
        </form>
      </div>

      <div className="card" style={{ padding: 16 }}>
        {notes.length === 0 ? (
          <div style={{ color: "rgba(0,0,0,0.65)" }}>No notes yet. Add one above.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
            {notes.map((note) => (
              <li
                key={note.id}
                style={{
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 12,
                  padding: 14,
                  background: "#fff",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 900, fontSize: 16 }}>{note.title}</div>
                    <div style={{ marginTop: 8, color: "rgba(0,0,0,0.75)", whiteSpace: "pre-wrap", lineHeight: 1.35 }}>{note.description}</div>
                    <div style={{ marginTop: 8, fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
                      {new Date(note.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(note.id)}
                    style={{ padding: "8px 12px", borderRadius: 10, border: 0, background: "#d32f2f", color: "#fff", fontWeight: 900 }}
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
  );
}

