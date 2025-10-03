let db;
const request = indexedDB.open("mohamedSlmanDB", 1);

request.onupgradeneeded = function(e) {
  db = e.target.result;
  if (!db.objectStoreNames.contains("notes")) {
    db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
  }
};

request.onsuccess = function(e) {
  db = e.target.result;
  loadNotes();
};

function saveNote(text) {
  const tx = db.transaction("notes", "readwrite");
  tx.objectStore("notes").add({ text });
}

function loadNotes() {
  const tx = db.transaction("notes", "readonly");
  const store = tx.objectStore("notes");
  const req = store.getAll();
  req.onsuccess = () => {
    const notesList = document.getElementById("notesList");
    notesList.innerHTML = "";
    req.result.forEach(note => {
      const div = document.createElement("div");
      div.className = "note";
      div.textContent = note.text;
      notesList.appendChild(div);
    });
  };
}

function addNote() {
  const text = document.getElementById("noteInput").value.trim();
  if (!text) return;
  saveNote(text);
  loadNotes();
  document.getElementById("noteInput").value = "";
}
