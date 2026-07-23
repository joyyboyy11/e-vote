// Remplacez les valeurs ci‑dessous par celles de votre projet Firebase.
// Pour obtenir ces valeurs : Firebase Console → Paramètres du projet → Vos applications → Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2PuD3XApUPx0mXeGlvsSJkOqMxXA850w",
  authDomain: "e-vote-5889f.firebaseapp.com",
  projectId: "e-vote-5889f",
  storageBucket: "e-vote-5889f.firebasestorage.app",
  messagingSenderId: "1068020593570",
  appId: "1:1068020593570:web:0a71f245823007fcf7b8fb",
  measurementId: "G-BZD56CVWBE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };