import { cart, renderCart } from "./cart.js";

export const cartMenu = () => {
  const cartMenuButton = document.getElementById("cart-menu");
  const cartModal = document.getElementById("cart");
  const iconCart = document.querySelector(".fa-cart-shopping");
  const trash = document.getElementById("trash");

  cartMenuButton.addEventListener("click", () => {
    cartModal.classList.toggle("active");
    if (cartMenuButton) {
      iconCart.classList.toggle("fa-xmark");
    }
  });

  trash.addEventListener("click", () => {
    cart.items = [];
    renderCart();
    cartModal.classList.remove("active");
    if (cartMenuButton) {
      iconCart.classList.remove("fa-xmark");
    }
  });
};
