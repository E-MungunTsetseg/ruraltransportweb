/* =======================
   IMPORTS
======================= */
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

/* GLOBAL */
let activeUser = null;
const storage = getStorage();

/* =======================
   LOAD USER
======================= */
onAuthStateChanged(auth, async (user) => {
  activeUser = user;
  if (!user) return;

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return;

  const data = snap.data();

  document.getElementById("pLName").textContent = data.lname;
  document.getElementById("pFName").textContent = data.fname;
  document.getElementById("pPhone").textContent = data.phone;

  if (data.imageURL) document.getElementById("profileImg").src = data.imageURL;
});

/* =======================
   PROFILE POPUP
======================= */
const profileBox = document.getElementById("profileBox");

document.getElementById("profileBtn").onclick = () => {
    profileBox.style.display = "flex";
};

document.getElementById("closePopup").onclick = () => {
    profileBox.style.display = "none";
};

/* =======================
   LOGOUT
======================= */
document.getElementById("logoutIcon").onclick = () => {
  signOut(auth).then(() => {
      window.location.href = "login.html";
  });
};

/* =======================
   PROFILE IMAGE UPLOAD
======================= */
document.getElementById("profileUpload").addEventListener("change", async function () {

  if (!activeUser) return;
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => document.getElementById("profileImg").src = e.target.result;
  reader.readAsDataURL(file);

  const storageRef = ref(storage, `users/${activeUser.uid}/profile.jpg`);
  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);
  await updateDoc(doc(db, "users", activeUser.uid), { imageURL: url });

  alert("Зураг хадгалагдлаа!");
});

/* =======================
   LOAD ROUTES
======================= */
async function loadStops() {
  const snap = await getDocs(collection(db, "routes"));

  const fromSel = document.getElementById("from");
  const toSel = document.getElementById("to");

  let fromSet = new Set();
  let toSet = new Set();

  snap.forEach(doc => {
    const r = doc.data();
    fromSet.add(r.from);
    toSet.add(r.to);
  });

  fromSet.forEach(v => fromSel.innerHTML += `<option>${v}</option>`);
  toSet.forEach(v => toSel.innerHTML += `<option>${v}</option>`);
}

loadStops();

/* =======================
   SEARCH ROUTES
======================= */
const fromSel = document.getElementById("from");
const toSel = document.getElementById("to");
const dateSel = document.getElementById("date");
const resultsBox = document.getElementById("results");

document.getElementById("search").onclick = async () => {
  
  const from = fromSel.value;
  const to = toSel.value;
  const date = dateSel.value;

  if (!from || !to || !date)
    return alert("Бүх талбарыг бөглөнө үү!");

  const q = query(
      collection(db, "routes"),
      where("from", "==", from),
      where("to", "==", to),
      where("date", "==", date)
  );

  const snap = await getDocs(q);

  resultsBox.innerHTML = "";

  if (snap.empty)
      return resultsBox.innerHTML = `<p>Илэрц олдсонгүй…</p>`;

  snap.forEach(doc => {
    const r = doc.data();

    resultsBox.innerHTML += `
      <div class="card">
          <strong>${r.from} → ${r.to}</strong>
          <p>Огноо: ${r.date}</p>
          <p>Цаг: ${r.time}</p>
          <p>Жолооч: ${r.driver}</p>
          <p>Үнэ: ${r.price}₮</p>
          <p>Сул суудал: ${r.seats}</p>
      </div>
    `;
  });
};
document.getElementById("profileBtn").onclick = () => {
    document.getElementById("profileBox").style.display = "flex";
    document.querySelector(".nav").classList.add("blur");
};

document.getElementById("closePopup").onclick = () => {
    document.getElementById("profileBox").style.display = "none";
    document.querySelector(".nav").classList.remove("blur");
};

