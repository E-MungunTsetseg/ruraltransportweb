// ================= FIREBASE =================
import { auth, db } from "../firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ================= DOM READY =================
document.addEventListener("DOMContentLoaded", () => {

  // 🔹 ELEMENTS
  const btn    = document.getElementById("driverRegister");
  const dLName = document.getElementById("dLName");
  const dFName = document.getElementById("dFName");
  const dPhone = document.getElementById("dPhone");
  const dPass  = document.getElementById("dPass");
  const dRepass= document.getElementById("dRepass");

  // 🔹 REGISTER
  btn.addEventListener("click", async () => {

    const lname  = dLName.value.trim();
    const fname  = dFName.value.trim();
    const phone  = dPhone.value.trim();
    const pass   = dPass.value.trim();
    const repass = dRepass.value.trim();

    // 🔴 VALIDATION
    if (!lname || !fname || !phone || !pass || !repass) {
      alert("Бүх талбарыг бөглөнө үү!");
      return;
    }

    if (pass !== repass) {
      alert("Нууц үг таарахгүй байна!");
      return;
    }

    // 📧 phone → fake email
    const email = `${phone}@driver.ruraltransport`;

    try {
      // 🔐 AUTH
      const cred = await createUserWithEmailAndPassword(auth, email, pass);

      // 💾 FIRESTORE
      await setDoc(doc(db, "drivers", cred.user.uid), {
        lname,
        fname,
        phone,
        email,
        role: "driver",
        status: "pending",
        createdAt: serverTimestamp()
      });

      alert("Жолооч амжилттай бүртгэгдлээ!");

      // ➡ NEXT STEP
      window.location.href = "signup-car.html";
      // эсвэл: driver-login.html

    } catch (err) {
      console.error(err);
      alert("Алдаа: " + err.message);
    }
  });
});
