
// Only the browser-facing Firebase configuration belongs here.
const config = null;
const ownerUid = '';
const usernameDomain = '@lernflow.example';
const sdkBase = 'https://www.gstatic.com/firebasejs/13.2.0/';
const kinds = ['subjects', 'sessions'];

function toRecords(data) {
  const records = new Map();
  for (const kind of kinds) {
    for (const item of data[kind]) {
      records.set(kind + ':' + encodeURIComponent(item.id), {
        kind, id: item.id, payload: JSON.stringify(item)
      });
    }
  }
  return records;
}

function fromRecords(defaults, records) {
  const result = { subjects: new Map(defaults.subjects.map(s => [s.id, s])), sessions: new Map() };
  for (const record of records.values()) {
    if (!kinds.includes(record.kind)) continue;
    if (record.payload === null) {
      result[record.kind].delete(record.id);
    } else {
      const item = JSON.parse(record.payload);
      if (item.id === record.id) result[record.kind].set(record.id, item);
    }
  }
  return { subjects: [...result.subjects.values()], sessions: [...result.sessions.values()] };
}

function recordChanges(previous, next) {
  const changes = new Map();
  for (const [key, record] of next) {
    if (record.payload !== previous.get(key)?.payload) changes.set(key, record);
  }
  for (const [key, record] of previous) {
    if (!next.has(key)) changes.set(key, { ...record, payload: null });
  }
  return changes;
}

function createSync({ getData, applyData, defaults, normalize }) {
  let sdk, authSdk, auth, db, local, account, unsubscribe, latest;
  let ready = false;
  let busy = false;
  let writes = 0;
  let pending = new Map();
  let status = 'Melde dich auf deinen Geräten mit denselben Lernflow-Zugangsdaten an.';

  function paint() {
    const panel = document.querySelector('#cloud-sync');
    if (!panel) return;
    panel.hidden = false;
    const info = panel.querySelector('[data-status]');
    info.textContent = config && ownerUid ? status : 'Die Online-Synchronisierung ist noch nicht eingerichtet.';
    const form = panel.querySelector('form');
    form.hidden = !config || !ownerUid || !!account;
    form.querySelector('button').disabled = busy;
    form.onsubmit = event => {
      event.preventDefault();
      const username = form.elements.username.value.trim().toLowerCase();
      const password = form.elements.password.value;
      form.elements.password.value = '';
      run('login', username, password);
    };
    for (const button of panel.querySelectorAll('[data-sync]')) {
      const action = button.dataset.sync;
      button.hidden = !config || !ownerUid || !account;
      button.disabled = busy || (action === 'logout' && writes > 0) || (action === 'transfer' && (!ready || writes > 0 || !local?.sessions.length));
      button.onclick = () => run(action);
    }
  }

  function setStatus(message) {
    status = message;
    paint();
  }

  async function start() {
    if (!config || !ownerUid) return;
    try {
      const [appSdk, authModule, firestore] = await Promise.all([
        import(sdkBase + 'firebase-app.js'),
        import(sdkBase + 'firebase-auth.js'),
        import(sdkBase + 'firebase-firestore.js')
      ]);
      authSdk = authModule;
      sdk = firestore;
      const app = appSdk.initializeApp(config);
      auth = authSdk.getAuth(app);
      db = sdk.initializeFirestore(app, {
        localCache: sdk.persistentLocalCache({ tabManager: sdk.persistentMultipleTabManager() })
      });
      authSdk.onAuthStateChanged(auth, openAccount, showError);
    } catch (error) {
      showError(error);
    }
  }

  function collection(user) {
    return sdk.collection(db, 'users', user.uid, 'records');
  }

  function openAccount(user) {
    unsubscribe?.();
    ready = false;
    writes = 0;
    pending = new Map();
    if (account && local) applyData(local);
    local = undefined;
    account = user;
    if (user && user.uid !== ownerUid) {
      account = null;
      authSdk.signOut(auth).catch(showError);
      return;
    }
    if (!user) {
      setStatus('Melde dich auf deinen Geräten mit denselben Lernflow-Zugangsdaten an.');
      return;
    }
    local = getData();
    latest = toRecords(defaults);
    applyData(fromRecords(defaults, new Map()));
    setStatus('Deine Lerneinheiten werden geladen …');
    unsubscribe = sdk.onSnapshot(collection(user), { includeMetadataChanges: true }, snapshot => {
      if (account !== user) return;
      try {
        const records = new Map(snapshot.docs.map(doc => [doc.id, doc.data()]));
        if (!snapshot.metadata.fromCache) ready = true;
        for (const [key, record] of pending) records.set(key, record);
        const data = fromRecords(defaults, records);
        // Compare with the displayed data before applying remote changes.
        // Keep the pre-migration values as the baseline for the next write.
        latest = toRecords(data);
        for (const session of data.sessions) session.activity = normalize(session.activity);
        if (JSON.stringify(getData()) !== JSON.stringify(data)) applyData(data);
        setStatus(snapshot.metadata.hasPendingWrites || writes
          ? 'Änderungen warten auf Synchronisierung.'
          : snapshot.metadata.fromCache
            ? 'Offline-Ansicht. Änderungen werden bei Verbindung synchronisiert.'
            : 'Synchronisiert als ' + user.email.split('@')[0] + '.');
      } catch (error) {
        showError(error);
      }
    }, showError);
  }

  function showError(error) {
    console.error('Lernflow sync', error);
    setStatus('Synchronisierung fehlgeschlagen. Prüfe die Verbindung und die Firebase-Einrichtung.');
  }

  async function run(action, username, password) {
    if (busy) return;
    if (!auth) {
      setStatus('Die Anmeldung wird noch geladen. Bitte versuche es erneut.');
      return;
    }
    const user = account;
    busy = true;
    paint();
    try {
      if (action === 'login') {
        if (!/^[a-z0-9][a-z0-9_-]{0,31}$/.test(username)) {
          setStatus('Bitte gib deinen Lernflow-Benutzernamen ein.');
          return;
        }
        const credential = await authSdk.signInWithEmailAndPassword(auth, username + usernameDomain, password);
        if (credential.user.uid !== ownerUid) {
          await authSdk.signOut(auth);
          setStatus('Dieses Konto hat keinen Zugriff auf Lernflow.');
        }
      } else if (action === 'logout') {
        await authSdk.signOut(auth);
      } else if (action === 'transfer' && user && ready && local) {
        const source = [...toRecords(local)];
        const target = collection(user);
        for (let offset = 0; offset < source.length; offset += 100) {
          if (account !== user) break;
          const entries = source.slice(offset, offset + 100);
          await sdk.runTransaction(db, async transaction => {
            const refs = entries.map(([key]) => sdk.doc(target, key));
            const existing = await Promise.all(refs.map(ref => transaction.get(ref)));
            existing.forEach((doc, index) => {
              if (!doc.exists()) transaction.set(refs[index], entries[index][1]);
            });
          });
        }
        setStatus('Lokale Lerneinheiten wurden übernommen.');
      }
    } catch (error) {
      if (action === 'login' && error.code !== 'auth/network-request-failed') {
        setStatus('Anmeldung fehlgeschlagen. Prüfe Benutzername und Passwort.');
      } else {
        showError(error);
      }
    } finally {
      busy = false;
      paint();
    }
  }

  function capture(data) {
    if (!account) return data;
    const user = account;
    const next = toRecords(data);
    const changes = [...recordChanges(latest, next)];
    latest = next;
    for (let offset = 0; offset < changes.length; offset += 100) {
      const batch = sdk.writeBatch(db);
      const chunk = changes.slice(offset, offset + 100);
      for (const [key, record] of chunk) {
        pending.set(key, record);
        batch.set(sdk.doc(collection(user), key), record);
      }
      writes++;
      setStatus('Änderungen warten auf Synchronisierung.');
      batch.commit().then(() => {
        if (account !== user) return;
        writes--;
        for (const [key, record] of chunk) {
          if (pending.get(key) === record) pending.delete(key);
        }
        if (!writes) setStatus('Synchronisiert als ' + user.email.split('@')[0] + '.');
      }, error => {
        if (account !== user) return;
        writes--;
        showError(error);
      });
    }
    return local;
  }

  return { start, paint, capture };
}

export { createSync, toRecords, fromRecords, recordChanges };
