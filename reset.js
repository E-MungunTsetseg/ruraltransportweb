import { auth } from "./firebase.js";
import {
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const resetModal = document.getElementById("resetModal");
const forgotBtn = document.getElementById("forgotBtn");
const resetCloseX = document.getElementById("resetCloseX");
const closeReset = document.getElementById("closeReset");
const sendBtn = document.getElementById("resetSend");

forgotBtn.addEventListener("click", () => {
    resetModal.style.display = "flex";
});

resetCloseX.addEventListener("click", () => {
    resetModal.style.display = "none";
});

closeReset.addEventListener("click", () => {
    resetModal.style.display = "none";
});

sendBtn.addEventListener("click", async () => {

    const phone = document.getElementById("resetPhone").value.trim();

    if (phone.length < 8) {
        alert("Утасны дугаарыг зөв оруулна уу!");
        return;
    }

    const email = phone + "@user.ruraltransport";

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Сэргээх линк имэйл рүү илгээгдлээ!");
        resetModal.style.display = "none";

    } catch (err) {
        alert("Алдаа: " + err.message);
    }
});
