import { db } from './js/firebase.js'; 
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// --- 1. دوال الـ Firebase والمنتجات ---
async function loadFlowers() {
    try {
        const querySnapshot = await getDocs(collection(db, "flowers"));
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            // هنا ضيفي كود الـ Append بتاعك لعرض الورد
        });
    } catch (error) {
        console.error("Error loading flowers: ", error);
    }
}
// استدعاء الدالة
loadFlowers();

// --- 2. إدارة السلة (Cart) والعدّاد ---
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.innerText = totalItems;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

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
                cart.push({ id, name, price, image, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount(); // تحديث الرقم فوراً
            alert(`${name} added to cart! `);
        });
    });

    // --- 3. القائمة الجانبية (Menu) - حماية ضد الـ Null ---
    let menu = document.querySelector('#menu-bars');
    let navbar = document.querySelector('.navbar');

    if (menu && navbar) {
        menu.onclick = () => {
            menu.classList.toggle('fa-times');
            navbar.classList.toggle('active');
        }

        window.onscroll = () => {
            menu.classList.remove('fa-times');
            navbar.classList.remove('active');
        }
    }

    // --- 4. المفضلة (Favorites) ---
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

    // --- 5. تسجيل الدخول والـ UI ---
    const userIcon = document.querySelector(".fa-user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (userIcon && isLoggedIn === "true" && userData) {
        userIcon.innerHTML = `<span style="font-size: 1.4rem; margin-left: 5px;">Hi, ${userData.name.split(' ')[0]}</span>`;
        userIcon.href = "#"; 
    }

    // --- 6. تسجيل الخروج (Logout) ---
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        if (isLoggedIn === "true") {
            logoutBtn.style.display = "inline-block"; 
        }
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            alert("Logged out successfully! ");
            window.location.href = "index.html";
        });
    }

    // --- 7. أيقونة الطلبات (Orders) ---
    const iconsContainer = document.querySelector(".icons");
    if (iconsContainer && isLoggedIn === "true") {
        const ordersLink = document.createElement("a");
        ordersLink.href = "orders.html";
        ordersLink.innerHTML = '<i class="fas fa-shopping-bag"></i>'; 
        ordersLink.title = "My Orders";
        ordersLink.style.fontSize = "2.5rem";
        ordersLink.style.marginLeft = "1.5rem";
        iconsContainer.appendChild(ordersLink);
    }
});