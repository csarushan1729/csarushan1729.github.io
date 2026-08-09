// Skill filter + active rail section highlighting

const filters = document.querySelectorAll(".filter");
const chips = document.querySelectorAll(".skill-chip");

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const cat = btn.dataset.filter;

    chips.forEach((chip) => {
      if (cat === "all" || chip.dataset.cat === cat) {
        chip.classList.remove("dimmed", "hidden");
      } else {
        chip.classList.add("dimmed");
      }
    });
  });
});

// Highlight current section in the side rail
const sections = document.querySelectorAll("section[id], header#top");
const railLinks = document.querySelectorAll(".rail-nav a");

function updateRail() {
  const y = window.scrollY + 120;

  let current = "top";
  document.querySelectorAll("section[id]").forEach((sec) => {
    if (y >= sec.offsetTop) current = sec.id;
  });

  railLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === current);
  });
}

window.addEventListener("scroll", updateRail, { passive: true });
updateRail();
