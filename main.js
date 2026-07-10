/* ═══════════════════════════════════════════════════════════════
   PureCare Baby — main.js
   All interactive features, animations, WhatsApp, Baby Chat
═══════════════════════════════════════════════════════════════ */

// ─── Force Scroll to Top on Load and handle Loader Screen ───
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
window.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
});
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('fade-out');
      document.body.classList.remove('loading');
    }, 1500); // 1.5s beautiful presentation loader
  }
});

// ─── Smooth Scroll for ALL anchor links ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile menu if open
      closeMobileMenu();
    }
  });
});

// ─── Sticky Navbar ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ─── Hamburger / Mobile Drawer ───
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');
const drawerClose  = document.getElementById('drawer-close');

function openDrawer() {
  hamburger?.classList.add('active');
  mobileMenu?.classList.add('open');
  mobileOverlay?.classList.add('visible');
  hamburger?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  hamburger?.classList.remove('active');
  mobileMenu?.classList.remove('open');
  mobileOverlay?.classList.remove('visible');
  hamburger?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  mobileMenu?.classList.contains('open') ? closeMobileMenu() : openDrawer();
});
drawerClose?.addEventListener('click', closeMobileMenu);
mobileOverlay?.addEventListener('click', closeMobileMenu);
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// ─── Dark / Light Mode Toggle ───
const themeToggle = document.getElementById('theme-toggle');
const savedTheme  = localStorage.getItem('purecare-theme');
if (savedTheme === 'dark') document.body.classList.add('dark-mode');

themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('purecare-theme', isDark ? 'dark' : 'light');
});


// ─── Scroll Reveal Animation (Intersection Observer) ───
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ─── Back to Top Button ───
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop?.classList.add('visible');
  } else {
    backToTop?.classList.remove('visible');
  }
});
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Toast Notification ───
function showToast(message, icon = 'fa-check-circle') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = toast?.querySelector('i');
  if (!toast) return;
  if (toastMsg) toastMsg.textContent = message;
  if (toastIcon) toastIcon.className = `fas ${icon}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// ─── Real Shopping Cart Management ───
let cart = [
  { name: 'Pure Baby Lotion', price: 449, qty: 1, icon: '🧴' },
  { name: 'Organic Baby Soap', price: 299, qty: 1, icon: '🫧' }
];

const cartDrawer = document.getElementById('cart-drawer');
const cartDrawerItems = document.getElementById('cart-drawer-items');
const cartSubtotal = document.getElementById('cart-drawer-subtotal');
const cartEmptyMsg = document.getElementById('cart-drawer-empty-msg');
const cartFooter = document.getElementById('cart-drawer-footer');

function renderCart() {
  if (!cartDrawerItems) return;
  cartDrawerItems.innerHTML = '';
  
  let total = 0;
  let totalQty = 0;
  
  if (cart.length === 0) {
    cartEmptyMsg.style.display = 'block';
    cartFooter.style.display = 'none';
  } else {
    cartEmptyMsg.style.display = 'none';
    cartFooter.style.display = 'block';
    
    cart.forEach(item => {
      total += item.price * item.qty;
      totalQty += item.qty;
      
      const itemRow = document.createElement('div');
      itemRow.className = 'cart-item';
      itemRow.innerHTML = `
        <div class="cart-item-icon">${item.icon}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price}</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn btn-minus" data-name="${item.name}"><i class="fas fa-minus"></i></button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn btn-plus" data-name="${item.name}"><i class="fas fa-plus"></i></button>
        </div>
        <button class="cart-item-remove" data-name="${item.name}"><i class="fas fa-trash-can"></i></button>
      `;
      
      // Bind controls
      itemRow.querySelector('.btn-minus').addEventListener('click', () => updateCartQuantity(item.name, -1));
      itemRow.querySelector('.btn-plus').addEventListener('click', () => updateCartQuantity(item.name, 1));
      itemRow.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(item.name));
      
      cartDrawerItems.appendChild(itemRow);
    });
  }
  
  cartSubtotal.textContent = `₹${total}`;
  
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = totalQty;
    badge.style.transform = 'scale(1.5)';
    setTimeout(() => badge.style.transform = 'scale(1)', 250);
  }
}

function addToCart(name, price, icon) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1, icon });
  }
  renderCart();
  showToast(`🛒 "${name}" added to cart!`, 'fa-shopping-bag');
}

function updateCartQuantity(name, delta) {
  const item = cart.find(item => item.name === name);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.name !== name);
    }
    renderCart();
  }
}

function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  renderCart();
  showToast('🗑️ Item removed from cart', 'fa-trash');
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});

// Toggle Cart Drawer
document.getElementById('nav-cart-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  cartDrawer?.classList.add('open');
});

document.getElementById('cart-drawer-close')?.addEventListener('click', () => {
  cartDrawer?.classList.remove('open');
});

document.getElementById('cart-start-shopping')?.addEventListener('click', () => {
  cartDrawer?.classList.remove('open');
});

cartDrawer?.addEventListener('click', (e) => {
  if (e.target === cartDrawer) {
    cartDrawer.classList.remove('open');
  }
});

// Checkout Toast
document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
  showToast('💳 Order placed successfully!', 'fa-circle-check');
  cart = [];
  renderCart();
  cartDrawer?.classList.remove('open');
});

// ─── Add to Cart Buttons ───
const cartButtons = [
  { id: 'lotion-add-btn',  name: 'Pure Baby Lotion', price: 449, icon: '🧴' },
  { id: 'bottle-add-btn',  name: 'Gentle Feeding Bottle', price: 699, icon: '🍼' },
  { id: 'cream-add-btn',   name: 'Soothing Nursing Cream', price: 429, icon: '🧴' },
  { id: 'soap-add-btn',    name: 'Pure Botanical Soap', price: 299, icon: '🫧' },
];

cartButtons.forEach(({ id, name, price, icon }) => {
  document.getElementById(id)?.addEventListener('click', () => {
    addToCart(name, price, icon);
  });
});

// ─── Wishlist buttons ───
['lotion-wish-btn','bottle-wish-btn','cream-wish-btn','soap-wish-btn'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', (e) => {
    const icon = e.currentTarget.querySelector('i');
    if (icon) {
      icon.style.color = icon.style.color === 'rgb(231, 76, 140)' ? '' : '#e74c8c';
    }
    showToast('💖 Added to wishlist!', 'fa-heart');
  });
});


// ─── Offer Countdown Timer ───
(function startCountdown() {
  let totalSecs = 8 * 3600 + 24 * 60 + 0; // 8h 24m 0s

  const hEl = document.getElementById('cnt-h');
  const mEl = document.getElementById('cnt-m');
  const sEl = document.getElementById('cnt-s');

  if (!hEl) return;

  setInterval(() => {
    if (totalSecs <= 0) { totalSecs = 86400; return; }
    totalSecs--;
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    hEl.textContent = String(h).padStart(2, '0');
    mEl.textContent = String(m).padStart(2, '0');
    sEl.textContent = String(s).padStart(2, '0');
  }, 1000);
})();

// ─── Testimonials Slider ───
(function initSlider() {
  const track = document.getElementById('testimonials-track');
  const dots  = document.querySelectorAll('.dot');
  const prev  = document.getElementById('slider-prev');
  const next  = document.getElementById('slider-next');
  if (!track) return;

  let current = 0;
  const total = document.querySelectorAll('.testimonial-card').length;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prev?.addEventListener('click', () => goTo(current - 1));
  next?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto-play every 5s
  let autoPlay = setInterval(() => goTo(current + 1), 5000);
  track.parentElement?.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.parentElement?.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => goTo(current + 1), 5000);
  });
})();

// ─── Appointment Form Submission ───
const apptForm = document.getElementById('appointment-form');
apptForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('form-name')?.value.trim();
  if (!name) {
    showToast('Please enter your full name.', 'fa-triangle-exclamation');
    return;
  }
  const email = document.getElementById('form-email')?.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', 'fa-triangle-exclamation');
    return;
  }
  const submitBtn = document.getElementById('form-submit-btn');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
    submitBtn.disabled = true;
  }
  setTimeout(() => {
    showToast(`✅ Appointment booked for ${name}! We'll contact you soon.`, 'fa-calendar-check');
    apptForm.reset();
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Book Appointment';
      submitBtn.disabled = false;
    }
  }, 1800);
});

// ─── Doctor Booking Modal Logic ───
const docModal = document.getElementById('doctor-modal');
const docModalClose = document.getElementById('doctor-modal-close');
const docModalForm = document.getElementById('doctor-modal-form');
const docSelect = document.getElementById('modal-doc-select');

function openDocModal(preselectedDoc = '') {
  if (preselectedDoc && docSelect) {
    docSelect.value = preselectedDoc;
  }
  docModal?.classList.add('open');
}

function closeDocModal() {
  docModal?.classList.remove('open');
  docModalForm?.reset();
}

// Bind to Nav button, Drawer button, and Doctor card buttons
document.getElementById('nav-cta-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('mobile-drawer-book-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('drawer')?.classList.remove('open');
  document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' });
});
document.querySelectorAll('.doctor-consult-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const docName = btn.getAttribute('data-doc');
    openDocModal(docName);
  });
});

docModalClose?.addEventListener('click', closeDocModal);
docModal?.addEventListener('click', (e) => {
  if (e.target === docModal) closeDocModal();
});

docModalForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const parentName = document.getElementById('modal-name')?.value.trim();
  const parentEmail = document.getElementById('modal-email')?.value.trim();
  const parentPhone = document.getElementById('modal-phone')?.value.trim();
  const apptDate = document.getElementById('modal-date')?.value;
  const selectedDoctor = docSelect?.value || 'pediatrician';
  
  if (!parentName) {
    showToast('Please enter parent name.', 'fa-triangle-exclamation');
    return;
  }
  if (!parentEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
    showToast('Please enter a valid email address.', 'fa-triangle-exclamation');
    return;
  }
  if (!parentPhone) {
    showToast('Please enter phone number.', 'fa-triangle-exclamation');
    return;
  }
  if (!apptDate) {
    showToast('Please select a date.', 'fa-triangle-exclamation');
    return;
  }
  
  const submitBtn = document.getElementById('modal-submit-btn');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Confirming...';
    submitBtn.disabled = true;
  }
  
  setTimeout(() => {
    showToast(`✅ Consultation booked with ${selectedDoctor} for ${parentName}!`, 'fa-calendar-check');
    closeDocModal();
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Confirm Booking';
      submitBtn.disabled = false;
    }
  }, 1800);
});

// ─── Nav cart click → scroll to products ───
document.getElementById('nav-cart-btn')?.addEventListener('click', () => {
  const products = document.getElementById('products');
  if (products) {
    products.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// ─── "View All" → open full products modal ───
const productsModal = document.getElementById('products-modal');
const productsModalClose = document.getElementById('products-modal-close');
const productsModalGrid = document.getElementById('products-modal-grid');

const ALL_PRODUCTS = [
  { name: 'Pure Baby Lotion',        cat: 'skin',   icon: '🧴', tag: 'Skin Care',   desc: 'Ultra-gentle chamomile cream for daily moisture. Pediatrician-approved.',      price: '₹449',  stars: 5 },
  { name: 'Organic Baby Soap',       cat: 'bath',   icon: '🫧', tag: 'Bath & Body', desc: 'Tear-free botanical soap with oat extract. Safe for newborns.',                price: '₹299',  stars: 5 },
  { name: 'Soft Baby Shampoo',       cat: 'bath',   icon: '🛁', tag: 'Bath & Body', desc: 'No-tear formula with lavender oil. Leaves hair silky soft.',                   price: '₹349',  stars: 4 },
  { name: 'Baby Talc Powder',        cat: 'skin',   icon: '✨', tag: 'Skin Care',   desc: 'Lightweight corn starch powder. Keeps baby fresh and rash-free all day.',      price: '₹199',  stars: 5 },
  { name: 'Nappy Rash Cream',        cat: 'skin',   icon: '💊', tag: 'Skin Care',   desc: 'Zinc oxide barrier cream. Instant relief for diaper rash.',                   price: '₹379',  stars: 5 },
  { name: 'Baby Face Cream',         cat: 'skin',   icon: '🌸', tag: 'Skin Care',   desc: 'Soft rose & aloe vera cream for sensitive baby skin. Fragrance-free.',        price: '₹429',  stars: 4 },
  { name: 'Baby Body Oil',           cat: 'bath',   icon: '💧', tag: 'Bath & Body', desc: 'Warm sesame & coconut oil blend. Perfect for baby massage.',                  price: '₹329',  stars: 5 },
  { name: 'Gentle Baby Wash',        cat: 'bath',   icon: '🚿', tag: 'Bath & Body', desc: '2-in-1 hair & body wash. pH-balanced and preservative-free.',                 price: '₹399',  stars: 5 },
  { name: 'Anti-Colic Bottle',       cat: 'feed',   icon: '🍼', tag: 'Feeding',     desc: 'Vented anti-colic nipple system. BPA-free, ergonomic grip.',                  price: '₹699',  stars: 5 },
  { name: 'Silicone Baby Spoon',     cat: 'feed',   icon: '🥄', tag: 'Feeding',     desc: 'Super soft spoon for first foods. Protects tender gums.',                     price: '₹199',  stars: 4 },
  { name: 'First Sippy Cup',         cat: 'feed',   icon: '🥤', tag: 'Feeding',     desc: 'Spill-proof with easy-grip handles. 150ml, dishwasher-safe.',                 price: '₹449',  stars: 4 },
  { name: 'Formula Container',       cat: 'feed',   icon: '📦', tag: 'Feeding',     desc: 'Triple-stack airtight formula dispenser. Holds up to 9 scoops per section.',  price: '₹299',  stars: 5 },
  { name: 'Nursing Pillow',          cat: 'feed',   icon: '🛋️', tag: 'Feeding',     desc: 'Ergonomic C-shaped pillow for breastfeeding support. Machine washable.',      price: '₹899',  stars: 5 },
  { name: 'Organic Swaddle Wrap',    cat: 'sleep',  icon: '🌙', tag: 'Sleep',       desc: 'Ultra-soft bamboo cotton muslin swaddle. Breathable & stretchy.',             price: '₹549',  stars: 5 },
  { name: 'White Noise Machine',     cat: 'sleep',  icon: '🎵', tag: 'Sleep',       desc: '10 calming sounds including heartbeat & ocean. Portable & USB-charged.',      price: '₹1299', stars: 5 },
  { name: 'Crib Star Projector',     cat: 'sleep',  icon: '⭐', tag: 'Sleep',       desc: 'Soft galaxy projection with lullabies. Sleep timer & remote.',                price: '₹1099', stars: 4 },
  { name: 'Baby Nasal Aspirator',    cat: 'health', icon: '💨', tag: 'Health',      desc: 'Gentle suction for stuffy nose relief. Hygienic filter, easy to clean.',     price: '₹399',  stars: 5 },
  { name: 'Digital Ear Thermometer', cat: 'health', icon: '🌡️', tag: 'Health',      desc: 'Instant 1-second read. Fever alarm & memory recall for last 10 readings.',   price: '₹849',  stars: 5 },
];

function renderProductsModal(cat) {
  const filtered = cat === 'all' ? ALL_PRODUCTS : ALL_PRODUCTS.filter(p => p.cat === cat);
  productsModalGrid.innerHTML = '';
  filtered.forEach(p => {
    const stars = '★'.repeat(p.stars) + '☆'.repeat(5 - p.stars);
    const card = document.createElement('div');
    card.className = 'pm-card';
    card.innerHTML = `
      <div class="pm-card-icon">${p.icon}</div>
      <div class="pm-card-tag">${p.tag}</div>
      <div class="pm-card-name">${p.name}</div>
      <div class="pm-card-desc">${p.desc}</div>
      <div class="pm-stars">${stars}</div>
      <div class="pm-card-footer">
        <span class="pm-card-price">${p.price}</span>
        <button class="pm-add-btn" data-name="${p.name}"><i class="fas fa-cart-plus"></i> Add</button>
      </div>
    `;
    card.querySelector('.pm-add-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const numPrice = parseInt(p.price.replace(/[^\d]/g, ''));
      addToCart(p.name, numPrice, p.icon);
    });
    productsModalGrid.appendChild(card);
  });
}

document.getElementById('view-all-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  renderProductsModal('all');
  productsModal?.classList.add('open');
});

// Filter buttons
document.querySelectorAll('.pcat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pcat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProductsModal(btn.dataset.cat);
  });
});

productsModalClose?.addEventListener('click', () => productsModal?.classList.remove('open'));
productsModal?.addEventListener('click', (e) => { if (e.target === productsModal) productsModal.classList.remove('open'); });

// ─── Footer back to top ───
document.getElementById('footer-back-to-top')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('offer-shop-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
});

// ─── Blog Read More → Article Content Popup ───
const blogPopup = document.getElementById('blog-more-popup');
const blogPopupClose = document.getElementById('blog-popup-close');
const blogPopupOptions = document.getElementById('blog-popup-options');
const blogArticleHeader = document.getElementById('blog-article-header');
const blogArticleBody = document.getElementById('blog-article-body');

const blogArticleData = {
  'blog-link-1': {
    tag: 'Baby Skin Care',
    title: 'The Perfect Baby Bath Routine for Healthy, Happy Skin',
    date: 'June 28, 2026', readTime: '5 min read',
    body: `
      <p>Bath time is one of the most cherished moments between parent and baby. Getting it right ensures your little one has healthy, glowing skin from day one.</p>
      <h4>🌡️ Ideal Water Temperature</h4>
      <p>Always test bath water with your elbow or wrist — it should feel comfortably warm, around 37°C (98.6°F). Never leave baby unattended in the bath.</p>
      <h4>🧴 Choosing the Right Products</h4>
      <ul>
        <li>Use <strong>pH-balanced, tear-free</strong> baby soap and shampoo.</li>
        <li>Avoid products with alcohol, dyes, or strong fragrances.</li>
        <li>Look for <strong>dermatologist-tested</strong> and <strong>hypoallergenic</strong> labels.</li>
      </ul>
      <h4>⏱️ How Often to Bathe?</h4>
      <p>Newborns only need a sponge bath 2–3 times a week. As they grow, you can bathe them daily. Over-bathing can dry out delicate skin.</p>
      <h4>💧 After Bath Care</h4>
      <p>Pat skin dry gently with a soft towel. Apply a fragrance-free baby lotion within 3 minutes of bathing to lock in moisture.</p>
    `,
    products: [
      { name: 'Organic Baby Soap', desc: 'Oatmeal & tear-free formula', price: '₹299', icon: '🫧' },
      { name: 'Pure Baby Lotion',  desc: 'Chamomile moisture cream',    price: '₹449', icon: '🧴' },
      { name: 'Gentle Baby Wash',  desc: '2-in-1 hair & body wash',     price: '₹399', icon: '🚿' },
      { name: 'Baby Body Oil',     desc: 'Warm sesame massage oil',      price: '₹329', icon: '💧' },
    ]
  },
  'blog-link-2': {
    tag: 'Baby Nutrition',
    title: 'Nutrition Guide: Feeding Your Baby Right in the First Year',
    date: 'June 20, 2026', readTime: '4 min read',
    body: `
      <p>Proper nutrition in the first 12 months is the foundation of a healthy, thriving child. Every feeding is a chance to nourish body and bond.</p>
      <h4>🤱 0–6 Months: Breast Milk is Best</h4>
      <p>Breast milk provides complete nutrition and immune protection. Feed on demand — typically every 2–3 hours. If breastfeeding isn't possible, use iron-fortified formula.</p>
      <h4>🥣 6 Months: Introducing Solids</h4>
      <ul>
        <li>Start with single-ingredient purées: rice cereal, sweet potato, pear.</li>
        <li>Introduce one new food every 3–5 days to watch for allergies.</li>
        <li>Avoid honey, cow's milk, and choking hazards before 12 months.</li>
      </ul>
      <h4>🍼 Bottle Feeding Tips</h4>
      <p>Hold bottle at an angle to reduce air intake. Burp baby every 60–90 ml. Sterilize all bottles and nipples after each use.</p>
      <h4>🌿 Signs Baby is Getting Enough</h4>
      <p>6+ wet diapers per day, steady weight gain, and contentment after feeds are all positive signs your baby is well-nourished.</p>
    `,
    products: [
      { name: 'Anti-Colic Bottle',   desc: 'Vented BPA-free design',        price: '₹699', icon: '🍼' },
      { name: 'Silicone Baby Spoon', desc: 'Soft for tender gums',           price: '₹199', icon: '🥄' },
      { name: 'First Sippy Cup',     desc: 'Spill-proof, easy-grip handles', price: '₹449', icon: '🥤' },
      { name: 'Formula Container',   desc: 'Triple-stack airtight storage',  price: '₹299', icon: '📦' },
    ]
  },
  'blog-link-3': {
    tag: 'Baby Sleep',
    title: 'Gentle Sleep Training: Helping Your Baby Sleep Through the Night',
    date: 'June 12, 2026', readTime: '6 min read',
    body: `
      <p>Sleep is essential for your baby's brain development and your own well-being. A consistent bedtime routine can make a world of difference.</p>
      <h4>🌙 Create a Sleep-Friendly Environment</h4>
      <ul>
        <li>Keep the room cool (18–20°C), dark, and quiet.</li>
        <li>Use white noise to mask household sounds.</li>
        <li>Ensure the crib mattress is firm and free of pillows/loose bedding.</li>
      </ul>
      <h4>📅 Establish a Bedtime Routine</h4>
      <p>Consistent cues like a warm bath, gentle massage, soft lullaby, and dim lights signal sleep time. Aim to begin the routine at the same time each night.</p>
      <h4>😴 Gentle Self-Soothing</h4>
      <p>Place baby in the crib drowsy but awake. This helps them learn to self-soothe. If they cry, wait a few minutes before responding — gradually increasing the intervals.</p>
      <h4>⏰ Age-Appropriate Sleep Schedules</h4>
      <p>Newborns: 14–17 hrs total. 3–6 months: 12–16 hrs. 6–12 months: 12–14 hrs. Adjust nap times to protect night sleep.</p>
    `,
    products: [
      { name: 'Organic Swaddle Wrap',  desc: 'Bamboo cotton, breathable',    price: '₹549',  icon: '🌙' },
      { name: 'White Noise Machine',   desc: '10 soothing sounds, portable', price: '₹1299', icon: '🎵' },
      { name: 'Crib Star Projector',   desc: 'Galaxy lights + lullabies',    price: '₹1099', icon: '⭐' },
    ]
  }
};

['blog-link-1','blog-link-2','blog-link-3'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', (e) => {
    e.preventDefault();
    const data = blogArticleData[id];
    if (!data) return;

    blogArticleHeader.innerHTML = `
      <span class="blog-article-tag">${data.tag}</span>
      <div class="blog-article-title">${data.title}</div>
      <div class="blog-article-meta">
        <span><i class="fas fa-calendar"></i> ${data.date}</span>
        <span><i class="fas fa-clock"></i> ${data.readTime}</span>
      </div>
    `;
    blogArticleBody.innerHTML = data.body;

    blogPopupOptions.innerHTML = '';
    data.products.forEach(prod => {
      const opt = document.createElement('div');
      opt.className = 'blog-popup-option';
      opt.innerHTML = `
        <span style="font-size:1.3rem;">${prod.icon}</span>
        <span>${prod.name}</span>
        <small>${prod.desc}</small>
        <span style="font-size:0.85rem;font-weight:800;color:var(--blue-dark);margin-top:4px;">${prod.price}</span>
      `;
      opt.addEventListener('click', () => {
        const numPrice = parseInt(prod.price.replace(/[^\d]/g, ''));
        addToCart(prod.name, numPrice, prod.icon);
        blogPopup?.classList.remove('open');
      });
      blogPopupOptions.appendChild(opt);
    });

    blogPopup?.classList.add('open');
  });
});

blogPopupClose?.addEventListener('click', () => blogPopup?.classList.remove('open'));
blogPopup?.addEventListener('click', (e) => {
  if (e.target === blogPopup) blogPopup.classList.remove('open');
});

// ═══════════════════════════════════════════════════
//  🐣 CUTE SVG BABY FACE WIDGET
// ═══════════════════════════════════════════════════
(function initBabyChat() {
  const widget    = document.getElementById('baby-chat-widget');
  const mascot    = document.getElementById('baby-mascot');
  const bubble    = document.getElementById('baby-chat-bubble');
  const textEl    = document.getElementById('baby-chat-text');
  const helpPanel = document.getElementById('baby-help-panel');
  const svgFace   = document.getElementById('baby-svg');
  if (!widget) return;

  // ── Chat messages + matching face emotions ──
  const messages = [
    { text: 'Hi there! Welcome! 💙',       emotion: 'happy'     },
    { text: 'Need help? 🌸',               emotion: 'excited'   },
    { text: 'Book appointment 📅',          emotion: 'happy'     },
    { text: 'Pure Love. Pure Care! ✨',     emotion: 'excited'   },
    { text: 'Ask me anything! 😊',          emotion: 'wink'      },
    { text: 'We care for you 🤱',           emotion: 'happy'     },
    { text: 'Feeling sleepy... 😴',         emotion: 'sleepy'    },
    { text: 'Oh wow! Great products! 😮',   emotion: 'surprised' },
  ];

  let msgIndex   = 0;
  let bubbleOpen = false;
  let helpOpen   = false;
  let bubbleTimer;

  // ── Set face emotion ──
  function setEmotion(name) {
    if (!svgFace) return;
    const emotions = ['happy','surprised','sleepy','excited','wink'];
    emotions.forEach(e => svgFace.classList.remove(e));
    svgFace.classList.add(name);

    // Change mouth via attribute for broader browser support
    const mouth = svgFace.querySelector('#face-mouth');
    if (!mouth) return;
    const paths = {
      happy:     'M50,84 Q60,94 70,84',
      surprised: 'M54,84 Q60,98 66,84',
      sleepy:    'M52,88 Q60,90 68,88',
      excited:   'M46,82 Q60,96 74,82',
      wink:      'M50,84 Q60,94 70,84',
    };
    mouth.setAttribute('d', paths[name] || paths.happy);
  }

  // ── Show bubble ──
  function showBubble({ text, emotion }) {
    textEl.textContent = text;
    setEmotion(emotion);
    bubble.classList.add('visible');
    bubbleOpen = true;
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(hideBubble, 4000);
  }
  function hideBubble() {
    bubble.classList.remove('visible');
    bubbleOpen = false;
  }

  // ── Show help panel ──
  function showHelpPanel() {
    helpPanel.classList.add('visible');
    widget.classList.add('help-open');
    helpOpen = true;
  }
  function hideHelpPanel() {
    helpPanel.classList.remove('visible');
    widget.classList.remove('help-open');
    helpOpen = false;
  }
  function toggleHelp() {
    helpOpen ? hideHelpPanel() : showHelpPanel();
  }

  // ── Auto-cycle messages ──
  setTimeout(() => showBubble(messages[0]), 1800);
  setInterval(() => {
    msgIndex = (msgIndex + 1) % messages.length;
    showBubble(messages[msgIndex]);
  }, 6000);

  // ── Mascot click: first show help, second click scroll to appointment ──
  mascot?.addEventListener('click', () => {
    toggleHelp();
    if (!helpOpen) {
      showBubble({ text: 'See you soon! 👋', emotion: 'wink' });
    } else {
      showBubble({ text: 'Can I help you? 💙', emotion: 'excited' });
    }
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (helpOpen && !widget.contains(e.target)) hideHelpPanel();
  });
})();


// ═══════════════════════════════════════════════════
//  📱 WHATSAPP FAB — ripple on click
// ═══════════════════════════════════════════════════
document.getElementById('whatsapp-fab')?.addEventListener('click', function() {
  this.classList.add('clicked');
  setTimeout(() => this.classList.remove('clicked'), 400);
});

// ─── Subtle button ripple effect ───
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('btn-ripple');
    const rect = this.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top  = `${e.clientY - rect.top}px`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// ─── Animate numbers when in view ───
function animateNumber(el, target, duration = 1500) {
  let start = 0;
  const suffix = el.dataset.suffix || '';
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString() + suffix;
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-number');
      nums.forEach(num => {
        const raw = num.textContent.replace(/[^0-9]/g, '');
        if (raw) {
          const suffix = num.textContent.replace(/[0-9]/g, '').replace(',', '');
          num.dataset.suffix = suffix;
          animateNumber(num, parseInt(raw));
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelector('.hero-stats') && statsObserver.observe(document.querySelector('.hero-stats'));

console.log('🌸 PureCare Baby — Website loaded successfully!');
