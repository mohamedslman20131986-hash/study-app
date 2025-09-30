// app.js
(() => {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const state = {subjects:[], tasks:[], flash:[], notes:[]};

  // UI elements
  const menuBtn = $('#menuBtn'), side = $('#side'), addBtn = $('#addBtn');
  const modal = $('#modal'), modalTitle = $('#modalTitle'), modalForm = $('#modalForm');
  const itemType = $('#itemType'), fields = $('#fields'), cancelModal = $('#cancelModal');
  const views = $$('.view');

  // counts
  const countSubjects = $('#countSubjects'), countTasks = $('#countTasks'), countFlash = $('#countFlash');
  const subjectsList = $('#subjectsList'), tasksList = $('#tasksList'), notesList = $('#notesList');
  const upcomingList = $('#upcomingList');

  // timer
  let timerInterval = null;
  let timerSeconds = 25*60;
  const timerDisplay = $('#timerDisplay'), startTimer = $('#startTimer'), pauseTimer = $('#pauseTimer'), resetTimer = $('#resetTimer');

  // flash
  const flashCard = $('#flashCard'), prevFlash = $('#prevFlash'), nextFlash = $('#nextFlash'), flipFlash = $('#flipFlash');
  let flashIndex = 0, flashShowingBack = false;

  // init
  async function init(){
    await STUDYDB.openDB();
    await loadAll();
    bindEvents();
    updateCounts();
    showView('dashboard');

    // register service worker
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('sw.js').catch(e=>console.warn('SW reg failed', e));
    }

    // request notification permission optionally
    if('Notification' in window && Notification.permission === 'default'){
      try { Notification.requestPermission(); } catch(e){}
    }
  }

  async function loadAll(){
    state.subjects = await STUDYDB.getAll('subjects') || [];
    state.tasks = await STUDYDB.getAll('tasks') || [];
    state.flash = await STUDYDB.getAll('flash') || [];
    state.notes = await STUDYDB.getAll('notes') || [];
    renderLists();
  }

  function bindEvents(){
    menuBtn.addEventListener('click', ()=> side.classList.toggle('hidden'));
    $$('.side li').forEach(li => li.addEventListener('click', e=>{
      const v = e.currentTarget.dataset.view;
      showView(v);
      $$('.side li').forEach(n=>n.classList.remove('active'));
      e.currentTarget.classList.add('active');
    }));

    addBtn.addEventListener('click', openAddModal);
    cancelModal.addEventListener('click', ()=> modal.classList.add('hidden'));
    modalForm.addEventListener('submit', onModalSubmit);
    if(itemType) itemType.addEventListener('change', renderFields);

    startTimer.addEventListener('click', startPomodoro);
    pauseTimer.addEventListener('click', pausePomodoro);
    resetTimer.addEventListener('click', ()=> { stopPomodoro(); timerSeconds = 25*60; updateTimerDisplay(); });

    prevFlash.addEventListener('click', ()=> { if(state.flash.length===0) return; flashIndex = (flashIndex-1+state.flash.length)%state.flash.length; flashShowingBack=false; renderFlash(); });
    nextFlash.addEventListener('click', ()=> { if(state.flash.length===0) return; flashIndex = (flashIndex+1)%state.flash.length; flashShowingBack=false; renderFlash(); });
    flipFlash.addEventListener('click', ()=> { flashShowingBack = !flashShowingBack; renderFlash(); });

    $('#exportData').addEventListener('click', exportData);
    $('#importData').addEventListener('click', ()=> $('#fileInput').click());
    $('#fileInput').addEventListener('change', importData);

    $('#saveNote').addEventListener('click', async ()=>{
      const text = $('#noteText').value.trim();
      if(!text) return alert('أدخل نص الملاحظة');
      const id = 'note-'+Date.now();
      const obj = {id, text, created: Date.now()};
      await STUDYDB.put('notes', obj);
      $('#noteText').value='';
      state.notes.push(obj);
      renderLists();
    });

    // search
    $('#searchSubjects').addEventListener('input', e=>{
      const q = e.target.value.trim().toLowerCase();
      renderSubjects(q);
    });
  }

  function showView(id){
    views.forEach(v => v.id === id ? v.classList.remove('hidden') : v.classList.add('hidden'));
    side.classList.add('hidden');
  }

  function renderFields(){
    const t = itemType.value;
    fields.innerHTML = '';
    if(t==='subject'){
      fields.innerHTML = `<label>اسم المادة <input name="title" required></label>
      <label>وصف <input name="desc"></label>`;
    } else if(t==='task'){
      fields.innerHTML = `<label>عنوان المهمة <input name="title" required></label>
      <label>مادة (اختياري) <input name="subject"></label>
      <label>موعد استحقاق <input name="due" type="datetime-local"></label>`;
    } else if(t==='flash'){
      fields.innerHTML = `<label>جانب السؤال <textarea name="front" required></textarea></label>
      <label>جانب الجواب <textarea name="back" required></textarea></label>`;
    } else if(t==='note'){
      fields.innerHTML = `<label>الملاحظة <textarea name="text" required></textarea></label>`;
    }
  }

  function openAddModal(){
    modalTitle.textContent = 'إضافة عنصر';
    renderFields();
    modal.classList.remove('hidden');
  }

  async function onModalSubmit(e){
    e.preventDefault();
    const form = new FormData(modalForm);
    // itemType inside the form may not be present in FormData; use select value fallback
    const type = form.get('itemType') || (itemType ? itemType.value : null);
    // Some browsers don't include select value in FormData if no name; ensure select has name
    const selectedType = type || (modalForm.querySelector('#itemType') ? modalForm.querySelector('#itemType').value : null);

    if(selectedType==='subject'){
      const title = form.get('title') || '';
      const desc = form.get('desc') || '';
      const id='sub-'+Date.now();
      const obj = {id, title, desc};
      await STUDYDB.put('subjects', obj);
      state.subjects.push(obj);
    } else if(selectedType==='task'){
      const id='task-'+Date.now();
      const obj = {id, title: form.get('title')||'بدون عنوان', subject: form.get('subject')||null, due: form.get('due')||null, done:false};
      await STUDYDB.put('tasks', obj);
      state.tasks.push(obj);
    } else if(selectedType==='flash'){
      const id='flash-'+Date.now();
      const obj = {id, front: form.get('front')||'', back: form.get('back')||''};
      await STUDYDB.put('flash', obj);
      state.flash.push(obj);
    } else if(selectedType==='note'){
      const id='note-'+Date.now();
      const obj = {id, text: form.get('text')||'', created: Date.now()};
      await STUDYDB.put('notes', obj);
      state.notes.push(obj);
    }
    modal.classList.add('hidden');
    renderLists();
    updateCounts();
    modalForm.reset();
  }

  function renderLists(){
    renderSubjects();
    renderTasks();
    renderNotes();
    renderUpcoming();
    renderFlash();
    updateCounts();
  }

  function renderSubjects(q=''){
    subjectsList.innerHTML = '';
    const items = state.subjects.filter(s=>s.title.toLowerCase().includes((q||'').toLowerCase()));
    if(!items.length) subjectsList.innerHTML = '<li>لا توجد مواد بعد</li>';
    items.forEach(s=>{
      const li = document.createElement('li');
      li.innerHTML = `<strong>${escapeHtml(s.title)}</strong><div class="muted">${escapeHtml(s.desc||'')}</div>`;
      subjectsList.appendChild(li);
    });
  }

  function renderTasks(){
    tasksList.innerHTML = '';
    if(!state.tasks.length) tasksList.innerHTML = '<li>لا مهام بعد</li>';
    state.tasks.forEach(t=>{
      const li = document.createElement('li');
      const due = t.due ? new Date(t.due).toLocaleString() : 'بدون موعد';
      li.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div><strong>${escapeHtml(t.title)}</strong></div>
          <div style="font-size:13px;color:var(--muted)">${escapeHtml(t.subject||'')} • ${escapeHtml(due)}</div>
        </div>
        <div>
          <button class="doneBtn" data-id="${t.id}">${t.done? '✓':'○'}</button>
          <button class="delBtn" data-id="${t.id}">حذف</button>
        </div>
      </div>`;
      tasksList.appendChild(li);
    });

    $$('.doneBtn').forEach(b => b.addEventListener('click', async (e)=>{
      const id = e.currentTarget.dataset.id;
      const t = state.tasks.find(x=>x.id===id);
      if(!t) return;
      t.done = !t.done;
      await STUDYDB.put('tasks', t);
      renderLists();
    }));
    $$('.delBtn').forEach(b => b.addEventListener('click', async (e)=>{
      const id = e.currentTarget.dataset.id;
      await STUDYDB.del('tasks', id);
      state.tasks = state.tasks.filter(x=>x.id!==id);
      renderLists();
    }));
  }

  function renderNotes(){
    notesList.innerHTML = '';
    if(!state.notes.length) notesList.innerHTML = '<li>لا ملاحظات</li>';
    state.notes.forEach(n=>{
      const li = document.createElement('li');
      li.innerHTML = `<div>
        <div style="font-size:14px">${escapeHtml(n.text)}</div>
        <div style="font-size:12px;color:var(--muted)">${new Date(n.created).toLocaleString()}</div>
      </div>
      <div><button class="delNote" data-id="${n.id}">حذف</button></div>`;
      notesList.appendChild(li);
    });
    $$('.delNote').forEach(b=> b.addEventListener('click', async e=>{
      const id = e.currentTarget.dataset.id;
      await STUDYDB.del('notes', id);
      state.notes = state.notes.filter(x=>x.id!==id);
      renderLists();
    }));
  }

  function renderUpcoming(){
    upcomingList.innerHTML = '';
    const upcoming = state.tasks.filter(t=>t.due).sort((a,b)=> new Date(a.due)-new Date(b.due)).slice(0,5);
    if(!upcoming.length) upcomingList.innerHTML = '<li>لا مهام قريبة</li>';
    upcoming.forEach(t=>{
      const li = document.createElement('li');
      li.textContent = `${t.title} — ${new Date(t.due).toLocaleString()}`;
      upcomingList.appendChild(li);
    });
  }

  function renderFlash(){
    if(!state.flash.length){
      flashCard.textContent = 'أضف بطاقة للبدء';
      return;
    }
    if(flashIndex >= state.flash.length) flashIndex = 0;
    const card = state.flash[flashIndex];
    flashCard.textContent = flashShowingBack ? card.back : card.front;
  }

  function updateCounts(){
    countSubjects.textContent = state.subjects.length;
    countTasks.textContent = state.tasks.length;
    countFlash.textContent = state.flash.length;
  }

  // timer logic
  function updateTimerDisplay(){
    const m = Math.floor(timerSeconds/60).toString().padStart(2,'0');
    const s = (timerSeconds%60).toString().padStart(2,'0');
    timerDisplay.textContent = `${m}:${s}`;
  }
  function startPomodoro(){
    if(timerInterval) return;
    timerInterval = setInterval(()=>{
      if(timerSeconds<=0){ stopPomodoro(); notifyFinish(); return; }
      timerSeconds--; updateTimerDisplay();
    }, 1000);
  }
  function pausePomodoro(){ stopPomodoro(); }
  function stopPomodoro(){ clearInterval(timerInterval); timerInterval = null; }

  function notifyFinish(){
    try {
      if('Notification' in window && Notification.permission === 'granted'){
        new Notification('StudyBuddy', { body: 'انتهى وقت الجلسة.' });
      } else {
        alert('انتهى وقت الجلسة.');
      }
    } catch(e){ alert('انتهى وقت الجلسة.'); }
  }

  // import/export
  async function exportData(){
    const payload = {
      subjects: await STUDYDB.getAll('subjects'),
      tasks: await STUDYDB.getAll('tasks'),
     
