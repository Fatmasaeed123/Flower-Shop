import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

let form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {

            //  حفظ المستخدم
            localStorage.setItem("currentUser", JSON.stringify(userCredential.user));

            alert("Login success ");

            //  نروح الصفحة الرئيسية
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});