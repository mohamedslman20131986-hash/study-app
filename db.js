// حفظ الملاحظات في LocalStorage
function saveNotes(){
  const notes = [];
  document.querySelectorAll("#notesList li").forEach(li => notes.push(li.textContent));
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes(){
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes.forEach(note => {
    const li = document.createElement("li");
    li.textContent = note;
    document.getElementById("notesList").appendChild(li);
  });
}

window.addEventListener("beforeunload", saveNotes);
window.addEventListener("load", loadNotes);