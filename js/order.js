import { db } from './firebase.js'; 
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    loadMyOrders();
});

async function loadMyOrders() {
    const ordersContainer = document.getElementById("orders-list");
    
    if (!ordersContainer) return;

    try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            ordersContainer.innerHTML = '<h3 style="text-align:center; font-size:2rem; color:#999; margin-top:5rem;">No orders yet! 🌸</h3>';
            return;
        }

        ordersContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const order = doc.data();
            
            // سطر لمساعدتك في رؤية البيانات الحقيقية في المتصفح (F12 -> Console)
            console.log("Order Data:", order);

            let date = "Unknown Date";
            if (order.createdAt) {
                if (typeof order.createdAt.toDate === 'function') {
                    date = order.createdAt.toDate().toLocaleDateString();
                } else {
                    date = new Date(order.createdAt).toLocaleDateString();
                }
            }

            // محاولة إيجاد السعر في أكثر من مكان محتمل
            const finalPrice = order.price || order.totalAmount || order.total || order.Total || "0";

            const orderHTML = `
                <div class="order-card">
                    <div class="order-header">
                        <h3>Order ID: #${doc.id.slice(0, 8)}</h3>
                        <span>Date: ${date}</span>
                    </div>
                    <div class="order-details">
                        <p><strong>Customer Name:</strong> ${order.customerName || 'N/A'}</p>
                        <p><strong>Address:</strong> ${order.address || 'N/A'}</p>
                        <ul class="order-items">
                            ${order.items ? order.items.map(item => `
                                <li>${item.name} (x${item.quantity || 1}) - ${item.price}</li>
                            `).join('') : '<li>No items found</li>'}
                        </ul>
                    </div>
                    <div class="order-total">
                        Total Amount: ${finalPrice} EGP
                    </div>
                </div>`;
            
            ordersContainer.innerHTML += orderHTML;
        });

    } catch (error) {
        console.error("Error: ", error);
    }
}