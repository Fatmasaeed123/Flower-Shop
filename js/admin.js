import { db } from '/js/firebase.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("orders-table-body");

    try {
        // جلب الطلبات مرتبة من الأحدث للأقدم
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        tableBody.innerHTML = ""; // مسح الكلام المكتوب

        querySnapshot.forEach((doc) => {
            const order = doc.data();
            const row = `
                <tr>
                    <td>${order.customer.name}</td>
                    <td>${order.customer.phone}</td>
                    <td>${order.total} EGP</td>
                    <td>${order.createdAt}</td>
                    <td class="status-pending">${order.status}</td>
                    <td><button class="btn-view" onclick="alert('Order Items: ${JSON.stringify(order.items.map(i => i.name))}')">View Items</button></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error fetching orders: ", error);
    }
});