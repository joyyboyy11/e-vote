// Remplacez les valeurs ci‑dessous par celles de votre projet Firebase.
// Pour obtenir ces valeurs : Firebase Console → Paramètres du projet → Vos applications → Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmXH6GfkqsN8gTt0heNGpTRNp1e_uaQNU",
  authDomain: "nbapple-3f0ce.firebaseapp.com",
  projectId: "nbapple-3f0ce",
  storageBucket: "nbapple-3f0ce.firebasestorage.app",
  messagingSenderId: "401275393539",
  appId: "1:401275393539:web:4a9791abbaf7faffc32036",
  measurementId: "G-TXSWB47DM4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
