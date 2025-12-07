import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.querySelector(".primary-btn").addEventListener("click", async () => {

    const phone = document.querySelectorAll(".input-field")[0].value;
    const pass  = document.querySelectorAll(".input-field")[1].value;

    if (!phone || !pass) {
        alert("Утас болон нууц үгээ оруулна уу!");
        return;
    }

    // 📌 LOGIN domain = user.ruraltransport (Firebase дээрхтэй адил!)
    const email = `${phone}@user.ruraltransport`;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        alert("Амжилттай нэвтэрлээ!");
        location.href = "user-home.html";

    } catch (err) {
        alert("Алдаа: " + err.message);
    }
});
