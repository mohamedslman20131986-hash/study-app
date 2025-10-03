// إظهار الأقسام
function showSection(id) {
  document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// 📝 الملاحظات
function addNote() {
  const input = document.getElementById("noteInput");
  if (input.value.trim() !== "") {
    const li = document.createElement("li");
    li.textContent = input.value;
    document.getElementById("notesList").appendChild(li);
    input.value = "";
    saveNotes();
  }
}
function saveNotes() {
  const notes = [];
  document.querySelectorAll("#notesList li").forEach(li => notes.push(li.textContent));
  localStorage.setItem("notes", JSON.stringify(notes));
}
function loadNotes() {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes.forEach(note => {
    const li = document.createElement("li");
    li.textContent = note;
    document.getElementById("notesList").appendChild(li);
  });
}
window.addEventListener("load", loadNotes);

// ⏳ المؤقت
let timer;
let timeLeft = 1500; // 25 دقيقة

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timerDisplay").textContent =
    `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        timer = null;
        alert("انتهى الوقت ⏳");
      }
    }, 1000);
  }
}
function pauseTimer() {
  clearInterval(timer);
  timer = null;
}
function resetTimer() {
  timeLeft = 1500;
  updateDisplay();
}
function changeTime(seconds) {
  timeLeft += seconds;
  if (timeLeft < 0) timeLeft = 0;
  updateDisplay();
}
updateDisplay();
