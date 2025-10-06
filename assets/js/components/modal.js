export const modal = () => {
  const openModal = document.querySelectorAll(".shortcuts__items");
  const closeModal = document.querySelectorAll(".close-modal");
  let modalContent = null; // Definir la variable fuera de los bucles
  let modalContainer = null; // Declaración global

  openModal.forEach((open) => {
    open.addEventListener("click", () => {
      const target = open.getAttribute("data-target");
      modalContent = document.getElementById(target); // Asignar el valor aquí
      modalContainer = modalContent.closest(".modal-container"); // Asignación global
      modalContainer.style.opacity = "1";
      modalContainer.style.visibility = "visible";
    });
  });

  closeModal.forEach((close) => {
    close.addEventListener("click", () => {
      if (modalContent) {
        // Verificar si modalContent es válido
        modalContent.classList.toggle("modal-close");
        setTimeout(() => {
          modalContainer.style.opacity = "0";
          modalContainer.style.visibility = "hidden";
          modalContent.classList.remove("modal-close");
        }, 500);
      }
    });
  });

  window.addEventListener("click", (e) => {
    if (modalContent && e.target === modalContainer) {
      if (modalContent) {
        // Verificar si modalContent es válido
        modalContent.classList.toggle("modal-close");
        setTimeout(() => {
          modalContainer.style.opacity = "0";
          modalContainer.style.visibility = "hidden";
        }, 500);
      }
    }
  });
};
