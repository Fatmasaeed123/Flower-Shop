document.addEventListener("DOMContentLoaded", () => {
    displayFavorites();
});

function displayFavorites() {
    // التعديل هنا: بننادي على الـ ID اللي موجود في الـ HTML بتاعك
    const favContainer = document.getElementById("fav-items"); 
    
    if (!favContainer) {
        console.error("Element with id 'fav-items' not found!");
        return;
    }

    // جلب البيانات من الـ LocalStorage
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // لو المفضلة فاضية
    if (favorites.length === 0) {
        favContainer.innerHTML = '<h3 style="font-size: 2rem; color: #666; text-align: center; margin-top: 2rem;">Your wishlist is empty! 🌸</h3>';
        return;
    }

    favContainer.innerHTML = "";
    favorites.forEach(item => {
        // رسم العناصر بنفس الستايليستيك (fav-item) اللي إنتِ كاتباه في الـ CSS
        const productHTML = `
            <div class="fav-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="info">
                    <h3>${item.name}</h3>
                    <p>${item.price}</p>
                </div>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
                <button class="cart-btn" data-id="${item.id}" 
                    style="background: var(--pink, #e84393); color:#fff; padding:.5rem 1rem; border:none; border-radius:.5rem; cursor:pointer; margin-left:10px;">
                    Add to Cart
                </button>
            </div>`;
        favContainer.innerHTML += productHTML;
    });

    setupFavActions();
}

function setupFavActions() {
    // زرار الحذف
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            let id = btn.getAttribute("data-id");
            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            favorites = favorites.filter(fav => fav.id !== id);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            displayFavorites(); // إعادة تحديث الصفحة
        };
    });

    // زرار الإضافة للسلة من داخل المفضلة
    document.querySelectorAll(".cart-btn").forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            let itemElement = btn.closest(".fav-item");
            let id = btn.getAttribute("data-id");
            let name = itemElement.querySelector("h3").innerText;
            let price = itemElement.querySelector("p").innerText;
            let image = itemElement.querySelector("img").src;

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push({ id, name, price, image, quantity: 1 });
            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`${name} added to cart! 🛒`);
        };
    });
}
