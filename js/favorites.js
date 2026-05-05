document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("fav-items");

    // 1. السطر ده هو أهم تعديل: لو العنصر مش موجود في الصفحة دي، اقفل الملف فوراً ومطلعش إيرور
    if (!container) return; 

    function renderFavorites() {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        // تنظيف المكان قبل العرض
        container.innerHTML = "";

        // 2. لو مفيش منتجات مفضلة
        if (favorites.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; width:100%;">
                    <h2 style="font-size: 2rem; color: #666;">No favorites yet ❤️</h2>
                    <a href="index.html" class="btn" style="display:inline-block; margin-top:1rem;">Back to Shop</a>
                </div>`;
            return;
        }

        // 3. عرض المنتجات المفضلة
        favorites.forEach((item, index) => {
            container.innerHTML += `
                <div class="fav-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="details">
                        <h3>${item.name}</h3>
                        <p>${item.price}</p>
                    </div>
                    <div class="actions" style="margin-left: auto; display: flex; gap: 10px;">
                        <button onclick="addToCartFromFav(${index})" class="btn" style="padding: .5rem 1rem; font-size: 1.2rem; background: #333;">
                            Add to Cart
                        </button>
                        <button onclick="removeFav(${index})" class="remove-btn">
                            Remove
                        </button>
                    </div>
                </div>
            `;
        });
    }

    // وظيفة الحذف من المفضلة
    window.removeFav = function(index) {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        favorites.splice(index, 1); 
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites(); 
    };

    // وظيفة الإضافة للسلة من المفضلة
    window.addToCartFromFav = function(index) {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        let item = favorites[index];
        
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        let existingItem = cart.find(c => c.name === item.name);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({
                ...item,
                price: parseFloat(item.price.replace(/[^0-9.]/g, "")), 
                quantity: 1
            });
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${item.name} added to cart! `);
    };

    // تشغيل الدالة لأول مرة
    renderFavorites();
});