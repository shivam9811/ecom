const mobileMenu = document.querySelector("#mobile-menu");
const mobileMenuBtn = document.querySelector("#mobile-menu-btn");
mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});
