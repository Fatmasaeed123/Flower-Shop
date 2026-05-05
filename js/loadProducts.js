import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

async function loadProducts() {
    const flowerContainer = document.getElementById('flower-container');
    if (!flowerContainer) return;

    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        flowerContainer.innerHTML = ''; 

        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productId = doc.id;

            const productCard = `
                <div class="box">
                    <div class="image">
                        <img src="${product.image}" alt="${product.title}">
                        <div class="icons">
                            <a href="#" class="fa-solid fa-heart fav-btn"></a>
                            
                            <!-- 1. تعديل: ضفنا '${product.image}' هنا في الآخر -->
                            <a href="#" class="cart-btn" 
                               onclick="handleAddToCart(event, '${productId}', '${product.title}', ${product.price}, '${product.image}')">add to cart</a>
                            
                            <a href="#" class="fa-solid fa-share"></a>
                        </div>
                    </div>
                    <div class="content">
                        <h3>${product.title}</h3>
                        <div class="price">${product.price} EGP</div>
                    </div>
                </div>
            `;
            flowerContainer.innerHTML += productCard;
        });

        setupFavoriteButtons();

    } catch (error) {
        console.error("Error loading products: ", error);
    }
}

// 2. تعديل: ضفنا كلمة image في استقبال الدالة وفي تعريف الـ product
window.handleAddToCart = function(e, id, name, price, image) {
    e.preventDefault();
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // ضفنا الـ image هنا عشان تتخزن في السلة
    const product = { id, name, price, image, quantity: 1 };

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} added to cart! 🌸`);
}

function setupFavoriteButtons() {
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            if(this.classList.contains('active')) {
                this.style.color = "red";
            } else {
                this.style.color = "var(--black)";
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', loadProducts);