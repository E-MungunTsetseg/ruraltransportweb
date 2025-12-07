import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj0scQQ_Y2jSF_6bb1hfrRsMzTIju18wQ",
  authDomain: "myweb-73a96.firebaseapp.com",
  projectId: "myweb-73a96",
  storageBucket: "myweb-73a96.firebasestorage.app",
  messagingSenderId: "760684186396",
  appId: "1:760684186396:web:f8a19a4225fa67acd648d9",
  measurementId: "G-NKZ4GQLZJG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
