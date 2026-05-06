import { db } from './firebase.js'; 
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    updateCheckoutTotal();
    setupConfirmOrder();
});

// 1. Function to calculate and display the total amount
function updateCheckoutTotal() {
    const totalDisplay = document.getElementById("display-total");
    if (!totalDisplay) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    let total = cart.reduce((sum, item) => {
        // Advanced cleaning: extract only numbers and dots from the price string
        let price = 0;
        if (item.price) {
            let cleanPrice = String(item.price).replace(/[^\d.]/g, '');
            price = parseFloat(cleanPrice) || 0;
        }
        return sum + (price * (item.quantity || 1));
    }, 0);

    totalDisplay.innerText = `${total} EGP`;
}

// 2. Function to handle form submission and save order to Firebase
function setupConfirmOrder() {
    const checkoutForm = document.getElementById("checkoutForm");
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (cart.length === 0) {
                alert("Your cart is empty! Please add some flowers first.");
                return;
            }

            const orderDetails = {
                customerName: document.getElementById("name").value,
                phone: document.getElementById("phone").value,
                address: document.getElementById("address").value,
                items: cart,
                totalAmount: document.getElementById("display-total").innerText,
                status: "pending",
                createdAt: new Date()
            };

            try {
                await addDoc(collection(db, "orders"), orderDetails);
                
                alert("Order confirmed successfully! Thank you.");
                localStorage.removeItem("cart"); 
                window.location.href = "orderconfirm.html"; 
            } catch (error) {
                console.error("Error adding order: ", error);
                alert("Something went wrong. Please try again.");
            }
        });
    }
}