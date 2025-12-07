// Firebase init
const firebaseConfig = {
  apiKey: "AIzaSyDj0scQQ_Y2jSF_6bb1hfrRsMzTIju18wQ",
  authDomain: "myweb-73a96.firebaseapp.com",
  projectId: "myweb-73a96",
  storageBucket: "myweb-73a96.firebasestorage.app",
  messagingSenderId: "760684186396",
  appId: "1:760684186396:web:f8a19a4225fa67acd648d9",
  measurementId: "G-NKZ4GQLZJG"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();


// ================================
// Step System
// ================================
function nextStep(n) {
  document.querySelectorAll(".step").forEach(s => s.style.display = "none");
  document.getElementById("step" + n).style.display = "block";
}

function backStep(n) {
  nextStep(n);
}


// ================================
// БҮРТГЭЛ submit
// ================================
async function submitDriver() {

  try {
    // 1) Input values
    const data = {
      lastName: document.getElementById("lastName").value.trim(),
      firstName: document.getElementById("firstName").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
      carPlate: document.getElementById("carPlate").value.trim(),
      carModel: document.getElementById("carModel").value.trim(),
    };

    // Шалгалт
    for (const key in data) {
      if (!data[key]) {
        alert("Бүх талбарыг бөглөнө үү!");
        return;
      }
    }

    if (data.password.length < 6) {
      alert("Нууц үг хамгийн багадаа 6 тэмдэгт байна!");
      return;
    }

    // 2) Files
    const licenseFront = document.getElementById("licenseFront").files[0];
    const licenseBack  = document.getElementById("licenseBack").files[0];

    const out1 = document.getElementById("out1").files[0];
    const out2 = document.getElementById("out2").files[0];
    const out3 = document.getElementById("out3").files[0];
    const out4 = document.getElementById("out4").files[0];

    // null check
    if (!licenseFront || !licenseBack || !out1 || !out2 || !out3 || !out4) {
      alert("Бүх зургаа оруулна уу!");
      return;
    }

    // 3) Create Firebase Auth User
    let userCred;
    try {
      userCred = await auth.createUserWithEmailAndPassword(data.email, data.password);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        alert("Энэ email аль хэдийн бүртгэлтэй байна!");
        return;
      }
      alert("Auth алдаа: " + err.message);
      return;
    }

    const uid = userCred.user.uid;

    // 4) Upload helper
    async function upload(file, name) {
      const ref = storage.ref(`drivers/${uid}/${name}.jpg`);
      await ref.put(file);
      return await ref.getDownloadURL();
    }

    // 5) Upload images
    const photos = {
      licenseFront: await upload(licenseFront, "licenseFront"),
      licenseBack:  await upload(licenseBack,  "licenseBack"),
      out1: await upload(out1, "out1"),
      out2: await upload(out2, "out2"),
      out3: await upload(out3, "out3"),
      out4: await upload(out4, "out4")
    };

    // 6) Save to Firestore
    await db.collection("drivers").doc(uid).set({
      ...data,
      photos,
      status: "pending",
      createdAt: Date.now()
    });

    alert("Бүртгэл амжилттай! Админ баталгаажуулахыг хүлээнэ үү.");
    window.location.href = "driver-login.html";

  } catch (error) {
    alert("Тодорхойгүй алдаа: " + error.message);
  }
}
