// db.js - IndexedDB wrapper for StudyBuddy
const STUDYDB = (() => {
  const dbName = 'studybuddyDB';
  const version = 1;
  let db;

  // فتح قاعدة البيانات
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, version);

      req.onupgradeneeded = e => {
        db = e.target.result;

        // إنشاء الجداول إذا ما موجودة
        if (!db.objectStoreNames.contains('subjects'))
          db.createObjectStore('subjects', { keyPath: 'id', autoIncrement: true });
        if (!db.objectStoreNames.contains('tasks'))
          db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
        if (!db.objectStoreNames.contains('flash'))
          db.createObjectStore('flash', { keyPath: 'id', autoIncrement: true });
        if (!db.objectStoreNames.contains('notes'))
          db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
      };

      req.onsuccess = e => {
        db = e.target.result;
        resolve(db);
      };

      req.onerror = e => reject(e.target.error);
    });
  }

  // معاملة (Transaction)
  function tx(store, mode = 'readonly') {
    return db.transaction(store, mode).objectStore(store);
  }

  // جلب كل البيانات
  function getAll(store) {
    return new Promise((resolve, reject) => {
      const r = tx(store).getAll();
      r.onsuccess = () => resolve(r.result || []);
      r.onerror = e => reject(e.target.error);
    });
  }

  // إضافة أو تحديث
  function put(store, val) {
    return new Promise((resolve, reject) => {
      const r = tx(store, 'readwrite').put(val);
      r.onsuccess = () => resolve(val);
      r.onerror = e => reject(e.target.error);
    });
  }

  // حذف عنصر
  function del(store, key) {
    return new Promise((resolve, reject) => {
      const r = tx(store, 'readwrite').delete(key);
      r.onsuccess = () => resolve();
      r.onerror = e => reject(e.target.error);
    });
  }

  return { openDB, getAll, put, del };
})();
