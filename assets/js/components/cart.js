import { db } from "./products.js";
import { numberToCurrency } from "../helpers/numberCurrency.js";

export const cart = {
  items: window.localStorage.getItem("cart")
    ? JSON.parse(window.localStorage.getItem("cart"))
    : [],
  methods: {
    add: (id, quantity, titulo, precio) => {
      const cartItem = cart.methods.get(id);
      if (cart.methods.hasInventory(id, quantity)) {
        if (cartItem) {
          cartItem.quantity += quantity;
        } else {
          cart.items.push({ id, quantity, titulo, precio });
        }
        window.localStorage.setItem("cart", JSON.stringify(cart.items));

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: "Producto agregado al carrito",
        });
        renderCart();
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "error",
          title: "No Tenemos Mas Productos En Stock",
        });
      }
    },
    remove: (id, quantity) => {
      const cartItem = cart.methods.get(id);

      if (cartItem.quantity - quantity > 0) {
        cartItem.quantity -= quantity;
      } else {
        cart.items = cart.items.filter((item) => item.id !== id);
      }
    },
    removeAll: (id) => {
      cart.items = cart.items.filter((item) => item.id !== id);
    },
    count: () => {
      return cart.items.reduce((acc, item) => acc + item.quantity, 0);
    },
    get: (id) => {
      return cart.items.find((item) => item.id === id);
    },
    getAll: () => {
      return cart.items;
    },
    getTotal: () => {
      const total = cart.items.reduce((acc, item) => {
        const itemDB = db.methods.find(item.id);
        return acc + itemDB.precio * item.quantity;
      }, 0);

      return total;
    },
    hasInventory: (id, quantity) => {
      const product = db.methods.find(id);
      return product && product.quantity >= quantity;
    },
  },
};

const contentTotalPurchases = document.querySelector(
  ".content-total-purchases"
);

if (cart.items == []) {
  contentTotalPurchases.classList.add("empty");
}

export function renderCart() {
  const cartContainer = document.querySelector("#cart #cart__container .tbody");
  const contentTotalPurchases = document.querySelector(
    ".content-total-purchases"
  );
  const cartItems = cart.methods.getAll();
  let html = "";

  if (cartItems.length <= 0) {
    contentTotalPurchases.classList.add("empty");
  } else {
    contentTotalPurchases.classList.remove("empty");
  }

  if (cartItems.length > 0) {
    cartItems.forEach((item) => {
      const product = db.methods.find(item.id);
      html += `
            <div class="tbody__container">
            
                <article class="tbody-content">
                    <div class="tbody-card-description">
                        <h4 class="tbody-card-title">${product.titulo}</h4>
                        <span class="tbody-card-price">
                            Stock: ${product.quantity - item.quantity} |
                            <span>${numberToCurrency(product.precio)}</span>
                            <br>
                            <span>subTotal: ${numberToCurrency(
                              item.quantity * product.precio
                            )}<span>
                            <br>
                            <span class="tbody-card-details">${
                              product.detalles
                            }</span>
                        </span>
                    </div>
                </article>
                <div class="tbody-counter-delete">
                    <div class="counter-plus">
                        <button class="icon minus" data-id="${product.id}">
                            <i class="fa-solid fa-minus"></i>
                        </button>

                        <span class="icon counter">${item.quantity}</span>
        
                        <button class="icon add" data-id="${product.id}">
                            <i class="fa-solid fa-plus"></i>
                        </button>

                    </div>
                    <button class="delete" data-id="${
                      product.id
                    }">Eliminar</button>
                </div>
                
            </div>
        `;
    });
  } else {
    html += `<div class="cart__empty">
        <img src="assets/img/empty-cart.png" alt="empty cart">
        <h2>El carrito esta vacio</h2>
        <p> Puede agregar artículos a su carrito haciendo clic en el botón "<i class="fa-solid fa-plus"></i>" en la página del producto.</p>
        </div>
    `;
  }

  cartContainer.innerHTML = html;

  const cartCount = document.getElementById("cart-count");
  const itemsCart = document.getElementById("itemsCart");

  cartCount.innerHTML = cart.methods.count();
  itemsCart.innerHTML = cart.methods.count();

  const minusItems = document.querySelectorAll(".minus");
  const plusItems = document.querySelectorAll(".add");
  const deleteButtons = document.querySelectorAll(".delete");
  const totalContainer = document.getElementById("total");

  minusItems.forEach((item) => {
    item.addEventListener("click", () => {
      const id = parseInt(item.getAttribute("data-id"));
      cart.methods.remove(id, 1);
      renderCart();
    });
  });

  plusItems.forEach((item) => {
    item.addEventListener("click", () => {
      const id = parseInt(item.getAttribute("data-id"));
      cart.methods.add(id, 1);
      renderCart();
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = parseInt(button.getAttribute("data-id"));
      cart.methods.removeAll(id);
      renderCart();
    });
  });

  const total = cart.methods.getTotal();
  totalContainer.innerHTML = numberToCurrency(total);

  window.localStorage.setItem("products", JSON.stringify(db.items));
  window.localStorage.setItem("cart", JSON.stringify(cart.items));
}
