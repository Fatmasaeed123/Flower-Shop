import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"; 

const firebaseConfig = {
  apiKey: "AIzaSyDojMaouXrxm_KY1r1lKCw3SCh1zU66m7U",
  authDomain: "flower-shop-728eb.firebaseapp.com",
  projectId: "flower-shop-728eb",
  storageBucket: "flower-shop-728eb.firebasestorage.app",
  messagingSenderId: "451008410310",
  appId: "1:451008410310:web:4f4b0642aa1bb66e35ddc7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);