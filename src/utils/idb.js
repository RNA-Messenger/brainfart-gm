// tiny IndexedDB wrapper (no deps)
const DB_NAME = "gm-tracker";
const DB_VERSION = 1;
let _dbPromise = null;

function openDB() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("state")) db.createObjectStore("state");
      if (!db.objectStoreNames.contains("blobs")) db.createObjectStore("blobs");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return _dbPromise;
}

async function idbGet(store, key) {
  const t = (await openDB()).transaction(store, "readonly");
  return new Promise((res, rej) => {
    const req = t.objectStore(store).get(key);
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}
async function idbSet(store, key, value) {
  const t = (await openDB()).transaction(store, "readwrite");
  return new Promise((res, rej) => {
    const req = t.objectStore(store).put(value, key);
    req.onsuccess = () => res(true);
    req.onerror = () => rej(req.error);
  });
}
async function idbDelete(store, key) {
  const t = (await openDB()).transaction(store, "readwrite");
  return new Promise((res, rej) => {
    const req = t.objectStore(store).delete(key);
    req.onsuccess = () => res(true);
    req.onerror = () => rej(req.error);
  });
}

export async function loadState(){ return await idbGet("state","app"); }
export async function saveState(s){ return await idbSet("state","app", s); }

export async function putBlob(key, blob){ return await idbSet("blobs", key, blob); }
export async function getBlob(key){ return await idbGet("blobs", key); }
export async function deleteBlob(key){ return await idbDelete("blobs", key); }
