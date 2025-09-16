import { numberToCurrency } from "../helpers/numberCurrency.js";
import { cart, renderCart } from "./cart.js";
import { db } from "./products.js";

import { renderProducts } from "../components/products.js";
export const findProductModal = () => {
  const selectProductModal = document.querySelector(".modal__product-select");
  const containerModal = document.querySelector(".modal__product-select");

  const cardProductSelect = (event, optionWrapper) => {
    let card;
    optionWrapper ? (card = event) : (card = event.target);
    console.log(card.getAttribute("data-id"));
    const id = parseInt(card.getAttribute("data-id"));
    let options;
    optionWrapper
      ? (options = { p: "caseros_bandejas" })
      : (options = JSON.parse(localStorage.getItem("options")));

    const product = db.methods.find(id, options.p);
    let html = "";

    html += `
        <div class="modal-select">
            <div class="modal-header-select">
                <h3>Producto <span>${product?.titulo}</span></h3>
                <span class="close-modal"><i class="fa-solid fa-xmark"></i></span>
            </div>
            <div class="modal-body-select">
                <img src="${product.imagen}" alt="${product.titulo}">
                <div class="modal__content-select">
                    <h3>${product.titulo}</h3>
                    <span>${numberToCurrency(product.precio)}</span>
                    <p>${product.detalles}</p>
                </div>
            </div>
            <div class="addCartSelect">
                <button class="btn add-cart-btn" data-id="${product.id}">
                    Añadir al Carrito
                    <i class="fa-solid fa-cart-plus"></i>
                </button>
            </div>
        </div>
        
        `;

    selectProductModal.innerHTML = html;
  };

  const handleClickButton = (event) => {
    const button = event.target;
    const id = parseInt(button.getAttribute("data-id"));
    const product = db.methods.find(id);

    if (product && product.quantity > 0) {
      cart.methods.add(id, 1, product.titulo, product.precio);
      containerModal.style.opacity = "0";
      containerModal.style.visibility = "hidden";
      renderCart();
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "error",
        title: "No Tenemos mas productos en stock",
      });
    }
  };

  document.addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains("add-cart-btn")) {
      handleClickButton(event);
    }
  });

  const buttonCardSelect = (event) => {
    console.log(event);
    event.stopPropagation();
    const closeModal = document.querySelectorAll(".close-modal");
    const card = event.target;

    if (card) {
      containerModal.style.opacity = "1";
      containerModal.style.visibility = "visible";
    }

    closeModal.forEach((close) => {
      close.addEventListener("click", () => {
        containerModal.style.opacity = "0";
        containerModal.style.visibility = "hidden";
      });
    });
  };

  document.addEventListener("click", (event) => {
    if (
      (event.target && event.target.classList.contains("card")) ||
      event.target.classList.contains("card-description") ||
      event.target.classList.contains("card-price") ||
      event.target.classList.contains("card-titulo") ||
      event.target.classList.contains("eyes")
    ) {
      cardProductSelect(event);
      buttonCardSelect(event);
    } else if (event.target.classList.contains("badge")) {
      let badge = event.target.textContent.toLowerCase();
      let options = JSON.parse(localStorage.getItem("options"));

      options.p = badge;

      localStorage.setItem("options", JSON.stringify(options));

      renderProducts();
    } else if (event.target.classList.contains("wraper_opction")) {
      cardProductSelect(event.target.parentNode.parentNode, true);
      buttonCardSelect(event);
    }
  });
};
