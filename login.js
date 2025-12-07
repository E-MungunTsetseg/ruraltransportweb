// ============================
// IMPORTS
// ============================
import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    deleteUser,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


// ============================
// LOGIN
// ============================
document.getElementById("loginBtn").onclick = async () => {

    const phone = document.getElementById("loginPhone").value.trim();
    const pass  = document.getElementById("loginPass").value.trim();

    if (!phone || !pass)
        return alert("Утас болон нууц үгээ оруулна уу!");

    const email = `${phone}@user.ruraltransport`;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        location.href = "user-home.html";

    } catch (err) {
        alert("Алдаа: " + err.message);
    }
};



// ============================
// RESET MODAL OPEN
// ============================
document.getElementById("forgotBtn").onclick = () => {

    document.getElementById("resetModal").style.display = "flex";

    // Reset steps
    document.getElementById("step1").style.display = "block";
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "none";

    document.getElementById("otpError").style.display = "none";
};


// CLOSE
document.getElementById("resetCloseX").onclick = () => {
    document.getElementById("resetModal").style.display = "none";
};



// ============================
// STEP 1 — SEND OTP
// ============================
document.getElementById("sendCodeBtn").onclick = () => {

    const phone = document.getElementById("resetPhone").value.trim();

    if (phone.length !== 8)
        return alert("Утасны дугаар буруу!");

    // Fake OTP
    window.generatedOTP = Math.floor(100000 + Math.random() * 900000);
    console.log("OTP:", window.generatedOTP); // Test only

    // Move to step 2
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
};



// ============================
// STEP 2 — VERIFY OTP
// ============================
document.getElementById("verifyBtn").onclick = () => {

    const code = document.getElementById("otpCode").value.trim();

    if (code == window.generatedOTP) {

        document.getElementById("otpError").style.display = "none";
        document.getElementById("step2").style.display = "none";
        document.getElementById("step3").style.display = "block";

    } else {
        document.getElementById("otpError").style.display = "block";
    }
};



// ============================
// STEP 3 — RESET PASSWORD
// ============================
document.getElementById("updatePassBtn").onclick = async () => {

    const newPass = document.getElementById("newPass").value.trim();
    const phone   = document.getElementById("resetPhone").value.trim();
    const email   = `${phone}@user.ruraltransport`;

    if (newPass.length < 6)
        return alert("Нууц үг хамгийн багадаа 6 тэмдэгт!");

    try {
        // --- GET FIRESTORE USER DATA (users/uid) ---
        const userDoc = doc(db, "users", phone);
        const snap    = await getDoc(userDoc);

        if (!snap.exists())
            return alert("Энэ дугаар бүртгэлгүй байна!");

        const userData = snap.data();


        // --- DELETE OLD FIREBASE AUTH ACCOUNT (if exists)
        try {
            const tempLogin = await signInWithEmailAndPassword(auth, email, "wrongPassword");
            await deleteUser(tempLogin.user);
        } catch(e) {
            // Ignore — it's normal if old password wrong
        }


        // --- CREATE NEW USER WITH NEW PASSWORD ---
        const newUser = await createUserWithEmailAndPassword(auth, email, newPass);


        // --- RESTORE FIRESTORE DATA ---
        await setDoc(doc(db, "users", newUser.user.uid), userData);


        alert("Нууц үг амжилттай шинэчлэгдлээ!");
        location.href = "login.html";

    } catch (err) {
        alert("Алдаа: " + err.message);
    }
};
