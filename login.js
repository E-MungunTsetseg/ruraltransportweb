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

document.getElementById("forgotBtn").onclick = () => {

    document.getElementById("resetModal").style.display = "flex";

    document.getElementById("step1").style.display = "block";
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "none";

    document.getElementById("otpError").style.display = "none";
};

document.getElementById("resetCloseX").onclick = () => {
    document.getElementById("resetModal").style.display = "none";
};

document.getElementById("sendCodeBtn").onclick = () => {

    const phone = document.getElementById("resetPhone").value.trim();

    if (phone.length !== 8)
        return alert("Утасны дугаар буруу!");

    window.generatedOTP = Math.floor(100000 + Math.random() * 900000);
    console.log("OTP:", window.generatedOTP); 

  
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
};

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

document.getElementById("updatePassBtn").onclick = async () => {

    const newPass = document.getElementById("newPass").value.trim();
    const phone   = document.getElementById("resetPhone").value.trim();
    const email   = `${phone}@user.ruraltransport`;

    if (newPass.length < 6)
        return alert("Нууц үг хамгийн багадаа 6 тэмдэгт!");

    try {
        const userDoc = doc(db, "users", phone);
        const snap    = await getDoc(userDoc);

        if (!snap.exists())
            return alert("Энэ дугаар бүртгэлгүй байна!");

        const userData = snap.data();

        try {
            const tempLogin = await signInWithEmailAndPassword(auth, email, "wrongPassword");
            await deleteUser(tempLogin.user);
        } catch(e) {
            
        }

        const newUser = await createUserWithEmailAndPassword(auth, email, newPass);


        await setDoc(doc(db, "users", newUser.user.uid), userData);


        alert("Нууц үг амжилттай шинэчлэгдлээ!");
        location.href = "login.html";

    } catch (err) {
        alert("Алдаа: " + err.message);
    }
};