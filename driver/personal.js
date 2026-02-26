// ================= FIREBASE =================
import { db } from "../firebase.js";

import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ================= ELEMENTS =================
const aimagSelect = document.getElementById("aimag");
const sumSelect   = document.getElementById("sum");
const horooSelect = document.getElementById("horoo");

// ================= LOAD AIMAGS =================
async function loadAimags() {
  aimagSelect.innerHTML = `<option value="">Аймаг</option>`;
  sumSelect.innerHTML   = `<option value="">Сум, Дүүрэг</option>`;
  horooSelect.innerHTML = `<option value="">Баг, Хороо</option>`;

  const q = query(
    collection(db, "aimags"),
    orderBy("name")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();
    if (!data.name) return;

    const opt = document.createElement("option");
    opt.value = doc.id;          // 🔑 aimag document ID
    opt.textContent = data.name;
    aimagSelect.appendChild(opt);
  });
}

// ================= LOAD SUMS =================
async function loadSums(aimagId) {
  sumSelect.innerHTML   = `<option value="">Сум, Дүүрэг</option>`;
  horooSelect.innerHTML = `<option value="">Баг, Хороо</option>`;

  if (!aimagId) return;

  const q = query(
    collection(db, "sums"),
    where("aimagId", "==", aimagId)
  );

  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();
    if (!data.name) return;

    const opt = document.createElement("option");
    opt.value = doc.id;          // 🔑 sum document ID
    opt.textContent = data.name;
    sumSelect.appendChild(opt);
  });
}

// ================= LOAD HOROOS =================
async function loadHoroos(sumId) {
  horooSelect.innerHTML = `<option value="">Баг, Хороо</option>`;
  if (!sumId) return;

  const q = query(
    collection(db, "horoos"),
    where("sumId", "==", sumId)
  );

  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();
    if (!data.name) return;

    const opt = document.createElement("option");
    opt.value = doc.id;          // 🔑 horoo document ID
    opt.textContent = data.name;
    horooSelect.appendChild(opt);
  });
}

// ================= EVENTS =================
aimagSelect.addEventListener("change", e => {
  loadSums(e.target.value);
});

sumSelect.addEventListener("change", e => {
  loadHoroos(e.target.value);
});

// ================= SAVE =================
window.saveCar = async function () {
  const plateNumber = document.getElementById("plateNumber").value.trim();
  const street      = document.getElementById("street").value.trim();
  const bankAccount = document.getElementById("bankAccount").value.trim();

  const aimagId = aimagSelect.value;
  const sumId   = sumSelect.value;
  const horooId = horooSelect.value;

  if (!plateNumber || !aimagId || !sumId || !horooId) {
    alert("Бүх заавал бөглөх талбарыг гүйцэд бөглөнө үү!");
    return;
  }

  try {
    await addDoc(collection(db, "cars"), {
      plateNumber,
      aimagId,
      sumId,
      horooId,
      street,
      bankAccount,
      createdAt: serverTimestamp()
    });

    alert("Амжилттай хадгалагдлаа ✅");

    // form reset
    document.getElementById("plateNumber").value = "";
    document.getElementById("street").value = "";
    document.getElementById("bankAccount").value = "";
    aimagSelect.value = "";
    sumSelect.innerHTML   = `<option value="">Сум, Дүүрэг</option>`;
    horooSelect.innerHTML = `<option value="">Баг, Хороо</option>`;

  } catch (err) {
    console.error(err);
    alert("Алдаа гарлаа ❌");
  }
};

// ================= INIT =================
loadAimags();
