const menu = document.getElementById("menu");
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");
const backToTop = document.getElementById("backToTop");
const revealElements = document.querySelectorAll(".reveal");

function toggleMenu(isOpen) {
  if (!menu || !openMenu) return;

  menu.classList.toggle("menu-open", isOpen);
  openMenu.setAttribute("aria-expanded", String(isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
}

if (openMenu && closeMenu && menu) {
  openMenu.setAttribute("aria-controls", "menu");
  openMenu.setAttribute("aria-expanded", "false");
  openMenu.setAttribute("aria-label", "Abrir menu");
  closeMenu.setAttribute("aria-label", "Fechar menu");

  openMenu.addEventListener("click", () => toggleMenu(true));
  closeMenu.addEventListener("click", () => toggleMenu(false));

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });
}

if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 180);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("show"));
}
