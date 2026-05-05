document.addEventListener("DOMContentLoaded", () => {
    // 1. جلب البيانات من localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const container = document.getElementById("cart-items");
    const totalBox = document.getElementById("total-price");

    if (!container) return; 

    function displayCart() {
        container.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            container.innerHTML = "<h2>Your cart is empty </h2>";
            if (totalBox) totalBox.innerText = "Total: 0 EGP";
            return;
        }

        cart.forEach((item, index) => {
            let priceVal = typeof item.price === "string" ? 
                parseFloat(item.price.replace(/[^0-9.]/g, "")) : item.price;
            
            let itemQuantity = item.quantity || 1;
            total += (priceVal * itemQuantity);

            // التعديل هنا: ضفنا || 'images/default.jpg' كحماية
            // واستخدمنا item.image اللي جاي من التعديل الجديد في loadProducts
            container.innerHTML += `
            <div class="cart-item">
                <img src="${item.image || 'images/default-flower.jpg'}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                    <p>${priceVal} EGP ${itemQuantity > 1 ? 'x ' + itemQuantity : ''}</p>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">Delete</button>
            </div>
            `;
        });

        if (totalBox) totalBox.innerText = "Total: " + total + " EGP";
    }

    window.removeItem = function(index) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    };

    window.checkout = function() {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        window.location.href = "checkout.html";
    };

    displayCart();
});