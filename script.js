// التعديل هنا: السكريبت هيدخل فولدر js عشان يلاقي firebase.js
import { db } from './js/firebase.js'; 
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// --- 1. دالة جلب المنتجات من Firebase (جدول products) ---
async function loadFlowers() {
    try {
        const querySnapshot = await getDocs(collection(db, "products")); //
        const productsContainer = document.querySelector(".box-container"); 
        
        if (!productsContainer) return; 

        productsContainer.innerHTML = ""; 

        querySnapshot.forEach((doc) => {
            const data = doc.data(); //
            const productHTML = `
                <div class="box">
                    <span class="price"> ${data.price} EGP </span>
                    <img src="${data.image}" alt="${data.name}">
                    <h3>${data.name}</h3>
                    <div class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="icons">
                        <a href="#" class="fas fa-heart fav-btn" data-id="${doc.id}"></a>
                        <a href="#" class="cart-btn" data-id="${doc.id}">add to cart</a>
                        <a href="#" class="fas fa-share"></a>
                    </div>
                </div>
            `;
            productsContainer.innerHTML += productHTML;
        });
        
        attachEventListeners(); 

    } catch (error) {
        console.error("Error loading products: ", error);
    }
}

// --- 2. دالة تحديث عداد السلة ---
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.innerText = totalItems;
    }
}

// --- 3. تنظيم الأحداث (Event Listeners) ---
function attachEventListeners() {
    const cartButtons = document.querySelectorAll(".cart-btn");
    cartButtons.forEach(btn => {
        btn.onclick = (e) => {
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
            updateCartCount();
            alert(`${name} added to cart! `);
        };
    });

    const favButtons = document.querySelectorAll(".fav-btn");
    favButtons.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            let box = btn.closest(".box");
            let id = btn.dataset.id;
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
        };
    });
}

// --- 4. تشغيل الأكواد عند تحميل الصفحة ---
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    loadFlowers(); 

    let menu = document.querySelector('#menu-bars');
    let navbar = document.querySelector('.navbar');

    if (menu && navbar) {
        menu.onclick = () => {
            menu.classList.toggle('fa-times');
            navbar.classList.toggle('active');
        };
    }

    window.onscroll = () => {
        if (menu && navbar) {
            menu.classList.remove('fa-times');
            navbar.classList.remove('active');
        }
    };

    const userIcon = document.querySelector(".fa-user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (userIcon && isLoggedIn === "true" && userData) {
        userIcon.innerHTML = `<span style="font-size: 1.4rem; margin-left: 5px;">Hi, ${userData.name.split(' ')[0]}</span>`;
        userIcon.href = "#"; 
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        if (isLoggedIn === "true") logoutBtn.style.display = "inline-block";
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            alert("Logged out successfully! ");
            window.location.href = "index.html";
        };
    }
});