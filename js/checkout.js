import { db } from '/js/firebase.js'; // تأكدي إن المسار صح حسب مشروعك
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// التأكد من تسجيل الدخول
if (localStorage.getItem('isLoggedIn') !== 'true') {
    alert('Please login first to complete your order!');
    window.location.href = 'login.html';
}

document.addEventListener("DOMContentLoaded", () => {
    let form = document.getElementById("checkoutForm");
    let summaryDiv = document.getElementById("checkout-summary");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // عرض الإجمالي للعميل قبل ما يطلب
    if (summaryDiv && cart.length > 0) {
        let total = cart.reduce((sum, item) => {
            let price = typeof item.price === "string" ? parseFloat(item.price.replace(/[^0-9.]/g, "")) : item.price;
            return sum + (price * (item.quantity || 1));
        }, 0);
        summaryDiv.innerText = `Total Amount: ${total} EGP`;
    }

    if (form) {
        form.addEventListener("submit", placeOrder);
    }
});

async function placeOrder(e) {
    e.preventDefault();

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty");
        return;
    }

    // تجهيز بيانات الطلب مع تنظيف السعر
    let orderData = {
        customer: {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value
        },
        items: cart,
        total: cart.reduce((sum, item) => {
            let price = typeof item.price === "string" ? parseFloat(item.price.replace(/[^0-9.]/g, "")) : item.price;
            return sum + (price * (item.quantity || 1));
        }, 0),
        status: "Pending",
        createdAt: new Date().toLocaleString() // تاريخ مقروء للطلب
    };

    try {
        // إرسال الطلب لـ Firebase
        const docRef = await addDoc(collection(db, "orders"), orderData);
        console.log("Order placed with ID: ", docRef.id);

        localStorage.setItem("currentOrder", JSON.stringify(orderData));
        localStorage.removeItem("cart");

        alert("Order placed successfully! ");
        window.location.href = "orderconfirm.html";

    } catch (error) {
        console.error("Error adding order: ", error);
        alert("Something went wrong, please try again.");
    }
}