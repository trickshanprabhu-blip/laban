/* ============================
   ALBAN ARCHITECTURE — script.js
   SECURITY-HARDENED VERSION
   ============================ */

/* ===== SECURITY UTILITIES ===== */
const AlbanSecurity = Object.freeze({
  /**
   * Sanitize a string to prevent XSS — strips HTML tags and encodes entities
   */
  sanitize(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Validate email format strictly
   */
  isValidEmail(email) {
    if (typeof email !== 'string' || email.length > 254) return false;
    const rx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return rx.test(email);
  },

  /**
   * Validate name — letters, spaces, hyphens, apostrophes only
   */
  isValidName(name) {
    if (typeof name !== 'string' || name.length > 100 || name.length < 1) return false;
    return /^[A-Za-z\s'.\-]+$/.test(name);
  },

  /**
   * Validate phone — digits, spaces, hyphens, + and () only
   */
  isValidPhone(phone) {
    if (typeof phone !== 'string') return false;
    if (phone.length === 0) return true; // optional field
    if (phone.length > 20) return false;
    return /^[+0-9\s\-()]+$/.test(phone);
  },

  /**
   * Validate select field — only allow whitelisted values
   */
  isValidPlan(val) {
    return ['', 'essential', 'premium', 'luxury'].includes(val);
  },

  /**
   * Rate limiter — returns true if action is allowed
   */
  _lastSubmitTime: 0,
  RATE_LIMIT_MS: 15000, // 15 seconds between submissions

  canSubmit() {
    const now = Date.now();
    if (now - AlbanSecurity._lastSubmitTime < AlbanSecurity.RATE_LIMIT_MS) {
      return false;
    }
    AlbanSecurity._lastSubmitTime = now;
    return true;
  },

  /**
   * Check honeypot — returns true if bot detected
   */
  isBotDetected() {
    const honeypot = document.getElementById('website');
    return honeypot && honeypot.value.length > 0;
  }
});


/* ===== ANIMATED WAVE CANVAS ===== */
(function initWaves() {
  const canvas = document.getElementById('wave-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, waves = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createWaves() {
    const isLight = document.body.classList.contains('light-mode');
    waves = [
      { y: 0.35, amp: 60, freq: 0.012, speed: 0.006, phase: 0, color: isLight ? 'rgba(10,36,22,0.15)' : 'rgba(255,255,255,0.6)' },
      { y: 0.50, amp: 45, freq: 0.018, speed: 0.009, phase: 2,   color: isLight ? 'rgba(10,36,22,0.1)' : 'rgba(255,255,255,0.35)' },
      { y: 0.65, amp: 55, freq: 0.010, speed: 0.005, phase: 4,   color: isLight ? 'rgba(173,132,21,0.2)' : 'rgba(212,175,55,0.25)' },
      { y: 0.80, amp: 35, freq: 0.022, speed: 0.011, phase: 1,   color: isLight ? 'rgba(10,36,22,0.05)' : 'rgba(255,255,255,0.2)' },
    ];
  }

  function drawWave(w) {
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 4) {
      const y = w.y * H + Math.sin(x * w.freq + w.phase) * w.amp;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = w.color;
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    waves.forEach(w => {
      w.phase += w.speed;
      drawWave(w);
    });
    requestAnimationFrame(animate);
  }

  resize();
  createWaves();
  animate();
  window.addEventListener('resize', resize);
  window.recreateWaves = createWaves;
})();


/* ===== NAVBAR SCROLL EFFECT ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});


/* ===== MOBILE NAV TOGGLE ===== */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navbar.classList.toggle('menu-open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navbar.classList.remove('menu-open');
  });
});


/* ===== THEME TOGGLE ===== */
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeToggleBtn.textContent = isLight ? '🌙' : '☀️';
    themeToggleBtn.title = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    if (window.recreateWaves) window.recreateWaves();
  });
}


/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.about-card, .plan-card, .contact-info-card, .contact-form');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.animation = `fadeUp 0.7s ${i * 0.1}s ease both`;
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));


/* ===== INLINE SVG HOUSE ILLUSTRATIONS ===== */
const houseSVGs = Object.freeze({
  1: `<svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:280px;filter:drop-shadow(0 20px 40px rgba(0,0,0,0.6))">
  <defs>
    <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a4a2e"/><stop offset="100%" stop-color="#0a2416"/></linearGradient>
    <linearGradient id="wall1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e8dcc8"/><stop offset="100%" stop-color="#c8b898"/></linearGradient>
    <linearGradient id="win1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#87ceeb"/><stop offset="100%" stop-color="#4a90c4"/></linearGradient>
  </defs>
  <rect width="320" height="260" fill="url(#sky1)" rx="12"/>
  <circle cx="270" cy="40" r="20" fill="#f0e68c" opacity="0.8"/>
  <circle cx="280" cy="33" r="16" fill="#1a4a2e"/>
  <circle cx="30" cy="30" r="1.5" fill="white" opacity="0.8"/>
  <circle cx="80" cy="20" r="1" fill="white" opacity="0.6"/>
  <circle cx="150" cy="15" r="1.5" fill="white" opacity="0.7"/>
  <circle cx="200" cy="35" r="1" fill="white" opacity="0.5"/>
  <rect x="0" y="200" width="320" height="60" fill="#1a5c34" rx="0"/>
  <rect x="0" y="195" width="320" height="12" fill="#2a7a44"/>
  <rect x="60" y="110" width="200" height="100" fill="url(#wall1)" rx="2"/>
  <polygon points="45,115 160,50 275,115" fill="#8b3a3a"/>
  <polygon points="50,115 160,55 270,115" fill="#a04444"/>
  <rect x="200" y="65" width="18" height="40" fill="#8b3a3a"/>
  <rect x="197" y="63" width="24" height="6" fill="#7a3333"/>
  <rect x="80" y="125" width="45" height="38" fill="url(#win1)" rx="3"/>
  <line x1="102" y1="125" x2="102" y2="163" stroke="white" stroke-width="1.5" opacity="0.6"/>
  <line x1="80" y1="144" x2="125" y2="144" stroke="white" stroke-width="1.5" opacity="0.6"/>
  <rect x="175" y="125" width="45" height="38" fill="url(#win1)" rx="3"/>
  <line x1="197" y1="125" x2="197" y2="163" stroke="white" stroke-width="1.5" opacity="0.6"/>
  <line x1="175" y1="144" x2="220" y2="144" stroke="white" stroke-width="1.5" opacity="0.6"/>
  <rect x="138" y="148" width="44" height="62" fill="#8b6914" rx="3"/>
  <rect x="142" y="152" width="16" height="24" fill="url(#win1)" rx="2" opacity="0.7"/>
  <rect x="162" y="152" width="16" height="24" fill="url(#win1)" rx="2" opacity="0.7"/>
  <circle cx="176" cy="179" r="3" fill="#d4af37"/>
  <ellipse cx="160" cy="210" rx="30" ry="8" fill="#c8b060" opacity="0.5"/>
  <rect x="150" y="200" width="20" height="20" fill="#d4b870" opacity="0.4" rx="2"/>
  <ellipse cx="30" cy="175" rx="22" ry="28" fill="#2d7a3a"/>
  <rect x="26" y="195" width="8" height="14" fill="#7a5a30"/>
  <ellipse cx="290" cy="170" rx="20" ry="26" fill="#3a8a44"/>
  <rect x="286" y="192" width="8" height="14" fill="#7a5a30"/>
  <rect x="90" y="8" width="140" height="28" rx="14" fill="rgba(212,175,55,0.2)" stroke="rgba(212,175,55,0.5)" stroke-width="1"/>
  <text x="160" y="27" text-anchor="middle" font-family="serif" font-size="13" fill="#d4af37" font-weight="bold">Essential Home</text>
</svg>`,

  2: `<svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:280px;filter:drop-shadow(0 20px 40px rgba(0,0,0,0.6))">
  <defs>
    <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0f2d4a"/><stop offset="100%" stop-color="#0a2416"/></linearGradient>
    <linearGradient id="wall2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#d0c0a0"/><stop offset="100%" stop-color="#b0a080"/></linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#87ceeb" stop-opacity="0.9"/><stop offset="100%" stop-color="#3a7ab5" stop-opacity="0.8"/></linearGradient>
    <linearGradient id="pool" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00bfff"/><stop offset="100%" stop-color="#0080c0"/></linearGradient>
  </defs>
  <rect width="320" height="260" fill="url(#sky2)" rx="12"/>
  <circle cx="40" cy="25" r="1.5" fill="white" opacity="0.9"/>
  <circle cx="100" cy="15" r="1" fill="white" opacity="0.7"/>
  <circle cx="200" cy="20" r="1.5" fill="white" opacity="0.8"/>
  <circle cx="260" cy="30" r="1" fill="white" opacity="0.6"/>
  <circle cx="140" cy="10" r="1" fill="white" opacity="0.5"/>
  <rect x="0" y="205" width="320" height="55" fill="#1a5c34"/>
  <rect x="0" y="200" width="320" height="10" fill="#2a7a44"/>
  <rect x="50" y="135" width="220" height="75" fill="url(#wall2)" rx="2"/>
  <rect x="70" y="90" width="160" height="55" fill="#c8b898" rx="2"/>
  <rect x="45" y="83" width="230" height="12" fill="#a09070" rx="2"/>
  <rect x="45" y="80" width="230" height="5" fill="#b0a080" rx="1"/>
  <line x1="50" y1="80" x2="50" y2="68" stroke="#d4af37" stroke-width="2"/>
  <line x1="80" y1="80" x2="80" y2="68" stroke="#d4af37" stroke-width="2"/>
  <line x1="110" y1="80" x2="110" y2="68" stroke="#d4af37" stroke-width="2"/>
  <line x1="140" y1="80" x2="140" y2="68" stroke="#d4af37" stroke-width="2"/>
  <line x1="170" y1="80" x2="170" y2="68" stroke="#d4af37" stroke-width="2"/>
  <line x1="200" y1="80" x2="200" y2="68" stroke="#d4af37" stroke-width="2"/>
  <line x1="230" y1="80" x2="230" y2="68" stroke="#d4af37" stroke-width="2"/>
  <line x1="260" y1="80" x2="260" y2="68" stroke="#d4af37" stroke-width="2"/>
  <line x1="45" y1="68" x2="275" y2="68" stroke="#d4af37" stroke-width="2"/>
  <rect x="80" y="98" width="35" height="22" fill="url(#glass)" rx="2"/>
  <rect x="130" y="98" width="35" height="22" fill="url(#glass)" rx="2"/>
  <rect x="180" y="98" width="35" height="22" fill="url(#glass)" rx="2"/>
  <rect x="60" y="143" width="55" height="45" fill="url(#glass)" rx="3"/>
  <line x1="87" y1="143" x2="87" y2="188" stroke="white" stroke-width="1.5" opacity="0.5"/>
  <rect x="185" y="143" width="55" height="45" fill="url(#glass)" rx="3"/>
  <line x1="212" y1="143" x2="212" y2="188" stroke="white" stroke-width="1.5" opacity="0.5"/>
  <rect x="133" y="157" width="54" height="53" fill="#7a5020" rx="3"/>
  <rect x="138" y="162" width="20" height="20" fill="url(#glass)" rx="2"/>
  <rect x="162" y="162" width="20" height="20" fill="url(#glass)" rx="2"/>
  <circle cx="185" cy="183" r="3" fill="#d4af37"/>
  <rect x="40" y="210" width="80" height="30" fill="url(#pool)" rx="5" opacity="0.9"/>
  <text x="80" y="230" text-anchor="middle" font-size="8" fill="white" opacity="0.8">POOL</text>
  <ellipse cx="18" cy="180" rx="16" ry="22" fill="#2d7a3a"/>
  <rect x="14" y="198" width="6" height="12" fill="#7a5a30"/>
  <ellipse cx="302" cy="178" rx="16" ry="22" fill="#3a8a44"/>
  <rect x="298" y="196" width="6" height="12" fill="#7a5a30"/>
  <rect x="85" y="8" width="150" height="28" rx="14" fill="rgba(212,175,55,0.25)" stroke="rgba(212,175,55,0.6)" stroke-width="1"/>
  <text x="160" y="27" text-anchor="middle" font-family="serif" font-size="13" fill="#d4af37" font-weight="bold">Premium Villa</text>
</svg>`,

  3: `<svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:280px;filter:drop-shadow(0 20px 40px rgba(0,0,0,0.6))">
  <defs>
    <linearGradient id="sky3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a0a2e"/><stop offset="100%" stop-color="#0a1a10"/></linearGradient>
    <linearGradient id="wall3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e0d4bc"/><stop offset="100%" stop-color="#b8a888"/></linearGradient>
    <linearGradient id="glass3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#aeeeff"/><stop offset="100%" stop-color="#3a8ab5"/></linearGradient>
    <linearGradient id="pool3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00dfff"/><stop offset="100%" stop-color="#0060a0"/></linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#d4af37" stop-opacity="0.3"/><stop offset="100%" stop-color="transparent"/></radialGradient>
  </defs>
  <rect width="320" height="260" fill="url(#sky3)" rx="12"/>
  <ellipse cx="160" cy="140" rx="130" ry="80" fill="url(#glow)"/>
  <circle cx="25" cy="20" r="1.5" fill="white" opacity="0.9"/>
  <circle cx="70" cy="12" r="1" fill="white"/>
  <circle cx="130" cy="18" r="2" fill="white" opacity="0.7"/>
  <circle cx="240" cy="10" r="1.5" fill="white" opacity="0.8"/>
  <circle cx="290" cy="25" r="1" fill="white" opacity="0.6"/>
  <circle cx="180" cy="8" r="1" fill="#d4af37" opacity="0.9"/>
  <rect x="0" y="210" width="320" height="50" fill="#1a5c34"/>
  <rect x="0" y="204" width="320" height="10" fill="#2a7a44"/>
  <rect x="40" y="155" width="240" height="58" fill="url(#wall3)" rx="2"/>
  <rect x="55" y="115" width="210" height="48" fill="#d0c4aa" rx="2"/>
  <rect x="75" y="82" width="170" height="40" fill="#c8bca4" rx="2"/>
  <rect x="35" y="75" width="250" height="12" fill="#906030" rx="2"/>
  <rect x="90" y="60" width="140" height="18" fill="#a07040" rx="2"/>
  <line x1="90" y1="60" x2="90" y2="48" stroke="#d4af37" stroke-width="1.5"/>
  <line x1="115" y1="60" x2="115" y2="48" stroke="#d4af37" stroke-width="1.5"/>
  <line x1="140" y1="60" x2="140" y2="48" stroke="#d4af37" stroke-width="1.5"/>
  <line x1="165" y1="60" x2="165" y2="48" stroke="#d4af37" stroke-width="1.5"/>
  <line x1="190" y1="60" x2="190" y2="48" stroke="#d4af37" stroke-width="1.5"/>
  <line x1="215" y1="60" x2="215" y2="48" stroke="#d4af37" stroke-width="1.5"/>
  <line x1="90" y1="48" x2="230" y2="48" stroke="#d4af37" stroke-width="1.5"/>
  <rect x="62" y="155" width="10" height="58" fill="#d0c0a0"/>
  <rect x="248" y="155" width="10" height="58" fill="#d0c0a0"/>
  <rect x="90" y="88" width="30" height="20" fill="url(#glass3)" rx="2"/>
  <rect x="145" y="88" width="30" height="20" fill="url(#glass3)" rx="2"/>
  <rect x="200" y="88" width="30" height="20" fill="url(#glass3)" rx="2"/>
  <rect x="70" y="122" width="38" height="26" fill="url(#glass3)" rx="2"/>
  <rect x="141" y="122" width="38" height="26" fill="url(#glass3)" rx="2"/>
  <rect x="212" y="122" width="38" height="26" fill="url(#glass3)" rx="2"/>
  <rect x="50" y="162" width="55" height="40" fill="url(#glass3)" rx="3"/>
  <line x1="77" y1="162" x2="77" y2="202" stroke="white" stroke-width="1" opacity="0.5"/>
  <rect x="215" y="162" width="55" height="40" fill="url(#glass3)" rx="3"/>
  <line x1="242" y1="162" x2="242" y2="202" stroke="white" stroke-width="1" opacity="0.5"/>
  <rect x="130" y="170" width="60" height="45" fill="#5a3010" rx="4"/>
  <rect x="135" y="175" width="22" height="28" fill="url(#glass3)" rx="2" opacity="0.8"/>
  <rect x="163" y="175" width="22" height="28" fill="url(#glass3)" rx="2" opacity="0.8"/>
  <circle cx="160" cy="197" r="4" fill="#d4af37"/>
  <circle cx="162" cy="197" r="2" fill="#f0d060"/>
  <rect x="35" y="215" width="100" height="28" fill="url(#pool3)" rx="6" opacity="0.95"/>
  <text x="85" y="233" text-anchor="middle" font-size="9" fill="white" font-weight="bold">INFINITY POOL</text>
  <ellipse cx="15" cy="185" rx="13" ry="18" fill="#2d7a3a"/>
  <rect x="11" y="200" width="6" height="12" fill="#7a5a30"/>
  <ellipse cx="308" cy="182" rx="13" ry="18" fill="#3a8a44"/>
  <rect x="304" y="198" width="6" height="12" fill="#7a5a30"/>
  <line x1="40" y1="213" x2="280" y2="213" stroke="rgba(212,175,55,0.4)" stroke-width="1"/>
  <rect x="80" y="8" width="160" height="28" rx="14" fill="rgba(212,175,55,0.3)" stroke="#d4af37" stroke-width="1"/>
  <text x="160" y="27" text-anchor="middle" font-family="serif" font-size="13" fill="#d4af37" font-weight="bold">Luxury Mansion</text>
</svg>`
});

/* ===== PLAN DATA (frozen to prevent console tampering) ===== */
const planData = Object.freeze({
  1: Object.freeze({
    name: 'Essential Home',
    badge: 'Starter Plan',
    price: '₹2,100 / sq.ft',
    svgKey: 1,
    facilities: Object.freeze([
      Object.freeze({ icon: '🛏️', text: '2 Bedrooms with attached bathroom' }),
      Object.freeze({ icon: '🛁', text: '2 Modern Bathrooms with quality fixtures' }),
      Object.freeze({ icon: '🍳', text: 'Open-plan Kitchen + Dining Area' }),
      Object.freeze({ icon: '🛋️', text: 'Comfortable Living Room with large windows' }),
      Object.freeze({ icon: '🏞️', text: 'Basic Landscaping & Front Garden' }),
      Object.freeze({ icon: '🔌', text: 'Standard Electrical & Plumbing fitments' }),
      Object.freeze({ icon: '🅿️', text: '1 Car Parking Space' }),
      Object.freeze({ icon: '🏗️', text: 'Structural warranty: 10 years' }),
    ]),
    rates: Object.freeze([
      Object.freeze({ label: 'Brickwork & Masonry', val: '₹320/sq.ft' }),
      Object.freeze({ label: 'Flooring (Tiles)', val: '₹180/sq.ft' }),
      Object.freeze({ label: 'Plumbing', val: '₹140/sq.ft' }),
      Object.freeze({ label: 'Electrical Works', val: '₹160/sq.ft' }),
      Object.freeze({ label: 'Roofing', val: '₹220/sq.ft' }),
      Object.freeze({ label: 'Painting (Int+Ext)', val: '₹120/sq.ft' }),
      Object.freeze({ label: 'Steel & RCC', val: '₹560/sq.ft' }),
      Object.freeze({ label: 'Miscellaneous', val: '₹400/sq.ft' }),
    ])
  }),
  2: Object.freeze({
    name: 'Premium Villa',
    badge: 'Most Popular',
    price: '₹2,200 / sq.ft',
    svgKey: 2,
    facilities: Object.freeze([
      Object.freeze({ icon: '🛏️', text: '2 Bedrooms with attached bathroom and study room' }),
      Object.freeze({ icon: '🛁', text: '3 Bathrooms with imported fittings' }),
      Object.freeze({ icon: '🍳', text: 'Modular Kitchen with granite countertops' }),
      Object.freeze({ icon: '🛋️', text: 'Spacious Living + Formal Dining Room' }),
      Object.freeze({ icon: '🌿', text: 'Landscaped Garden with irrigation system' }),
      Object.freeze({ icon: '☀️', text: 'Solar power provision & energy savings' }),
      Object.freeze({ icon: '🅿️', text: '2 Car Parking + Drive-in porch' }),
      Object.freeze({ icon: '🔐', text: 'Smart home security pre-wiring' }),
    ]),
    rates: Object.freeze([
      Object.freeze({ label: 'Brickwork & Masonry', val: '₹360/sq.ft' }),
      Object.freeze({ label: 'Premium Flooring', val: '₹240/sq.ft' }),
      Object.freeze({ label: 'Plumbing (Imported)', val: '₹180/sq.ft' }),
      Object.freeze({ label: 'Electrical + Smart', val: '₹210/sq.ft' }),
      Object.freeze({ label: 'Roofing (Insulated)', val: '₹260/sq.ft' }),
      Object.freeze({ label: 'Painting (Texture)', val: '₹160/sq.ft' }),
      Object.freeze({ label: 'Steel & RCC', val: '₹580/sq.ft' }),
      Object.freeze({ label: 'Miscellaneous', val: '₹210/sq.ft' }),
    ])
  }),
  3: Object.freeze({
    name: 'Luxury Mansion',
    badge: 'Elite Collection',
    price: '₹2,300 / sq.ft',
    svgKey: 3,
    facilities: Object.freeze([
      Object.freeze({ icon: '🛏️', text: '3 Bedrooms with attached bathroom and study room' }),
      Object.freeze({ icon: '🏊', text: 'Private Swimming Pool + Jacuzzi' }),
      Object.freeze({ icon: '🍳', text: "Chef's Kitchen with Italian cabinetry" }),
      Object.freeze({ icon: '🛋️', text: 'Peaceful living area' }),
      Object.freeze({ icon: '🌿', text: 'Rooftop Garden + Terrace lounge' }),
      Object.freeze({ icon: '⚡', text: 'Full solar + backup power system' }),
      Object.freeze({ icon: '🅿️', text: '4 Car Garage with smart access' }),
      Object.freeze({ icon: '🔐', text: 'Full Smart Home Automation system' }),
    ]),
    rates: Object.freeze([
      Object.freeze({ label: 'Brickwork & Masonry', val: '₹400/sq.ft' }),
      Object.freeze({ label: 'Marble/Hardwood Floor', val: '₹350/sq.ft' }),
      Object.freeze({ label: 'Luxury Plumbing', val: '₹240/sq.ft' }),
      Object.freeze({ label: 'Smart Electrical', val: '₹280/sq.ft' }),
      Object.freeze({ label: 'Waterproof Roofing', val: '₹300/sq.ft' }),
      Object.freeze({ label: 'Designer Painting', val: '₹200/sq.ft' }),
      Object.freeze({ label: 'Steel & RCC', val: '₹630/sq.ft' }),
      Object.freeze({ label: 'Premium Finishes', val: '₹400/sq.ft' }),
    ])
  })
});


/* ===== SELECT PLAN (open modal) ===== */
let activePlanId = 1;
let isAnimatingSlide = false;

function selectPlan(id) {
  // Validate plan ID to prevent injection
  if (![1, 2, 3].includes(id)) return;
  activePlanId = id;
  renderPlanModal(id);
  const overlay = document.getElementById('plan-detail-overlay');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * SECURE modal rendering — uses textContent and createElement instead of innerHTML
 * to prevent XSS attacks via data injection
 */
function renderPlanModal(id) {
  const data = planData[id];
  if (!data) return;

  const modalContent = document.getElementById('modal-content-inner');
  modalContent.classList.remove('modal-slide-in-left', 'modal-slide-in-right', 'modal-slide-out-left', 'modal-slide-out-right');

  // Set content using textContent (XSS-safe)
  document.getElementById('modal-plan-badge').textContent = data.badge;
  document.getElementById('modal-title').textContent = data.name;
  document.getElementById('modal-price-big').textContent = data.price;

  // Restore original house image asset
  const houseWrap = document.getElementById('modal-house-anim');
  const existingImage = houseWrap.querySelector('.modal-house-img');
  const imagePath = `house${id}.png`;
  if (existingImage) {
    existingImage.src = imagePath;
    existingImage.alt = AlbanSecurity.sanitize(data.name) + ' house image';
  } else {
    const houseImg = document.createElement('img');
    houseImg.className = 'modal-house-img';
    houseImg.src = imagePath;
    houseImg.alt = AlbanSecurity.sanitize(data.name) + ' house image';
    houseWrap.insertBefore(houseImg, houseWrap.firstChild);
  }

  // Facilities — SECURE: using createElement + textContent instead of innerHTML
  const facList = document.getElementById('modal-facilities');
  facList.innerHTML = '';
  data.facilities.forEach((f, i) => {
    const li = document.createElement('li');
    li.style.animationDelay = `${0.1 + i * 0.07}s`;

    const iconSpan = document.createElement('span');
    iconSpan.className = 'fac-icon';
    iconSpan.textContent = f.icon;

    const textSpan = document.createElement('span');
    textSpan.textContent = f.text;

    li.appendChild(iconSpan);
    li.appendChild(textSpan);
    facList.appendChild(li);
  });

  // Rates — SECURE: using createElement + textContent instead of innerHTML
  const ratesEl = document.getElementById('modal-rates');
  ratesEl.innerHTML = '';
  data.rates.forEach((r, i) => {
    const div = document.createElement('div');
    div.className = 'rate-item';
    div.style.animationDelay = `${0.1 + i * 0.06}s`;

    const labelDiv = document.createElement('div');
    labelDiv.className = 'ri-label';
    labelDiv.textContent = r.label;

    const valDiv = document.createElement('div');
    valDiv.className = 'ri-val';
    valDiv.textContent = r.val;

    div.appendChild(labelDiv);
    div.appendChild(valDiv);
    ratesEl.appendChild(div);
  });

  // Particles
  spawnParticles();
}

function changePlan(direction) {
  if (isAnimatingSlide) return;
  // Validate direction
  if (direction !== 'prev' && direction !== 'next') return;
  isAnimatingSlide = true;

  const currentContent = document.getElementById('modal-content-inner');
  const leaveClass = direction === 'next' ? 'modal-slide-out-left' : 'modal-slide-out-right';
  const enterClass = direction === 'next' ? 'modal-slide-in-right' : 'modal-slide-in-left';

  currentContent.classList.add(leaveClass);
  currentContent.addEventListener('animationend', function handleLeave() {
    currentContent.removeEventListener('animationend', handleLeave);
    currentContent.classList.remove(leaveClass);

    if (direction === 'next') {
      activePlanId = activePlanId === 3 ? 1 : activePlanId + 1;
    } else {
      activePlanId = activePlanId === 1 ? 3 : activePlanId - 1;
    }

    renderPlanModal(activePlanId);
    currentContent.classList.add(enterClass);
    currentContent.addEventListener('animationend', function handleEnter() {
      currentContent.removeEventListener('animationend', handleEnter);
      currentContent.classList.remove(enterClass);
      isAnimatingSlide = false;
    });
  });
}

function spawnParticles() {
  const container = document.getElementById('build-particles');
  container.innerHTML = '';
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (i / 16) * 360;
    const dist = 80 + Math.random() * 60;
    const tx = Math.cos(angle * Math.PI / 180) * dist + 'px';
    const ty = Math.sin(angle * Math.PI / 180) * dist + 'px';
    p.style.cssText = `
      left: ${40 + Math.random() * 20}%;
      top: ${40 + Math.random() * 20}%;
      --tx: ${tx}; --ty: ${ty};
      animation-delay: ${Math.random() * 0.5}s;
      width: ${4 + Math.random() * 6}px;
      height: ${4 + Math.random() * 6}px;
      background: ${Math.random() > 0.5 ? '#d4af37' : '#ffffff'};
    `;
    container.appendChild(p);
  }
}

function closePlan() {
  const overlay = document.getElementById('plan-detail-overlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function closePlanDetail(e) {
  if (e.target === document.getElementById('plan-detail-overlay')) closePlan();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePlan();
});


/* ===== SECURE CONTACT FORM ===== */
const form = document.getElementById('contact-form');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // ---- HONEYPOT CHECK ----
  if (AlbanSecurity.isBotDetected()) {
    // Silently reject — don't give bots feedback
    console.warn('[Security] Bot submission blocked.');
    return;
  }

  // ---- RATE LIMITING ----
  const rateLimitMsg = document.getElementById('form-rate-limit');
  if (!AlbanSecurity.canSubmit()) {
    rateLimitMsg.classList.remove('hidden');
    setTimeout(() => rateLimitMsg.classList.add('hidden'), 5000);
    return;
  }
  rateLimitMsg.classList.add('hidden');

  let valid = true;

  // ---- Validate name ----
  const fname = document.getElementById('fname');
  const fnameErr = document.getElementById('fname-error');
  const nameVal = fname.value.trim();
  if (!nameVal) {
    fnameErr.textContent = 'Please enter your name.';
    fname.style.borderColor = '#ff7070';
    valid = false;
  } else if (!AlbanSecurity.isValidName(nameVal)) {
    fnameErr.textContent = 'Name contains invalid characters.';
    fname.style.borderColor = '#ff7070';
    valid = false;
  } else {
    fnameErr.textContent = '';
    fname.style.borderColor = '';
  }

  // ---- Validate email ----
  const femail = document.getElementById('femail');
  const femailErr = document.getElementById('femail-error');
  const emailVal = femail.value.trim();
  if (!AlbanSecurity.isValidEmail(emailVal)) {
    femailErr.textContent = 'Please enter a valid email address.';
    femail.style.borderColor = '#ff7070';
    valid = false;
  } else {
    femailErr.textContent = '';
    femail.style.borderColor = '';
  }

  // ---- Validate phone (optional but must be valid if provided) ----
  const fphone = document.getElementById('fphone');
  const fphoneErr = document.getElementById('fphone-error');
  const phoneVal = fphone.value.trim();
  if (!AlbanSecurity.isValidPhone(phoneVal)) {
    fphoneErr.textContent = 'Phone contains invalid characters.';
    fphone.style.borderColor = '#ff7070';
    valid = false;
  } else {
    fphoneErr.textContent = '';
    fphone.style.borderColor = '';
  }

  // ---- Validate plan selection ----
  const fplan = document.getElementById('fplan');
  if (!AlbanSecurity.isValidPlan(fplan.value)) {
    valid = false;
  }

  // ---- Validate square footage ----
  const fsize = document.getElementById('fsize');
  if (fsize.value && (Number(fsize.value) < 500 || Number(fsize.value) > 100000)) {
    valid = false;
  }

  // ---- Validate message length ----
  const fmessage = document.getElementById('fmessage');
  if (fmessage.value.length > 2000) {
    valid = false;
  }

  if (!valid) return;

  // ---- Send form data using FormSubmit ----
  const btn     = document.getElementById('form-submit-btn');
  const txt     = document.getElementById('submit-text');
  const loader  = document.getElementById('submit-loader');
  const success = document.getElementById('form-success');

  btn.disabled = true;
  txt.classList.add('hidden');
  loader.classList.remove('hidden');

  fetch('https://formsubmit.co/ajax/albanbusiness1536@gmail.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: document.getElementById('fname').value,
      email: document.getElementById('femail').value,
      phone: document.getElementById('fphone').value,
      plan: document.getElementById('fplan').value,
      size: document.getElementById('fsize').value,
      message: document.getElementById('fmessage').value,
      _subject: 'New Contact Form Submission - ALBAN Architecture'
    })
  })
  .then(response => response.json())
  .then(data => {
    btn.disabled = false;
    txt.classList.remove('hidden');
    loader.classList.add('hidden');
    success.classList.remove('hidden');
    form.reset();
    setTimeout(() => success.classList.add('hidden'), 6000);
  })
  .catch(error => {
    console.error('Error submitting form:', error);
    btn.disabled = false;
    txt.classList.remove('hidden');
    loader.classList.add('hidden');
    alert('There was an error sending your message. Please try again later.');
  });
});


/* ===== LOGO CRANE HOVER ANIMATION ===== */
const crane = document.getElementById('logo-crane');
if (crane) {
  crane.addEventListener('mouseenter', () => {
    crane.style.transform = 'rotate(-8deg) scale(1.15)';
    crane.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
  });
  crane.addEventListener('mouseleave', () => {
    crane.style.transform = '';
  });
}

/* ===== PLAN CARD TILT EFFECT ===== */
document.querySelectorAll('.plan-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-10px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ===== HERO BUILDING 3D TILT ===== */
const heroAnim = document.querySelector('.hero-building-anim');
const buildingIcon = document.querySelector('.building-icon');
if (heroAnim && buildingIcon) {
  heroAnim.addEventListener('mousemove', (e) => {
    const rect = heroAnim.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    buildingIcon.style.transform = `rotateX(${y * 12}deg) rotateY(${x * 12}deg)`;
  });

  heroAnim.addEventListener('mouseleave', () => {
    buildingIcon.style.transform = '';
  });
}

/* ===== SMOOTH ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const h   = sec.offsetHeight;
    const id  = sec.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + h) {
        link.style.color = 'var(--gold)';
      } else {
        link.style.color = '';
      }
    }
  });
}, { passive: true });

/* ===== DISABLE RIGHT-CLICK CONTEXT MENU (anti-scraping) ===== */
document.addEventListener('contextmenu', (e) => {
  // Allow on form fields for usability
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  e.preventDefault();
});

/* ===== CONSOLE WARNING (anti-social-engineering) ===== */
if (typeof console !== 'undefined') {
  console.log(
    '%c⚠️ STOP!',
    'color: #ff0000; font-size: 48px; font-weight: bold; text-shadow: 2px 2px 0 #000;'
  );
  console.log(
    '%cThis browser feature is intended for developers. If someone told you to paste something here to "hack" or "unlock" something, it is a scam and will give them access to your data.',
    'color: #ffffff; font-size: 16px; background: #333; padding: 10px; border-radius: 5px;'
  );
}
