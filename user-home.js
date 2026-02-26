
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { 
    doc, getDoc, updateDoc, collection, 
    getDocs, query, where 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";


let activeUser = null;
const storage = getStorage();

onAuthStateChanged(auth, async (user) => {
  activeUser = user;
  if (!user) return;

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return;

  const data = snap.data();

  document.getElementById("pLName").textContent = data.lname;
  document.getElementById("pFName").textContent = data.fname;
  document.getElementById("pPhone").textContent = data.phone;

  if (data.imageURL) {
    document.getElementById("profileImg").src = data.imageURL;
  }
});

const profileBox = document.getElementById("profileBox");
const navBar = document.querySelector(".nav");

document.getElementById("profileBtn").onclick = () => {
  profileBox.style.display = "flex";
  navBar.classList.add("blur");
};

document.getElementById("closePopup").onclick = () => {
  profileBox.style.display = "none";
  navBar.classList.remove("blur");
};

document.getElementById("logoutIcon").onclick = () => {
  signOut(auth).then(() => {
      window.location.href = "login.html";
  });
};

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

  alert("Зураг амжилттай шинэчлэгдлээ!");
});

async function loadStops() {
  const snap = await getDocs(collection(db, "routes"));

  const fromSel = document.getElementById("from");
  const toSel = document.getElementById("to");

  const fromSet = new Set();
  const toSet = new Set();

  snap.forEach(doc => {
    const r = doc.data();
    fromSet.add(r.from);
    toSet.add(r.to);
  });

  fromSet.forEach(v => {
    fromSel.innerHTML += `<option value="${v}">${v}</option>`;
});

toSet.forEach(v => {
    toSel.innerHTML += `<option value="${v}">${v}</option>`;
});

}

loadStops();

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

  resultsBox.innerHTML = `<p>Уншиж байна...</p>`;

  const q = query(
    collection(db, "routes"),
    where("from", "==", from),
    where("to", "==", to),
    where("date", "==", date)
  );

  const snap = await getDocs(q);

  resultsBox.innerHTML = "";

  if (snap.empty) {
    resultsBox.innerHTML = `<p>Илэрц олдсонгүй…</p>`;
    return;
  }

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