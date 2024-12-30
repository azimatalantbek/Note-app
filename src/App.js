import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
    category: "",
    deadline: "",
    important: false,
    completed: false,
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(storedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addOrEditNote = () => {
    if (!newNote.title || !newNote.description) return;

    if (editIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = newNote;
      setNotes(updatedNotes);
      setEditIndex(null);
    } else {
      setNotes([...notes, newNote]);
    }

    setNewNote({
      title: "",
      description: "",
      category: "",
      deadline: "",
      important: false,
      completed: false,
    });
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  const filterNotes = () => {
    const filteredNotes = notes.filter(
      (note) =>
        (!searchQuery ||
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (currentPage === "home" || note.category.toLowerCase() === currentPage)
    );
    return filteredNotes;
  };

  const toggleImportant = (index) => {
    const updatedNotes = [...notes];
    updatedNotes[index].important = !updatedNotes[index].important;
    setNotes(updatedNotes);
  };

  const toggleComplete = (index) => {
    const updatedNotes = [...notes];
    updatedNotes[index].completed = !updatedNotes[index].completed;
    setNotes(updatedNotes);
  };

  const startEditNote = (index) => {
    setNewNote(notes[index]);
    setEditIndex(index);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Notes App</h1>
        <nav>
          <button onClick={() => setCurrentPage("home")}>Home</button>
          <button onClick={() => setCurrentPage("work")}>Work</button>
          <button onClick={() => setCurrentPage("personal")}>Personal</button>
          <input
            type="text"
            placeholder="Search Notes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </nav>
      </header>
      <div className="note-form">
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newNote.description}
          onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
        />
        <select
          value={newNote.category}
          onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
        >
          <option value="">Select Category</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={newNote.important}
            onChange={(e) => setNewNote({ ...newNote, important: e.target.checked })}
          />
          Important
        </label>
        <input
          type="date"
          value={newNote.deadline}
          onChange={(e) => setNewNote({ ...newNote, deadline: e.target.value })}
        />
        <button onClick={addOrEditNote}>{editIndex !== null ? "Edit Note" : "Add Note"}</button>
      </div>
      <div className="notes-container">
        {filterNotes().map((note, index) => (
          <div
            key={index}
            className={`note ${note.important ? "important" : ""} ${note.completed ? "completed" : ""}`}
          >
            <h3>{note.title}</h3>
            <p>{note.description}</p>
            {note.deadline && <span className="deadline">Deadline: {note.deadline}</span>}
            <div className="note-actions">
              <button onClick={() => toggleImportant(index)}>
                {note.important ? "Unmark Important" : "Mark as Important"}
              </button>
              <button onClick={() => toggleComplete(index)}>
                {note.completed ? "Unmark Complete" : "Mark as Complete"}
              </button>
              <button onClick={() => startEditNote(index)}>Edit</button>
              <button onClick={() => deleteNote(index)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
