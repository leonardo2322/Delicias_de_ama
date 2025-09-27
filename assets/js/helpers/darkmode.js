const toggleThemeBtn = document.getElementById("toggle-theme");
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  // Opcional: Cambia el icono del botón
  const icon = toggleThemeBtn.querySelector("i");
  if (document.body.classList.contains("dark-mode")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
});
