// ================= FIREBASE =================
import { auth, db } from "../firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

console.log("✅ car.js ачааллаа");

// ===============================
// 🔽 SELECT-ҮҮДИЙГ FIRESTORE-ООС УНШИХ
// ===============================

// 🟣 Брэнд ачаалах
async function loadBrands() {
  const brandSelect = document.getElementById("brand");
  if (!brandSelect) return;

  brandSelect.innerHTML = `<option value="">Брэнд</option>`;

  const snapshot = await getDocs(collection(db, "brands"));
  snapshot.forEach(doc => {
    const data = doc.data();
    const option = document.createElement("option");
    option.value = data.name;
    option.textContent = data.name;
    brandSelect.appendChild(option);
  });
}

// 🟣 Загвар (брэндээс хамаарна)
async function loadModelsByBrand(brandName) {
  const modelSelect = document.getElementById("model");
  if (!modelSelect) return;

  modelSelect.innerHTML = `<option value="">Машины загвар</option>`;
  if (!brandName) return;

  const snapshot = await getDocs(collection(db, "models"));
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.brand === brandName) {
      const option = document.createElement("option");
      option.value = data.name;
      option.textContent = data.name;
      modelSelect.appendChild(option);
    }
  });
}

// 🟣 Өнгө ачаалах
async function loadColors() {
  const colorSelect = document.getElementById("color");
  if (!colorSelect) return;

  colorSelect.innerHTML = `<option value="">Машины өнгө</option>`;

  const snapshot = await getDocs(collection(db, "color"));
  snapshot.forEach(doc => {
    const data = doc.data();
    const option = document.createElement("option");
    option.value = data.name;
    option.textContent = data.name;
    colorSelect.appendChild(option);
  });
}

// 🟣 Брэнд солигдоход загвар солигдоно
document.addEventListener("DOMContentLoaded", () => {
  const brandSelect = document.getElementById("brand");
  if (brandSelect) {
    brandSelect.addEventListener("change", (e) => {
      loadModelsByBrand(e.target.value);
    });
  }

  // Page load үед ачаална
  loadBrands();
  loadColors();
});

// ===============================
// ☁️ FIRESTORE-Д МАШИН ХАДГАЛАХ
// ===============================

// ⚠️ type="module" + onclick тул window дээр гаргана
window.saveCar = async function () {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Нэвтэрсэн байх шаардлагатай");
      return;
    }

    // 🔹 INPUTS
    const brand      = document.getElementById("brand")?.value;
    const model      = document.getElementById("model")?.value;
    const color      = document.getElementById("color")?.value;
    const madeYear   = document.getElementById("madeYear")?.value;
    const importYear = document.getElementById("importYear")?.value;
    const plate      = document.getElementById("plate")?.value;

    // 🔴 VALIDATION
    if (!brand || !model || !color || !madeYear || !importYear || !plate) {
      alert("Бүх талбарыг бөглөнө үү");
      return;
    }

    // 💾 FIRESTORE
    await addDoc(collection(db, "cars"), {
      brand,
      model,
      color,
      madeYear,
      importYear,
      plate,
      driverId: user.uid,
      createdAt: serverTimestamp()
    });

    alert("🚗 Машины мэдээлэл амжилттай хадгалагдлаа!");

    // ➡ NEXT STEP
    window.location.href = "signup-personal.html";

  } catch (err) {
    console.error(err);
    alert("Алдаа гарлаа: " + err.message);
  }
};
