import { numberToCurrency } from "../helpers/numberCurrency.js";
import { db } from "./products.js";

export const pagination = () => {
  const product = db.methods.getAll();

  const tipoDatos = [
    "caseros_bandejas",
    "planchas_saludabes",
    "porciones_menu",
  ];
  let options = JSON.parse(localStorage.getItem("options"));
  const itemsPerPage = 5;
  let currentPage = 1;
  const productLength = renderItems(product, currentPage, options.p)[0][
    options.p
  ].length;

  function showPage(pageNumber, product) {
    currentPage = pageNumber;
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const tipoDatos = [
      "planchas_saludabes",
      "caseros_bandejas",
      "porciones_menu",
    ];

    const dataContainer = document.getElementById("product-container");
    dataContainer.innerHTML = "";
    let html = "";

    tipoDatos.forEach((tipo) => {
      if (product[0].hasOwnProperty(tipo)) {
        const datos = product[0][tipo].slice(startIndex, endIndex);

        datos.forEach((item) => {
          const texto = item.disponible ? "Disponible" : "PorEncargo";
          const color = item.disponible ? "green" : "red";
          html += `
                  <div class="card" id="card" data-id="${item.id}">
                      <div class="card-img">
                          <div class="img">
                              <img src="${item.imagen}" alt="${item.titulo}">
                          </div>
                      </div>
                      <div class="card-title" ">${item.titulo}</div>
                      <div class="card-subtitle" >${
                        item.detalles
                      } <span style="color: ${color};">${texto}</span></div>
                      <hr class="card-divider">
                      <div class="card-footer">
                          <div class="card-price">${numberToCurrency(
                            item.precio
                          )}</div>
                          <button class="card-btn addCarts" data-id="${
                            item.id
                          }">
                              <i class="fa-solid fa-cart-plus addCarts" data-id="${
                                item.id
                              }"></i>
                          </button>
                          <button class="card-btn eyes" data-id="${item.id}">
                              <i class="eyes fa-solid fa-eye" data-id="${
                                item.id
                              }"></i>
                          </button>
                      </div>
                  </div>
              `;
        });
      }
    });

    dataContainer.innerHTML = html;
    updatePaginationButtons();
  }

  function renderItems(prod, current, elmnt) {
    const filteredItems = prod.filter((item) => {
      // Filtrar por la propiedad `elmnt` según `options.p`
      return (
        item.hasOwnProperty(elmnt) && Object.keys(item).includes(options.p)
      );
    });

    return filteredItems;
  }

  function generatePaginationButtons(data) {
    const paginationContainer = document.getElementById("number-page");
    paginationContainer.innerHTML = "";

    tipoDatos.forEach((tipo) => {
      if (data[0].hasOwnProperty(tipo)) {
        const tipoData = data[0][tipo];
        for (let i = 1; i <= Math.ceil(tipoData.length / itemsPerPage); i++) {
          const button = document.createElement("button");
          button.classList.add("counter-page");
          button.textContent = i;
          button.addEventListener("click", () => showPage(i, data));
          paginationContainer.appendChild(button);
        }
      }
    });
  }
  function updatePaginationButtons() {
    const buttons = document.querySelectorAll("#number-page .counter-page");
    buttons.forEach((button, index) => {
      if (index + 1 === currentPage) {
        button.classList.add("current");
      } else {
        button.classList.remove("current");
      }
    });
  }

  function goToNextPage() {
    const totalPages = Math.ceil(productLength / itemsPerPage);
    if (currentPage < totalPages) {
      showPage(currentPage + 1, renderItems(product, currentPage, options.p));
    }
  }

  function goToPrevPage() {
    if (currentPage > 1) {
      showPage(currentPage - 1, renderItems(product, currentPage, options.p));
    }
  }

  function initializePagination() {
    generatePaginationButtons(renderItems(product, currentPage, options.p));
    showPage(currentPage, renderItems(product, currentPage, options.p));
    // showPage(currentPage, product);

    document.getElementById("prev").addEventListener("click", goToPrevPage);
    document.getElementById("next").addEventListener("click", goToNextPage);
  }

  initializePagination();
};
