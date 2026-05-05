import { auth } from "js/firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

let form = document.getElementById("signupForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Account created ");
            window.location.href = "login.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});