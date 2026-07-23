import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const form = document.getElementById('registerForm');
const message = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const stubNumber = document.getElementById('stubNumber');
const regStamp = document.getElementById('regStamp');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  message.textContent = '';
  submitBtn.disabled = true;
  submitBtn.textContent = "Envoi...";

  const firstName = form.firstName.value.trim();
  const lastName = form.lastName.value.trim();
  const email = form.email.value.trim();
  const nid = form.nid.value.trim();

  if (!firstName || !lastName || !email || !nid) {
    message.textContent = 'Veuillez remplir tous les champs.';
    submitBtn.disabled = false;
    submitBtn.textContent = "S'inscrire";
    return;
  }

  try {
    const votersRef = collection(db, 'voters');
    const ref = await addDoc(votersRef, {
      firstName,
      lastName,
      email,
      nid,
      verified: false,
      createdAt: serverTimestamp()
    });
    message.textContent = "Inscription enregistrée. Merci !";
    if (stubNumber) stubNumber.textContent = ref.id.slice(-6).toUpperCase();
    if (regStamp) regStamp.classList.add('stamped');
    form.reset();
  } catch (err) {
    console.error(err);
    message.textContent = "Une erreur est survenue. Réessayez plus tard.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "S'inscrire";
  }
});