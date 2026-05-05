document.addEventListener("DOMContentLoaded", () => {
    const cartButtons = document.querySelectorAll(".cart-btn");

    cartButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            let box = btn.closest(".box");
            let id = btn.getAttribute("data-id"); 
            let name = box.querySelector("h3").innerText;
            let price = parseFloat(box.querySelector(".price").innerText.replace(" EGP", ""));
            let image = box.querySelector("img").src;

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1; 
            } else {
               
                cart.push({
                    id: id,
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`${name} added to cart! `);
        });
    });
});

let menu = document.querySelector('#menu-bars'); // تأكدي إن الأيقونة واخدة id="menu-bars"
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('fa-times'); // بيغير شكل الأيقونة لـ X
    navbar.classList.toggle('active');
}

// قفل القائمة أول ما تبدأي تعملي scroll
window.onscroll = () => {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
}
const favButtons = document.querySelectorAll(".fav-btn");

favButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        
        let box = btn.closest(".box");
        let id = btn.dataset.id || box.querySelector(".cart-btn").dataset.id;
        let item = {
            id: id,
            name: box.querySelector("h3").innerText,
            price: box.querySelector(".price").innerText,
            image: box.querySelector("img").src
        };

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        let isExist = favorites.find(fav => fav.id === item.id);

        if (isExist) {
            favorites = favorites.filter(fav => fav.id !== item.id);
            btn.style.color = "#333"; 
            alert("Removed from Favorites ");
        } else {
           
            favorites.push(item);
            btn.style.color = "#e84393"; 
            alert("Added to Favorites ");
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const userIcon = document.querySelector(".fa-user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (isLoggedIn === "true" && userData) {
      
        userIcon.innerHTML = `<span style="font-size: 1.4rem; margin-left: 5px;">Hi, ${userData.name.split(' ')[0]}</span>`;
        userIcon.href = "#"; 
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");
    const userBtn = document.getElementById("user-btn");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        logoutBtn.style.display = "inline-block"; 
    }
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();

        
        localStorage.removeItem("isLoggedIn");
        
        alert("Logged out successfully! ");
        
        window.location.href = "index.html";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const iconsContainer = document.querySelector(".icons");

    if (isLoggedIn === "true") {
        
        const ordersLink = document.createElement("a");
        ordersLink.href = "orders.html";
        ordersLink.innerHTML = '<i class="fas fa-shopping-bag"></i>'; 
        ordersLink.title = "My Orders";
        ordersLink.style.fontSize = "2.5rem";
        ordersLink.style.marginLeft = "1.5rem";
        
        iconsContainer.appendChild(ordersLink);
    }
});

let user = JSON.parse(localStorage.getItem("currentUser"));

if(!user){
    window.location.href = "login.html";
}
import { db } from 'js/firebase.js'; 
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

async function loadFlowers() {
    const querySnapshot = await getDocs(collection(db, "flowers")); // افترضي إن الجدول اسمه flowers
    querySnapshot.forEach((doc) => {
        console.log(doc.data()); // هنا الداتا الحقيقية اللي جاية من السيرفر
        // هنا بقى هتحطي الكود اللي كان بيعمل "append" للـ HTML بتاع الوردة
    });
}
// دالة التحديث
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.innerText = totalItems;
    }
}

// ضيفي السطر ده جوه دالة الـ addToCart اللي عندك
function addToCart(productId) {
    // ... الكود بتاعك اللي بيضيف للمصفوفة ...
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(); // <--- السطر ده هو اللي هيخلي الرقم يظهر فوراً
    alert("Added to cart!");
}

// ونادي عليها برضه أول ما الصفحة تفتح
document.addEventListener("DOMContentLoaded", updateCartCount);