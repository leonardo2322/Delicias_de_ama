export const navBarMenu = () => {
  const buttonToggle = document.getElementById("menu");
  const navMenu = document.getElementById("items");
  const link = document.querySelectorAll(".item");
  const iconNav = document.querySelector(".fa-bars");

  buttonToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    if (buttonToggle) {
      iconNav.classList.toggle("fa-xmark");
    }
  });

  link.forEach((item) => {
    item.addEventListener("click", () => {
      navMenu.classList.remove("active");
      iconNav.classList.remove("fa-xmark");
    });
  });
};

const up = document.querySelector(".scroll-up");
export const scrollToTop = () => {
  up.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
};

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    up.style.display = "block";
  } else {
    up.style.display = "none";
  }
});
