document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  initMenu();
  initSlider();
  initAuthUI();
}

/* ================= MENU ================= */
function initMenu() {
  const btn = document.getElementById("menu-button");
  const nav = document.getElementById("mob-nav");

  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    if (nav.style.maxHeight === "0px" || nav.style.maxHeight === "") {
      nav.style.maxHeight = nav.scrollHeight + "px";
    } else {
      nav.style.maxHeight = "0px";
    }
  });
}

/* ================= SLIDER ================= */
let current = 0;
let visible;

function initSlider() {
  const track = document.getElementById("sliderTrack");
  const slides = document.querySelectorAll(".slide-container");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  if (!track || slides.length === 0) return;

  function moveSlider() {
    const gap = parseInt(getComputedStyle(track).gap);
    const slideWidth = slides[0].offsetWidth + gap;

    track.style.transform = `translateX(-${current * slideWidth}px)`;
  }

  function updateVisibleCards() {
    if (window.innerWidth < 640) visible = 1;
    else if (window.innerWidth < 1024) visible = 2;
    else visible = 3;

    slides.forEach((slide) => {
      slide.style.flexBasis = `calc((100% - ${(visible - 1) * 32}px) / ${visible})`;
    });

    const max = Math.max(0, slides.length - visible);

    if (current > max) current = max;

    moveSlider();
  }

  nextBtn?.addEventListener("click", () => {
    const max = slides.length - visible;
    if (current < max) current++;
    moveSlider();
  });

  prevBtn?.addEventListener("click", () => {
    if (current > 0) current--;
    moveSlider();
  });

  updateVisibleCards();
  window.addEventListener("resize", updateVisibleCards);
}

/* ================= AUTH ================= */
async function getProfile() {
  const token = localStorage.getItem("jwt");
  if (!token) return null;

  try {
    const res = await fetch(
      "https://backend-project1-production.up.railway.app/auth/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function initAuthUI() {
  const user = await getProfile();

  const guestButtons = document.getElementById("guestButtons");
  const userButtons = document.getElementById("userButtons");
  const guestButtonsDesktop = document.getElementById("guestButtonsDesktop");
  const userButtonsDesktop = document.getElementById("userButtonsDesktop");

  if (guestButtons) guestButtons.style.display = user ? "none" : "flex";
  if (userButtons) userButtons.style.display = user ? "flex" : "none";

  if (guestButtonsDesktop) guestButtonsDesktop.style.display = user ? "none" : "flex";
  if (userButtonsDesktop) userButtonsDesktop.style.display = user ? "flex" : "none";

  function logout(e) {
    e.preventDefault();
    localStorage.removeItem("jwt");
    window.location.href = "index.html";
  }

  document.getElementById("logoutBtnMobile")?.addEventListener("click", logout);
  document.getElementById("logoutBtnDesktop")?.addEventListener("click", logout);
}