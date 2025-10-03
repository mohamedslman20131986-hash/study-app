// التنقل بين الأقسام
function showSection(id){
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// الملاحظات
function addNote(){
  const text = document.getElementById("noteInput").value.trim();
  if(!text) return;
  const li = document.createElement("li");
  li.textContent = text;
  document.getElementById("notesList").appendChild(li);
  document.getElementById("noteInput").value="";
}

// المؤقت
let timerSeconds = 25*60;
let timerInterval = null;

function updateDisplay(){
  const m = String(Math.floor(timerSeconds/60)).padStart(2,'0');
  const s = String(timerSeconds%60).padStart(2,'0');
  document.getElementById("timerDisplay").textContent = `${m}:${s}`;
}

function startTimer(){
  if(timerInterval) return;
  timerInterval = setInterval(()=>{
    if(timerSeconds>0){
      timerSeconds--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval=null;
      alert("⏰ انتهى الوقت!");
    }
  },1000);
}

function pauseTimer(){
  clearInterval(timerInterval);
  timerInterval=null;
}

function resetTimer(){
  pauseTimer();
  timerSeconds = 25*60;
  updateDisplay();
}

function changeTime(sec){
  timerSeconds = Math.max(0, timerSeconds+sec);
  updateDisplay();
}

updateDisplay();
