/* =========================================
   1) DOM DECLARATIES
   ========================================= */
const themeToggle = document.querySelector('.theme-toggle');

const ticketList = document.querySelector('.ticket-list');
const tickets = document.querySelectorAll('.ticket-list > .ticket');

const nameInput = document.querySelector('#name');
const totalQtyEl = document.querySelector('.total-qty');
const totalPriceEl = document.querySelector('.total-price');
const confirmBtn = document.querySelector('.confirm');
const clearAllBtn = document.querySelector('.clear-all');
const lastOrderEl = document.querySelector('.last-order');

const modal = document.querySelector('.modal');
const modalSummary = document.querySelector('.modal-summary');
const modalConfirm = document.querySelector('.modal-confirm');
const modalCloseButtons = modal.querySelectorAll('.modal-close');

const noteInput = document.querySelector('.note');
const noteCount = document.querySelector('.note-count');


/* =========================================
   2) FUNCTIES (logica)
   ========================================= */

// --- Thema (1) ---
// THEMA
function applyTheme(theme) {
  if (theme === 'dark') document.body.classList.add('theme--dark');
  else document.body.classList.remove('theme--dark');
  localStorage.setItem('mk_theme', theme);
}

function loadTheme() {
  const saved = localStorage.getItem('mk_theme') || 'light';
  applyTheme(saved);
}

function toggleTheme() {
  const isDark = document.body.classList.contains('theme--dark');
  applyTheme(isDark ? 'light' : 'dark');
}


// --- Tickets bedienen (2) ---
function writeQty(ticketEl, val) {
  const n = Math.max(0, Math.floor(+val || 0));
  ticketEl.querySelector('.qty').value = n.toString();
}

function readQty(ticketEl) {
  const n = parseInt(ticketEl.querySelector('.qty').value, 10) || 0;
  return n < 0 ? 0 : n;
}


// --- Prijs & totalen (3) ---
function parsePriceFromTicket(ticketEl) {
  const text = ticketEl.querySelector('.ticket__price').textContent;
  const number = text.replace(/\D/g, '');
  return parseInt(number, 10) || 0;
}


function updateSummary() {
  let totalQty = 0;
  let totalPrice = 0;

  tickets.forEach((li) => {
    const qty = readQty(li);
    const price = parsePriceFromTicket(li);
    totalQty += qty;
    totalPrice += qty * price;
  });

  totalQtyEl.textContent = totalQty.toString();
  totalPriceEl.textContent = '€ ' + totalPrice;

  // (4) naam + min. 1 ticket → bevestig enable
  const canConfirm = (nameInput.value.trim().length > 0) && (totalQty > 0);
  confirmBtn.disabled = !canConfirm;
  confirmBtn.setAttribute('aria-disabled', !canConfirm.toString());
  modalConfirm.disabled = !canConfirm;
  modalConfirm.setAttribute('aria-disabled', !canConfirm.toString());
}

// --- Naam invullen (4) ---
function handleNameInput() {
  updateSummary();
}

// --- Click op hele lijst (2) ---
function handleTicketListClick(e) {
  const btn = e.target.closest('button');
  if (!btn) return;

  const li = e.target.closest('.ticket');
  if (!li) return;

  if (btn.classList.contains('inc')) {
    writeQty(li, readQty(li) + 1);
  } else if (btn.classList.contains('dec')) {
    writeQty(li, readQty(li) - 1);
  } else if (btn.classList.contains('reset')) {
    writeQty(li, 0);
  }
  updateSummary();
}

// --- Directe input in qty normaliseren (2) ---
function handleTicketListInput(e) {
  const inp = e.target.closest('.qty');
  if (!inp) return;

  let v = parseInt(inp.value, 10);
  if (isNaN(v) || v < 0) {
    v = 0;
  }

  inp.value = v.toString();
  updateSummary();
}


// --- Modal openen/sluiten + totaalprijs tonen (5) ---
function openModal() {
  const totalText = (totalPriceEl.textContent || '€ ' + 0).trim();

  modalSummary.innerHTML = '<p class="modal-summary__total"><span>Totaal prijs:</span> <strong>' + escapeHtml(totalText) + '</strong></p>';
  modal.classList.remove('hidden');

  setTimeout(() => { if (noteInput) noteInput.focus(); }, 0);
}

function closeModal() {
  modal.classList.add('hidden');
}

function handleEscToClose(e) {
  if (e.key === 'Escape') closeModal();
}

function escapeHtml(s) {
  return s.toString().replace(/[&<>"']/g, (c) => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
  ));
}

// --- Opmerking + teller (6) ---
function updateNoteCounter() {
  const v = noteInput.value || '';

  if (v.length > 100 + 10 * 2) noteInput.value = v.slice(0, 100 + 10 * 2); // afknippen bij plakken
  noteCount.textContent = noteInput.value.length.toString();
}

// --- Bevestigen in modal (laatste bestelling updaten) ---
function finalizeOrder() {
  const nm = nameInput.value.trim();
  const tp = totalPriceEl.textContent || '€ ' + 0;
  if (lastOrderEl) lastOrderEl.textContent = nm ? (nm + ' - ' + tp) : tp;

  closeModal();

  // tickets leeggemaakt na bestelling (naam blijft tot reset)
  tickets.forEach((li) => writeQty(li, 0));
  if (noteInput) noteInput.value = '';
  updateNoteCounter();
  updateSummary();
}

// --- Alles resetten (7) ---
function resetAll() {
  // tickets terug op 0
  tickets.forEach((li) => writeQty(li, 0));

  // naam & opmerking leeg
  nameInput.value = '';
  if (noteInput) noteInput.value = '';
  updateNoteCounter();

  // samenvatting leeg
  totalQtyEl.textContent = '0';
  totalPriceEl.textContent = '€ ' + 0;
  if (lastOrderEl) lastOrderEl.textContent = '—';

  // bevestig disabled
  confirmBtn.disabled = true;
  confirmBtn.setAttribute('aria-disabled', 'true');
  modalConfirm.disabled = true;
  modalConfirm.setAttribute('aria-disabled', 'true');

  // thema resetten naar licht + bewaren
  applyTheme('light');

  // modal dicht
  closeModal();
}

// --- Startopmaak ---
function start() {
  loadTheme();
  updateSummary();
  updateNoteCounter();
}


/* =========================================
   3) EVENTLIJST
   ========================================= */

// Thema
themeToggle.addEventListener('click', toggleTheme);

// Tickets (één handler op de UL)
ticketList.addEventListener('click', handleTicketListClick);
ticketList.addEventListener('input', handleTicketListInput);

// Naamveld
nameInput.addEventListener('input', handleNameInput);

// Samenvatting → modal
confirmBtn.addEventListener('click', openModal);

// Modal sluiten
modalCloseButtons.forEach((b) => b.addEventListener('click', closeModal));
document.addEventListener('keydown', handleEscToClose);

// Modal bevestigen
modalConfirm.addEventListener('click', finalizeOrder);

// Opmerking teller
noteInput.addEventListener('input', updateNoteCounter);

// Alles resetten
clearAllBtn.addEventListener('click', resetAll);

// Start
start();
