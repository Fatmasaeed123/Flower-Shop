// 1. Imports
import { db } from './js/firebase.js'; 
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// 2. Load Products with Updated UI (Price under Name, No Stars)
async function loadFlowers() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsContainer = document.querySelector(".box-container"); 
        if (!productsContainer) return; 

        productsContainer.innerHTML = ""; 
        querySnapshot.forEach((doc) => {
            const data = doc.data(); 

            // Flexible Mapping for Firebase fields
            const pName = data.title || data.name || data.Name || "Beautiful Flower";
            const pPrice = data.price || data.Price || "0";
            const pImage = data.image || data.Image || "images/default.jpg";

            const productHTML = `
                <div class="box">
                    <div class="image">
                        <img src="${pImage}" alt="">
                        <div class="icons">
                            <a href="#" class="fas fa-heart fav-btn" data-id="${doc.id}"></a>
                            <a href="#" class="cart-btn" data-id="${doc.id}">add to cart</a>
                            <a href="#" class="fas fa-share"></a>
                        </div>
                    </div>
                    <div class="content">
                        <h3>${pName}</h3>
                        <div class="price" style="font-size: 1.5rem; color: var(--pink); padding-top: .5rem;"> 
                            ${pPrice} EGP 
                        </div>
                    </div>
                </div>`;
            productsContainer.innerHTML += productHTML;
        });
        
        attachEventListeners(); 

    } catch (error) { 
        console.error("Error loading products: ", error); 
    }
}

// 3. Events Logic (Cart & Favorites)
function attachEventListeners() {
    // --- Favorite Logic ---
    const favButtons = document.querySelectorAll(".fav-btn");
    favButtons.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            let box = btn.closest(".box");
            let id = btn.getAttribute("data-id");
            let name = box.querySelector("h3").innerText;
            let price = box.querySelector(".price").innerText;
            let image = box.querySelector("img").src;

            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            let existingIndex = favorites.findIndex(fav => fav.id === id);

            if (existingIndex > -1) {
                favorites.splice(existingIndex, 1); // Remove if exists
                btn.style.color = "var(--black)";
            } else {
                favorites.push({ id, name, price, image }); // Save full object
                btn.style.color = "#e84393";
            }

            localStorage.setItem("favorites", JSON.stringify(favorites));
        };

        // Initialize heart color
        let id = btn.getAttribute("data-id");
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (favorites.some(fav => fav.id === id)) {
            btn.style.color = "#e84393";
        }
    });

    // --- Cart Logic ---
    const cartButtons = document.querySelectorAll(".cart-btn");
    cartButtons.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            let box = btn.closest(".box");
            let id = btn.getAttribute("data-id"); 
            let name = box.querySelector("h3").innerText;
            let priceText = box.querySelector(".price").innerText;
            let image = box.querySelector("img").src;

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1; 
            } else {
                cart.push({ id, name, price: priceText, image, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            alert(`${name} added to cart!`);
        };
    });
}

// 4. Utilities (Count & Forms)
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = document.getElementById("cart-count");
    if(cartCount) cartCount.innerText = cart.length;
}

function setupContactForm() {
    const contactForm = document.querySelector('#contactForm'); 
    if(contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const customerMessage = {
                name: document.querySelector('#name').value,
                email: document.querySelector('#email').value,
                message: document.querySelector('#message').value,
                createdAt: new Date()
            };
            try {
                await addDoc(collection(db, "messages"), customerMessage);
                alert("Message sent! ✨");
                contactForm.reset();
            } catch (err) { console.error(err); }
        });
    }
}

// 5. Initialize
document.addEventListener("DOMContentLoaded", () => {
    loadFlowers();
    setupContactForm();
    updateCartCount();

    // Menu Logic
    let menu = document.querySelector('#menu-bars');
    let navbar = document.querySelector('.navbar');
    if (menu) {
        menu.onclick = () => {
            menu.classList.toggle('fa-times');
            navbar.classList.toggle('active');
        };
    }
});