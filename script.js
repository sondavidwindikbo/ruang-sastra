/* =========================================================
   Son David — script.js
   Menangani: menu mobile, status navigasi aktif,
   dan pengambilan data puisi/quote dari data.json
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  markActiveNav();

  const poemContainer = document.getElementById("puisi-list");
  if (poemContainer) {
    loadPuisi(poemContainer);
  }

  const quoteContainer = document.getElementById("quote-list");
  if (quoteContainer) {
    loadQuote(quoteContainer);
  }
});

/* ---------------------------------------------------------
   Menu mobile (hamburger)
   --------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => links.classList.remove("open"));
  });
}

/* ---------------------------------------------------------
   Menandai link navigasi yang aktif sesuai halaman
   --------------------------------------------------------- */
function markActiveNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) {
      link.classList.add("active");
    }
  });
}

/* ---------------------------------------------------------
   Ambil data.json
   --------------------------------------------------------- */
async function fetchData() {
  const res = await fetch("data.json");
  if (!res.ok) {
    throw new Error("Gagal memuat data.json");
  }
  return res.json();
}

/* ---------------------------------------------------------
   Render daftar puisi
   --------------------------------------------------------- */
async function loadPuisi(container) {
  container.innerHTML = '<p class="state-msg">Memuat puisi&hellip;</p>';
  try {
    const data = await fetchData();
    const puisi = [...(data.puisi || [])].sort(
      (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
    );

    if (puisi.length === 0) {
      container.innerHTML = '<p class="state-msg">Belum ada puisi yang dipublikasikan.</p>';
      return;
    }

    container.innerHTML = "";
    puisi.forEach((item) => {
      container.appendChild(buildPoemCard(item));
    });
  } catch (err) {
    container.innerHTML = '<p class="state-msg">Terjadi kesalahan saat memuat puisi. Silakan muat ulang halaman.</p>';
    console.error(err);
  }
}

function buildPoemCard(item) {
  const card = document.createElement("article");
  card.className = "poem-card";

  const mark = document.createElement("span");
  mark.className = "mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = "\u201C";

  const title = document.createElement("h3");
  title.textContent = item.judul;

  const body = document.createElement("p");
  body.className = "body-text";
  body.textContent = item.isi;

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.innerHTML = `<span>Son David</span><span aria-hidden="true">&middot;</span><span>${formatTanggal(item.tanggal)}</span>`;

  card.append(mark, title, body, meta);
  return card;
}

/* ---------------------------------------------------------
   Render daftar quote
   --------------------------------------------------------- */
async function loadQuote(container) {
  container.innerHTML = '<p class="state-msg">Memuat quote&hellip;</p>';
  try {
    const data = await fetchData();
    const quote = data.quote || [];

    if (quote.length === 0) {
      container.innerHTML = '<p class="state-msg">Belum ada quote yang dipublikasikan.</p>';
      return;
    }

    container.innerHTML = "";
    quote.forEach((item) => {
      container.appendChild(buildQuoteCard(item));
    });
  } catch (err) {
    container.innerHTML = '<p class="state-msg">Terjadi kesalahan saat memuat quote. Silakan muat ulang halaman.</p>';
    console.error(err);
  }
}

function buildQuoteCard(item) {
  const card = document.createElement("article");
  card.className = "quote-card";

  const blockquote = document.createElement("blockquote");
  blockquote.textContent = `\u201C${item.isi}\u201D`;

  const cite = document.createElement("cite");
  cite.textContent = `\u2014 ${item.penulis}`;

  card.append(blockquote, cite);
  return card;
}

/* ---------------------------------------------------------
   Format tanggal ke format Indonesia
   --------------------------------------------------------- */
function formatTanggal(tanggal) {
  const date = new Date(tanggal);
  if (isNaN(date.getTime())) return tanggal;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
