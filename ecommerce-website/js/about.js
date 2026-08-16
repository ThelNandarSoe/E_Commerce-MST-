// ================= CART =================
let cartCount = 0;

document.addEventListener("click", function (e) {

    // Add to Cart
    if (e.target.classList.contains("add-to-cart")) {
        cartCount++;

        const cartEl = document.querySelector(".cart-count");
        if (cartEl) {
            cartEl.textContent = cartCount;
        }

        showToast("Added to cart");
    }

    // Wishlist
    if (e.target.classList.contains("wishlist")) {
        e.target.textContent =
            e.target.textContent === "♡" ? "♥" : "♡";
    }
});


// ================= TOAST =================
function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;

    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#7c3aed";
    toast.style.color = "white";
    toast.style.padding = "10px 15px";
    toast.style.borderRadius = "8px";

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
}


// ================= MOBILE MENU =================
const menuBtn = document.querySelector(".mobile-menu-btn");
const navMenu = document.querySelector(".nav-menu");

if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
}