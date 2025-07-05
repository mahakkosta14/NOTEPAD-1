
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

  const saved = localStorage.getItem('autosavedNote');
  if (saved) noteArea.innerHTML = saved;

  renderSidebar();
};

// Save note to local storage
function saveNote() {
  const title = document.getElementById("title").innerHTML;
  const note = document.getElementById("text").innerHTML;

  localStorage.setItem("title", title);
  localStorage.setItem("note", note);

  alert("Note saved to local storage.");
}

// Download note as text file
function downloadNote() {
  const title = document.getElementById("title").innerHTML.trim() || "note";
  const note = document.getElementById("text").innerHTML;

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
    document.getElementById("title").innerHTML = "";
    document.getElementById("text").innerHTML = "";

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
    document.getElementById("title").innerHTML = "";
    document.getElementById("text").innerHTML = "";
    localStorage.removeItem("title");
    localStorage.removeItem("note");
  }
}

//adding a side bar 

function getNotes() {
  return JSON.parse(localStorage.getItem("allNotes")) || [];
}
function saveNote() {
  const title = document.getElementById("title").innerHTML.trim();
  const text = document.getElementById("text").innerHTML;

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
      document.getElementById("title").innerHTML = note.title;
      document.getElementById("text").innerHTML = note.text;
    };

    const iconContainer = document.createElement("div");
    iconContainer.classList.add("icon-container");

    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.title = "Edit";
    editBtn.onclick = (e) => {
      e.stopPropagation();
      document.getElementById("title").innerHTML = note.title;
      document.getElementById("text").innerHTML = note.text;
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
function format(command, buttonElement) {
  document.execCommand(command);
  buttonElement.classList.toggle("active");

  // Refocus the editor to apply formatting
  document.getElementById("text").focus();
}

function formatColor(color) {
  document.execCommand("foreColor", false, color);
  document.getElementById("text").focus();
}

function formatFont(font) {
  document.execCommand("fontName", false, font);
  document.getElementById("text").focus();
}

function formatSize(size) {
  document.execCommand("fontSize", false, size);
  document.getElementById("text").focus();
}

function setAlignment(command, buttonElement) {
  document.execCommand(command);
  document.querySelectorAll('.align-btn').forEach(btn => btn.classList.remove('active'));
  buttonElement.classList.add('active');
  document.getElementById("text").focus();
}
// function format(command, buttonElement) {
//   document.execCommand(command);

//   // Toggle button appearance
//   buttonElement.classList.toggle("active");
// }

// function formatColor(color) {
//   document.execCommand("foreColor", false, color);
// }

// function formatFont(font) {
//   document.execCommand("fontName", false, font);
// }

// function formatSize(size) {
//   document.execCommand("fontSize", false, size);
// }

function setAlignment(command, buttonElement) {
  document.execCommand(command);

  // Remove 'active' from all alignment buttons
  document.querySelectorAll('.align-btn').forEach(btn => btn.classList.remove('active'));

  // Add 'active' to the clicked one
  buttonElement.classList.add('active');
}
//searchbar
function searchNotes(query) {
  const items = document.querySelectorAll('.note-item');
  items.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(query.toLowerCase()) ? 'flex' : 'none';
  });
}
function toggleSearch() {
  const input = document.getElementById("searchBar");
  input.classList.toggle("show");
  if (input.classList.contains("show")) {
    input.focus(); // Optional: put cursor in the search bar
  }
}

//pin
function pinNote(index) {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  const pinned = notes.splice(index, 1)[0];
  notes.unshift(pinned);
  localStorage.setItem('notes', JSON.stringify(notes));
  renderNotes();
}
//undo
document.execCommand('undo'); // use with toolbar button
document.execCommand('redo');
//autosave
const noteArea = document.getElementById('text');
noteArea.addEventListener('input', () => {
  localStorage.setItem('autosavedNote', noteArea.innerHTML);
});





