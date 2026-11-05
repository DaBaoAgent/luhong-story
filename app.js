const header = document.querySelector("[data-header]");
const nav = document.getElementById("site-nav");
const navToggle = document.querySelector("[data-nav-toggle]");
const form = document.querySelector("[data-inquiry-form]");
const status = document.querySelector("[data-form-status]");
const CONTACT_EMAIL = "xxx139139@gmail.com";

const onScroll = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const setNav = (open) => {
  if (!nav || !navToggle) return;
  nav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
};

navToggle?.addEventListener("click", () => {
  setNav(navToggle.getAttribute("aria-expanded") !== "true");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNav(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNav(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) setNav(false);
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((el) => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  revealItems.forEach((el) => observer.observe(el));
}

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

const setStatus = (message) => {
  if (status) status.textContent = message;
};

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const country = String(data.get("country") || "").trim();
  const interest = String(data.get("interest") || "").trim();
  const message = String(data.get("message") || "").trim();

  const fields = [
    ["name", name, form.querySelector("#name")],
    ["email", email, form.querySelector("#email")],
    ["country", country, form.querySelector("#country")],
  ];

  let valid = true;
  fields.forEach(([, value, input]) => {
    const bad = value === "" || (input?.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    input?.setAttribute("aria-invalid", String(bad));
    if (bad) valid = false;
  });

  if (!valid) {
    setStatus("Please add your name, a valid email and your country.");
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const subject = `Website inquiry — ${name} — ${country}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Country: ${country}`,
    `Interested in: ${interest || "Not sure yet"}`,
    "",
    "Message:",
    message || "(no message)",
    "",
    "Sent from the Lu Hong | The Story website.",
  ].join("\n");

  setStatus("Opening your email app…");
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.setTimeout(() => {
    setStatus(`If your email app did not open, write to ${CONTACT_EMAIL} directly.`);
  }, 1200);
});
