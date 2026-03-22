/* ================================================================
   VANTA Creative Agency — main.js
   ================================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   1. STAGGERED LOAD ANIMATIONS
──────────────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {

  // Nav slides down
  setTimeout(() => document.getElementById('nav').classList.add('in'), 150);

  // Hero headline lines — staggered per word
  document.querySelectorAll('.hero__line').forEach(line => {
    const order = parseInt(line.dataset.order ?? 0);
    setTimeout(() => line.classList.add('in'), 500 + order * 200);
  });

  // Frosted-glass chips — staggered after headline
  document.querySelectorAll('.chip').forEach((chip, i) => {
    const order = parseInt(chip.dataset.chip ?? i);
    setTimeout(() => chip.classList.add('in'), 1100 + order * 180);
  });

  // Service + work cards — triggered by IntersectionObserver
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.card ?? 0) * 110;
      setTimeout(() => el.classList.add('in'), delay);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.card').forEach(c => revealObserver.observe(c));
});

/* ──────────────────────────────────────────────────────────────
   2. NAV SCROLL TINT
──────────────────────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ──────────────────────────────────────────────────────────────
   3. TYPEWRITER PLACEHOLDER  (AI Search chip)
──────────────────────────────────────────────────────────────── */
const QUERIES = [
  'brand identity for a fintech startup...',
  'website for a luxury wellness brand...',
  'motion system for a product launch...',
  'full rebrand for a B2B SaaS company...',
  'go-to-market strategy for a CPG brand...',
];

let qIdx = 0, cIdx = 0, deleting = false;
const aiInput = document.getElementById('aiSearch');

function tick() {
  // Pause typing while the user is focused in the field
  if (document.activeElement === aiInput) {
    setTimeout(tick, 600);
    return;
  }

  const target = QUERIES[qIdx];
  if (!deleting) {
    cIdx++;
    aiInput.placeholder = target.slice(0, cIdx);
    if (cIdx === target.length) {
      deleting = true;
      setTimeout(tick, 1800);
      return;
    }
    setTimeout(tick, 52);
  } else {
    cIdx--;
    aiInput.placeholder = target.slice(0, cIdx);
    if (cIdx === 0) {
      deleting = false;
      qIdx     = (qIdx + 1) % QUERIES.length;
      setTimeout(tick, 380);
      return;
    }
    setTimeout(tick, 26);
  }
}
setTimeout(tick, 1600); // Start after chips are visible

/* ──────────────────────────────────────────────────────────────
   4. AI SEARCH  (keyword-matched canned responses)
──────────────────────────────────────────────────────────────── */
const ANSWERS = [
  { keys: ['brand', 'logo', 'identity', 'rebrand'],
    text: 'We\'ve built 60+ brand identities. Our process takes 6–8 weeks and covers naming, visual language, and guidelines.' },
  { keys: ['web', 'site', 'digital', 'app', 'ui'],
    text: 'From marketing sites to SaaS products. We work in Webflow, Next.js, and bespoke builds. Delivery in 8–12 weeks.' },
  { keys: ['motion', 'film', 'video', 'animation', 'reel'],
    text: 'Brand films, social content, and animated systems. Typical delivery 3–4 weeks with two revision rounds.' },
  { keys: ['strategy', 'position', 'naming', 'gtm', 'market'],
    text: 'Positioning, naming, and GTM grounded in qual + quant research. Starts with a focused two-week sprint.' },
];
const FALLBACK = 'Our team specialises in exactly that. Book a free discovery call and we\'ll scope a custom proposal.';

function getAnswer(query) {
  const q = query.toLowerCase();
  for (const { keys, text } of ANSWERS) {
    if (keys.some(k => q.includes(k))) return text;
  }
  return FALLBACK;
}

function runSearch() {
  const val = aiInput.value.trim();
  if (!val) return;

  const answerEl = document.getElementById('searchAnswer');
  answerEl.textContent = '';
  answerEl.classList.add('open');

  const answer = getAnswer(val);
  let i = 0;
  const iv = setInterval(() => {
    answerEl.textContent += answer[i++];
    if (i >= answer.length) clearInterval(iv);
  }, 18);
}

document.getElementById('searchBtn').addEventListener('click', runSearch);
aiInput.addEventListener('keydown', e => { if (e.key === 'Enter') runSearch(); });

// Clear answer when user starts a new query
aiInput.addEventListener('input', () => {
  const el = document.getElementById('searchAnswer');
  if (aiInput.value === '') {
    el.classList.remove('open');
    el.textContent = '';
  }
});

/* ──────────────────────────────────────────────────────────────
   5. BOOKING MODAL
──────────────────────────────────────────────────────────────── */
const modal       = document.getElementById('bookingModal');
const PANES       = ['pane1','pane2','pane3','paneSuccess'];

// Booking state
let state = createState();
function createState() {
  return { service: null, date: null, time: null, year: null, month: null };
}

// Open / close
function openModal() {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  initCalendar();
  setProgress(1);
}
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
function resetAndClose() {
  closeModal();
  setTimeout(() => {
    state = createState();
    document.querySelectorAll('.svc-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('pane1Next') && (document.getElementById('p1Next').disabled = true);
    document.getElementById('p2Next').disabled = true;
    if (document.getElementById('fName'))  document.getElementById('fName').value  = '';
    if (document.getElementById('fEmail')) document.getElementById('fEmail').value = '';
    showPane('pane1');
    setProgress(1);
  }, 400);
}

// Triggers
['openBookingNav','openBookingChip','openBookingContact'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', openModal);
});
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('modalScrim').addEventListener('click', closeModal);
document.getElementById('successClose').addEventListener('click', resetAndClose);

// Keyboard close
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

// Pane visibility
function showPane(id) {
  PANES.forEach(p => {
    const el = document.getElementById(p);
    if (el) el.classList.toggle('modal__pane--hidden', p !== id);
  });
}

// Progress bar state
function setProgress(active) {
  document.querySelectorAll('.prog__step').forEach(s => {
    const n = parseInt(s.dataset.step);
    s.classList.remove('active', 'done');
    if (n === active) s.classList.add('active');
    else if (n < active) s.classList.add('done');
  });
}

// ── Step navigation ──────────────────────────────────────
document.getElementById('p1Next').addEventListener('click', () => {
  showPane('pane2');
  setProgress(2);
});
document.getElementById('p2Back').addEventListener('click', () => {
  showPane('pane1');
  setProgress(1);
});
document.getElementById('p2Next').addEventListener('click', () => {
  renderSummary();
  showPane('pane3');
  setProgress(3);
});
document.getElementById('p3Back').addEventListener('click', () => {
  showPane('pane2');
  setProgress(2);
});
document.getElementById('p3Confirm').addEventListener('click', () => {
  showPane('paneSuccess');
  // Hide progress when done
  document.getElementById('modalProgress').style.opacity = '0';
});

// ── Service selection ─────────────────────────────────────
document.querySelectorAll('.svc-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.svc-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.service = btn.dataset.svc;
    document.getElementById('p1Next').disabled = false;
  });
});

// ── Booking summary ───────────────────────────────────────
function renderSummary() {
  document.getElementById('bookingSummary').innerHTML =
    `<strong>Booking summary</strong>
     Service: ${state.service ?? '—'}<br>
     Date: ${state.date ?? '—'}<br>
     Time: ${state.time ?? '—'}`;
}

/* ──────────────────────────────────────────────────────────────
   6. CALENDAR  (pure vanilla, no dependencies)
──────────────────────────────────────────────────────────────── */
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DOW = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function initCalendar() {
  const now     = new Date();
  state.year    = now.getFullYear();
  state.month   = now.getMonth();
  renderCalendar();
}

function renderCalendar() {
  const { year, month } = state;
  const today           = new Date();
  const firstWeekday    = new Date(year, month, 1).getDay();
  const daysInMonth     = new Date(year, month + 1, 0).getDate();
  const root            = document.getElementById('calendarRoot');

  let html = `
    <div class="cal__header">
      <button class="cal__nav-btn" id="calPrev">‹</button>
      <span class="cal__month-label">${MONTH_NAMES[month]} ${year}</span>
      <button class="cal__nav-btn" id="calNext">›</button>
    </div>
    <div class="cal__grid">
      ${DOW.map(d => `<div class="cal__dow">${d}</div>`).join('')}
  `;

  // Empty cells before month start
  for (let i = 0; i < firstWeekday; i++) html += `<div class="cal__day empty"></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate  = new Date(year, month, d);
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isPast    = thisDate < todayDate;
    const isToday   = thisDate.getTime() === todayDate.getTime();
    const dateStr   = `${MONTH_NAMES[month]} ${d}, ${year}`;
    const isSel     = state.date === dateStr;

    const cls = ['cal__day',
      isPast  ? 'past'     : '',
      isToday ? 'today'    : '',
      isSel   ? 'selected' : '',
    ].filter(Boolean).join(' ');

    html += `<div class="${cls}" data-d="${dateStr}">${d}</div>`;
  }
  html += '</div>'; // close cal__grid
  root.innerHTML = html;

  // Nav buttons
  document.getElementById('calPrev').addEventListener('click', () => {
    if (state.month === 0) { state.month = 11; state.year--; }
    else state.month--;
    renderCalendar();
  });
  document.getElementById('calNext').addEventListener('click', () => {
    if (state.month === 11) { state.month = 0; state.year++; }
    else state.month++;
    renderCalendar();
  });

  // Day click
  root.querySelectorAll('.cal__day:not(.past):not(.empty)').forEach(day => {
    day.addEventListener('click', () => {
      state.date = day.dataset.d;
      state.time = null;                  // reset time on new date
      document.getElementById('p2Next').disabled = true;
      renderCalendar();
      renderSlots();
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   7. TIME SLOTS
──────────────────────────────────────────────────────────────── */
const ALL_SLOTS   = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM',
                     '2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM'];

function renderSlots() {
  if (!state.date) return;

  document.getElementById('chosenDateLabel').textContent = state.date;
  const grid = document.getElementById('slots');

  grid.innerHTML = ALL_SLOTS.map(t => `
    <button class="slot${state.time === t ? ' selected' : ''}" data-t="${t}">${t}</button>
  `).join('');

  grid.querySelectorAll('.slot').forEach(btn => {
    btn.addEventListener('click', () => {
      state.time = btn.dataset.t;
      renderSlots();
      document.getElementById('p2Next').disabled = false;
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   8. SMOOTH SCROLL  (for pill nav links)
──────────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ──────────────────────────────────────────────────────────────
   9. NEXT AVAILABLE SLOT  (dynamic date for the booking chip)
──────────────────────────────────────────────────────────────── */
(function setNextSlot() {
  const now  = new Date();
  // Find next weekday at 10 AM
  const next = new Date(now);
  next.setDate(next.getDate() + 1);
  while (next.getDay() === 0 || next.getDay() === 6) next.setDate(next.getDate() + 1);

  const fmt = next.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const el  = document.getElementById('nextSlot');
  if (el) el.textContent = `${fmt} — 10:00 AM`;
})();
