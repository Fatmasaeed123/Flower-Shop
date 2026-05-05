import { db } from './js/firebase.js'; 
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("orders-list");

    try {
        // 1. جلب الطلبات من Firestore مرتبة من الأحدث للأقدم
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        // 2. التحقق لو مفيش طلبات في الداتابيز
        if (querySnapshot.empty) {
            container.innerHTML = `
                <div style="text-align:center;">
                    <h2 style="color:#999;">No orders have been placed yet. </h2>
                    <a href="index.html" class="btn" style="display:inline-block; margin-top:1rem;">Shop Now</a>
                </div>`;
            return;
        }

        container.innerHTML = ""; // مسح أي محتوى قديم (مثل Loading)

        // 3. عرض الطلبات من الفايربيز
        querySnapshot.forEach((doc) => {
            const order = doc.data();
            const orderId = doc.id; // استخدام الـ ID الحقيقي للوثيقة من فايربيز

            container.innerHTML += `
                <div class="order-card">
                    <div class="order-header">
                        <h3>Order ID: #${orderId.substring(0, 8)}</h3> 
                        <span>Date: ${order.createdAt}</span>
                    </div>
                    <div class="order-details">
                        <p><strong>Customer:</strong> ${order.customer.name}</p>
                        <p><strong>Phone:</strong> ${order.customer.phone}</p>
                        <p><strong>Address:</strong> ${order.customer.address}</p>
                        <div class="order-items">
                            <p><strong>Items:</strong></p>
                            <ul>
                                ${order.items.map(item => `
                                    <li>${item.name} (x${item.quantity || 1}) - ${item.price}</li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="order-total">
                            Total Paid: ${order.total} EGP
                        </div>
                        <p style="margin-top:10px; color: #e84393; font-weight: bold;">Status: ${order.status}</p>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error fetching orders: ", error);
        container.innerHTML = `<p style="text-align:center; color:red;">Error loading orders. Please try again later.</p>`;
    }
});