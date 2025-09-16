import { items } from "../data/data.js";
import { standard } from "../helpers/optionsNavigation.js";
import { cart } from "./cart.js";
import { pagination } from "./paginations.js";

export const db = {
  items:
    window.localStorage.getItem("products") &&
    JSON.stringify(window.localStorage.getItem("products")) ===
      JSON.stringify(items)
      ? JSON.parse(window.localStorage.getItem("products"))
      : items,

  methods: {
    find: function (id, ...productlist) {
      // Verificar si productlist no está definido o está vacío
      if (!productlist || productlist.length === 0) {
        // Buscar el elemento por su ID dentro de todos
        for (let key in db.items) {
          if (db.items.hasOwnProperty(key)) {
            const categoria = db.items[key];
            let data;

            // si agrego otra opcion del badge debo agregar el else if
            if (Object.keys(categoria)[0] === "caseros_bandejas") {
              data = categoria.caseros_bandejas;
            } else if (Object.keys(categoria)[0] === "porciones_menu") {
              data = categoria.porciones_menu;
            } else {
              data = categoria.planchas_saludabes;
            }

            // Verificar si categoria[key] es un array antes de llamar a .find()
            if (Array.isArray(data)) {
              const foundProduct = data.find((item) => item.id === id);
              if (foundProduct) {
                return foundProduct;
              }
            }
          }
        }
        return null;
      } else {
        for (var i = 0; i < db.items.length; i++) {
          var category = db.items;
          // Verificar si la categoría tiene la propiedad 'platos' o 'bebidas'
          if (productlist[0] == "caseros_bandejas") {
            var foundItem = db.methods.findInPlatos(
              category[0],
              id,
              "caseros_bandejas"
            );
            if (foundItem) {
              return foundItem;
            }
          } else if (productlist[0] == "planchas_saludabes") {
            var foundItem = db.methods.findInPlatos(
              category[1],
              id,
              "planchas_saludabes"
            );
            if (foundItem) {
              return foundItem;
            }
          } else if (productlist[0] == "porciones_menu") {
            var foundItem = db.methods.findInPlatos(
              category[2],
              id,
              "porciones_menu"
            );
            if (foundItem) {
              return foundItem;
            }
          }
        }
        // Si no se encuentra el elemento, devolver null
        return null;
      }
    },

    findInPlatos: function (opcion, id, element) {
      // Iterar sobre el array 'platos'
      let elm;
      if (element) {
        elm =
          element === "caseros_bandejas"
            ? opcion.caseros_bandejas
            : element === "porciones_menu"
            ? opcion.porciones_menu
            : opcion.planchas_saludabes;
        for (var i = 0; i < elm.length; i++) {
          var item = elm[i];
          // Verificar si el elemento tiene el ID buscado
          if (item.id === id) {
            return item;
          }
        }
      } else {
        for (let i = 0; i < items.length; i++) {
          const categoria = items[i];

          // Iterar sobre las propiedades de la categoría (platos, bebidas, etc.)
          for (let key in categoria) {
            if (categoria.hasOwnProperty(key)) {
              const productos = categoria[key];

              // Buscar el elemento por su ID dentro de la categoría
              for (let j = 0; j < productos.length; j++) {
                if (productos[j].id === id) {
                  return productos[j]; // Devolver el producto si se encuentra
                }
              }
            }
          }
        }

        return null; // Si no se encuentra el producto, devolver null
      }
    },
    getAll: () => {
      return db.items;
    },
    remove: (items) => {
      items.forEach((item) => {
        const product = db.methods.find(item.id);
        if (product) {
          product.quantity = product.quantity - item.quantity;
        }
      });
    },
  },
};

function handleClickButton(event) {
  if (event.target && event.target.classList.contains("addCarts")) {
    const button = event.target;
    const id = parseInt(button.getAttribute("data-id"));
    const product = db.methods.find(id);
    if (product && product.quantity > 0) {
      cart.methods.add(id, 1, product.titulo, product.precio);
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
  }
}

export const renderProducts = () => {
  let options = JSON.parse(window.localStorage.getItem("options"));
  console.log(options);
  // Verificar si 'options' no está definido o es null
  if (!options) {
    // Si no está definido, establecerlo con el valor de 'standard'
    options = standard;
    window.localStorage.setItem("options", JSON.stringify(options));
  }

  pagination();
  document.removeEventListener("click", handleClickButton);

  document.addEventListener("click", handleClickButton);

  // document.addEventListener('click', (event) => {
  //     if (event.target && event.target.classList.contains("addCarts")) {
  //         handleClickButton(event)
  //     }
  // })
};
