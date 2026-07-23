import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const authSection = document.getElementById('authSection');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const authMessage = document.getElementById('authMessage');
const signOutBtn = document.getElementById('signOutBtn');
const votersList = document.getElementById('votersList');
const searchInput = document.getElementById('searchInput');

let unsubscribeVoters = null;
let currentVoters = [];

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authMessage.textContent = '';
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    authMessage.textContent = 'Échec connexion : vérifiez vos identifiants.';
  }
});

signOutBtn.addEventListener('click', async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Vérifier si l'utilisateur est admin (doc en collection 'admins' avec id = uid)
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    if (!adminDoc.exists()) {
      authMessage.textContent = "Accès administrateur non autorisé.";
      await signOut(auth);
      return;
    }
    // afficher dashboard
    authSection.classList.add('hidden');
    dashboard.classList.remove('hidden');
    startVotersListener();
  } else {
    // afficher formulaire de connexion
    authSection.classList.remove('hidden');
    dashboard.classList.add('hidden');
    stopVotersListener();
  }
});

function renderVoters(vs) {
  currentVoters = vs;
  const q = searchInput.value.trim().toLowerCase();
  const filtered = q ? vs.filter(v => {
    return (
      (v.firstName && v.firstName.toLowerCase().includes(q)) ||
      (v.lastName && v.lastName.toLowerCase().includes(q)) ||
      (v.email && v.email.toLowerCase().includes(q)) ||
      (v.nid && v.nid.toLowerCase().includes(q))
    );
  }) : vs;

  const rows = [];
  rows.push(`<div class="row header"><div class="cell">Nom</div><div class="cell">Email</div><div class="cell">NID</div><div class="cell">Inscrit le</div><div class="cell">Statut</div><div class="cell actions">Actions</div></div>`);

  for (const v of filtered) {
    const date = v.createdAt ? new Date(v.createdAt.seconds * 1000).toLocaleString() : '-';
    const status = v.verified ? `<span class="tag verified">Vérifié</span>` : `<span class="tag pending">En attente</span>`;
    rows.push(`<div class="row"><div class="cell">${escapeHtml(v.firstName)} ${escapeHtml(v.lastName)}</div><div class="cell">${escapeHtml(v.email)}</div><div class="cell">${escapeHtml(v.nid)}</div><div class="cell">${date}</div><div class="cell">${status}</div><div class="cell actions">
      <button data-id="${v.id}" class="btn-verify">${v.verified ? 'Annuler vérif.' : 'Vérifier'}</button>
      <button data-id="${v.id}" class="btn-delete" style="background:var(--danger);">Supprimer</button>
    </div></div>`);
  }

  votersList.innerHTML = rows.join('');
  // attach events
  votersList.querySelectorAll('.btn-verify').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      await toggleVerify(id);
    });
  });
  votersList.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      if (confirm('Supprimer cet enregistrement ?')) {
        await deleteDoc(doc(db, 'voters', id));
      }
    });
  });
}

searchInput.addEventListener('input', () => renderVoters(currentVoters));

function startVotersListener() {
  const votersRef = collection(db, 'voters');
  const q = query(votersRef, orderBy('createdAt', 'desc'));
  unsubscribeVoters = onSnapshot(q, (snapshot) => {
    const vs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderVoters(vs);
  }, (err) => {
    console.error('Erreur écoute voters', err);
  });
}

function stopVotersListener() {
  if (unsubscribeVoters) unsubscribeVoters();
  unsubscribeVoters = null;
  votersList.innerHTML = '';
}

async function toggleVerify(id) {
  const r = currentVoters.find(v => v.id === id);
  if (!r) return;
  const ref = doc(db, 'voters', id);
  await updateDoc(ref, { verified: !r.verified });
}

function escapeHtml(s){ if (!s) return ''; return s.replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]); }