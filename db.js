const STUDYDB = (() => {
  const dbName = 'studybuddyDB';
  const version = 1;
  let db;

  function openDB(){
    return new Promise((resolve, reject)=>{
      const req = indexedDB.open(dbName, version);
      req.onupgradeneeded = e => {
        db = e.target.result;
        if(!db.objectStoreNames.contains('subjects')) db.createObjectStore('subjects', {keyPath:'id'});
        if(!db.objectStoreNames.contains('tasks')) db.createObjectStore('tasks', {keyPath:'id'});
        if(!db.objectStoreNames.contains('flash')) db.createObjectStore('flash', {keyPath:'id'});
        if(!db.objectStoreNames.contains('notes')) db.createObjectStore('notes', {keyPath:'id'});
      };
      req.onsuccess = e=>{ db = e.target.result; resolve(); };
      req.onerror = e=> reject(e);
    });
  }

  function tx(store, mode='readonly'){ return db.transaction(store, mode).objectStore(store); }

  function getAll(store){
    return new Promise((resolve, reject)=>{
      const r = tx(store).getAll();
      r.onsuccess = ()=> resolve(r.result||[]);
      r.onerror = reject;
    });
  }

  function put(store, val){
    return new Promise((resolve,reject)=>{
      const r = tx(store, 'readwrite').put(val);
      r.onsuccess=()=>resolve(val);
      r.onerror=reject;
    });
  }

  function del(store, key){
    return new Promise((resolve,reject)=>{
      const r = tx(store, 'readwrite').delete(key);
      r.onsuccess=()=>resolve();
      r.onerror=reject;
    });
  }

  return {openDB, getAll, put, del};
})();
