import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import { setDoc, doc } 
from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


document.querySelector(".primary-btn").addEventListener("click", async () => {

    const last  = document.querySelectorAll(".input-field")[0].value;
    const first = document.querySelectorAll(".input-field")[1].value;
    const phone = document.querySelectorAll(".input-field")[2].value;
    const pass  = document.querySelectorAll(".input-field")[3].value;
    const repass= document.querySelectorAll(".input-field")[4].value;

    if (!last || !first || !phone || !pass || !repass) {
        alert("Бүх талбарыг бөглөнө үү!");
        return;
    }

    if (pass !== repass) {
        alert("Нууц үг тохирохгүй байна!");
        return;
    }

    if (phone.length < 8) {
        alert("Утасны дугаараа зөв оруулна уу!");
        return;
    }

    const email = phone + "@user.ruraltransport";

    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, pass);

        await setDoc(doc(db, "users", userCred.user.uid), {
            lname: last,
            fname: first,
            phone: phone,
            createdAt: new Date(),
        });

        alert("Бүртгэл амжилттай!");
        location.href = "login.html";

    } catch (err) {
        if (err.code === "auth/email-already-in-use") {
            alert("Амжилттай бүртгэгдлээ!");
            location.href = "login.html";
        }
    }
});


// -------------------------
//  ✓ Кирилл шүүлтүүр
//  ✓ Глобал болгож өгсөн (window.)
// -------------------------
window.onlyCyrillic = function (input, warnId) {

    const warn = document.getElementById(warnId);
    let txt = input.value;

    // ❌ Англи үсэг орсон эсэх шалгах
    const hasLatin = /[A-Za-z]/.test(txt);

    // ✔ Кирилл шүүлтүүр (зөвшөөрөгдөх бүх кирилл)
    txt = txt.replace(/[^А-Яа-яЁёӨөҮүҢңҺһ\s]/g, "");

    // ✔ Эхний үсгийг том болгоно
    txt = txt.replace(/(^|\s)([а-яёөүңһ])/g, 
        (m, space, letter) => space + letter.toUpperCase()
    );

    input.value = txt;

    // ⚠ Англи үсэг дарсан үед warning харуулах
    if (hasLatin) {
        warn.style.display = "block";
    } else {
        warn.style.display = "none";
    }
};


