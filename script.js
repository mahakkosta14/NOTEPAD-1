
window.onload = () => {
  const titleInput = document.getElementById("title");
  const noteInput = document.getElementById("text");
  const toggle = document.getElementById("toggleMode");

  // Load saved notes and theme
  titleInput.value = localStorage.getItem("title") || "";
  noteInput.value = localStorage.getItem("note") || "";
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.className = savedTheme;
  toggle.checked = savedTheme === "dark";

  toggle.addEventListener("change", () => {
    const newTheme = toggle.checked ? "dark" : "light";
    document.body.className = newTheme;
    localStorage.setItem("theme", newTheme);
  });
};

// Save note to local storage
function saveNote() {
  const title = document.getElementById("title").value;
  const note = document.getElementById("text").value;

  localStorage.setItem("title", title);
  localStorage.setItem("note", note);

  alert("Note saved to local storage.");
}

// Download note as text file
function downloadNote() {
  const title = document.getElementById("title").value.trim() || "note";
  const note = document.getElementById("text").value;

  const blob = new Blob([note], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${title}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// Discard current note
function discardNote() {
  if (confirm("Are you sure you want to discard this note?")) {
    document.getElementById("title").value = "";
    document.getElementById("text").value = "";

    // Remove specific note from saved list
    const title = localStorage.getItem("title");
    let notes = JSON.parse(localStorage.getItem("allNotes")) || [];
    notes = notes.filter(note => note.title !== title);

    // Update localStorage
    localStorage.setItem("allNotes", JSON.stringify(notes));
    localStorage.removeItem("title");
    localStorage.removeItem("note");

    renderSidebar(); // Refresh sidebar list
  }
}


// Create a new note and clear storage
function createNewNote() {
  if (confirm("Start a new note? This will erase current content.")) {
    document.getElementById("title").value = "";
    document.getElementById("text").value = "";
    localStorage.removeItem("title");
    localStorage.removeItem("note");
  }
}

//adding a side bar 

function getNotes() {
  return JSON.parse(localStorage.getItem("allNotes")) || [];
}
function saveNote() {
  const title = document.getElementById("title").value.trim();
  const text = document.getElementById("text").value;

  if (!title) {
    alert("Please enter a title.");
    return;
  }

  let notes = getNotes();
  const editIndex = localStorage.getItem("editingNoteIndex");

  if (editIndex !== null) {
    // Update existing note
    notes[editIndex] = { title, text };
    localStorage.removeItem("editingNoteIndex");
  } else {
    // Add new note
    notes.push({ title, text });
  }

  localStorage.setItem("allNotes", JSON.stringify(notes));
  localStorage.setItem("title", title);
  localStorage.setItem("note", text);

  alert("Note saved!");
  renderSidebar();
}

function renderSidebar() {
  const notes = getNotes();
  const noteList = document.getElementById("noteList");
  noteList.innerHTML = "";

  notes.forEach((note, index) => {
    const li = document.createElement("li");
    li.classList.add("note-item");

    const titleSpan = document.createElement("span");
    titleSpan.textContent = note.title;
    titleSpan.classList.add("note-title");
    titleSpan.onclick = () => {
      document.getElementById("title").value = note.title;
      document.getElementById("text").value = note.text;
    };

    const iconContainer = document.createElement("div");
    iconContainer.classList.add("icon-container");

    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.title = "Edit";
    editBtn.onclick = (e) => {
      e.stopPropagation();
      document.getElementById("title").value = note.title;
      document.getElementById("text").value = note.text;
      localStorage.setItem("editingNoteIndex", index);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.title = "Delete";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm(`Delete "${note.title}"?`)) {
        notes.splice(index, 1);
        localStorage.setItem("allNotes", JSON.stringify(notes));
        renderSidebar();
      }
    };

    iconContainer.appendChild(editBtn);
    iconContainer.appendChild(deleteBtn);

    li.appendChild(titleSpan);
    li.appendChild(iconContainer);
    noteList.appendChild(li);
  });
}


window.onload = () => {
  // existing code...
  document.getElementById("title").value = localStorage.getItem("title") || "";
  document.getElementById("text").value = localStorage.getItem("note") || "";
  document.body.className = localStorage.getItem("theme") || "light";
  document.getElementById("toggleMode").checked = document.body.className === "dark";

  document.getElementById("toggleMode").addEventListener("change", function () {
    const mode = this.checked ? "dark" : "light";
    document.body.className = mode;
    localStorage.setItem("theme", mode);
  });

  renderSidebar(); // Show notes on load
};
