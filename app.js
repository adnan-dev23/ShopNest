/**
 * SHOPMARKETS PRODUCTION JAVASCRIPT CORE ENGINE
 */

let CURRENT_FILTER = {
  category: "all",
  brands: [],
  maxPrice: 10000,
  sortBy: "featured"
};

// State Helpers
function getDbProducts() { return JSON.parse(localStorage.getItem('sm_products_db')) || SM_DATA.products; }
function getCart() { return JSON.parse(localStorage.getItem('sm_cart_db')) || []; }
function getWishlist() { return JSON.parse(localStorage.getItem('sm_wishlist_db')) || []; }
function getCompare() { return JSON.parse(localStorage.getItem('sm_compare_db')) || []; }
function getCustomerProfile() { return JSON.parse(localStorage.getItem('sm_customer_profile')) || null; }
function getAppliedCoupon() { return JSON.parse(localStorage.getItem('sm_applied_coupon')) || null; }

// Toast Alert Dispatcher
function showToast(message, icon = "fa-circle-check") {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Dark Mode Toggle
function toggleThemeMode() {
  const current = localStorage.getItem('sm_theme_mode') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('sm_theme_mode', next);
  showToast(`Switched to ${next} theme mode`);
}

// User Profile Display in Header
function renderUserGreeting() {
  const userGreetingElem = document.getElementById('headerUserGreeting');
  const profile = getCustomerProfile();
  if (userGreetingElem) {
    if (profile && profile.name) {
      const firstName = profile.name.split(' ')[0];
      userGreetingElem.innerHTML = `<i class="fas fa-user-check" style="color: var(--status-success);"></i> <span>Hi, ${firstName}</span>`;
      userGreetingElem.title = `Logged in as ${profile.name}`;
      userGreetingElem.href = "customer.html";
    } else {
      userGreetingElem.innerHTML = `<i class="far fa-user"></i> <span>Sign In</span>`;
      userGreetingElem.href = "login.html";
    }
  }
}

// Catalog Renderer with Clickable Image & Buy Now
function renderMarketplaceCatalog() {
  const grid = document.getElementById('productCatalogGrid');
  if (!grid) return;

  const products = getDbProducts();
  const searchInput = document.getElementById('globalSearchInput');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  let filtered = products.filter(p => {
    const matchCategory = CURRENT_FILTER.category === "all" || p.category.toLowerCase() === CURRENT_FILTER.category.toLowerCase();
    const matchBrand = CURRENT_FILTER.brands.length === 0 || CURRENT_FILTER.brands.includes(p.brand);
    const matchPrice = p.price <= CURRENT_FILTER.maxPrice;
    const matchSearch = p.title.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
    return matchCategory && matchBrand && matchPrice && matchSearch;
  });

  if (CURRENT_FILTER.sortBy === "price-low") filtered.sort((a,b) => a.price - b.price);
  if (CURRENT_FILTER.sortBy === "price-high") filtered.sort((a,b) => b.price - a.price);
  if (CURRENT_FILTER.sortBy === "rating") filtered.sort((a,b) => b.rating - a.rating);

  const countElem = document.getElementById('productCountDisplay');
  if (countElem) countElem.innerText = `Showing ${filtered.length} verified items`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
        <i class="fas fa-box-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 16px;"></i>
        <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 8px;">No matching items discovered</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">Try adjusting your filters or search keywords.</p>
        <button class="btn-hero-primary" onclick="CURRENT_FILTER={category:'all',brands:[],maxPrice:10000,sortBy:'featured'}; renderMarketplaceCatalog();">Reset Filters</button>
      </div>
    `;
    return;
  }

  const wishlist = getWishlist();

  grid.innerHTML = filtered.map(item => {
    const isWishlisted = wishlist.includes(item.id);
    return `
      <article class="product-card">
        <!-- Clicking the image opens full product details -->
        <div class="card-media-wrap" onclick="openQuickView('${item.id}')" style="cursor: pointer;">
          <img src="${item.images[0]}" alt="${item.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'">
          ${item.tag ? `<span class="card-badge-pill">${item.tag}</span>` : ''}
          <div class="card-floating-actions" onclick="event.stopPropagation()">
            <button class="floating-action-btn" title="Wishlist" onclick="toggleWishlist('${item.id}')">
              <i class="${isWishlisted ? 'fas fa-heart' : 'far fa-heart'}" style="${isWishlisted ? 'color: #ef4444;' : ''}"></i>
            </button>
            <button class="floating-action-btn" title="Quick View" onclick="openQuickView('${item.id}')">
              <i class="far fa-eye"></i>
            </button>
            <button class="floating-action-btn" title="Compare" onclick="toggleCompare('${item.id}')">
              <i class="fas fa-code-compare"></i>
            </button>
          </div>
        </div>

        <div class="card-info">
          <div class="card-brand-row">
            <span>${item.brand}</span>
            <span style="color: ${item.stock < 10 ? 'var(--status-danger)' : 'var(--status-success)'}; font-weight: 700;">
              ${item.stock < 10 ? `Only ${item.stock} left` : 'In Stock'}
            </span>
          </div>
          <!-- Title also clickable -->
          <h3 class="card-title" onclick="openQuickView('${item.id}')" style="cursor: pointer;">${item.title}</h3>
          
          <div class="rating-star-row">
            <i class="fas fa-star"></i>
            <strong>${item.rating}</strong>
            <span style="color: var(--text-muted);">(${item.reviewCount})</span>
          </div>

          <div class="price-stock-row">
            <span class="current-price">₹${item.price.toLocaleString()}</span>
            <span class="discount-price">₹${item.originalPrice.toLocaleString()}</span>
            <span class="save-pill">${item.discountPercent}% OFF</span>
          </div>

          <!-- Dual Actions: Add to Bag & Buy Now -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: auto;">
            <button class="btn-card-add" onclick="addToCart('${item.id}')" style="padding: 10px 8px; font-size: 0.82rem;">
              <i class="fas fa-bag-shopping"></i> Add to Bag
            </button>
            <button class="btn-hero-primary" onclick="buyNowDirect('${item.id}')" style="padding: 10px 8px; font-size: 0.82rem; justify-content: center; border-radius: var(--radius-sm);">
              <i class="fas fa-bolt"></i> Buy Now
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Instant Buy Now Action (Direct to Checkout)
function buyNowDirect(productId) {
  const products = getDbProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  let cart = getCart();
  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem('sm_cart_db', JSON.stringify(cart));
  updateBadges();
  showToast(`Proceeding to instant checkout with ${product.title}...`, "fa-bolt");
  
  setTimeout(() => {
    window.location.href = "customer.html#checkout";
  }, 400);
}

// Quick View / Product Detail Modal (Contains Guarantee Badges & Buy Now)
function openQuickView(productId) {
  const products = getDbProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modalBody = document.getElementById('quickViewModalBody');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1.1fr; gap: 32px; padding: 28px;">
      <!-- Image Gallery -->
      <div>
        <div style="aspect-ratio: 1/1; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color); background: var(--bg-muted);">
          <img id="qvMainImg" src="${product.images[0]}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="display: flex; gap: 10px; margin-top: 12px; overflow-x: auto;">
          ${product.images.map(img => `
            <img src="${img}" onclick="document.getElementById('qvMainImg').src='${img}'" style="width: 60px; height: 60px; border-radius: var(--radius-xs); object-fit: cover; cursor: pointer; border: 2px solid var(--border-color);">
          `).join('')}
        </div>
      </div>

      <!-- Details & Guarantee Badges -->
      <div style="display: flex; flex-direction: column;">
        <span style="font-size: 0.8rem; font-weight: 800; color: var(--accent-primary); text-transform: uppercase;">${product.brand}</span>
        <h2 style="font-size: 1.45rem; font-weight: 800; margin: 4px 0 10px; line-height: 1.25;">${product.title}</h2>
        
        <div class="rating-star-row" style="margin-bottom: 12px;">
          <i class="fas fa-star" style="color: #f59e0b;"></i>
          <strong>${product.rating}</strong>
          <span style="color: var(--text-muted);">(${product.reviewCount} customer reviews)</span>
        </div>

        <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px;">
          <span style="font-size: 1.6rem; font-weight: 800;">₹${product.price.toLocaleString()}</span>
          <span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.95rem;">₹${product.originalPrice.toLocaleString()}</span>
          <span class="save-pill" style="font-size: 0.8rem;">Save ${product.discountPercent}%</span>
        </div>

        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 18px;">${product.description}</p>

        <!-- CTA Action Buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
          <button class="btn-card-add" onclick="addToCart('${product.id}'); closeModal('quickViewModal');" style="padding: 12px; font-weight: 800;">
            <i class="fas fa-bag-shopping"></i> Add to Bag
          </button>
          <button class="btn-hero-primary" onclick="buyNowDirect('${product.id}')" style="justify-content: center; padding: 12px; border-radius: var(--radius-sm);">
            <i class="fas fa-bolt"></i> Buy Now
          </button>
        </div>

        <!-- Product Guarantee Badges Section -->
        <div style="border-top: 1px solid var(--border-color); padding-top: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 10px; font-size: 0.8rem;">
            <i class="fas fa-truck-fast" style="color: var(--accent-primary); font-size: 1.1rem;"></i>
            <div><strong>Air Express Shipping</strong><div style="color: var(--text-muted); font-size: 0.72rem;">Free above ₹999</div></div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; font-size: 0.8rem;">
            <i class="fas fa-shield-halved" style="color: var(--status-success); font-size: 1.1rem;"></i>
            <div><strong>2-Year Warranty</strong><div style="color: var(--text-muted); font-size: 0.72rem;">Direct coverage</div></div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; font-size: 0.8rem;">
            <i class="fas fa-rotate-left" style="color: var(--status-warning); font-size: 1.1rem;"></i>
            <div><strong>7-Day Return</strong><div style="color: var(--text-muted); font-size: 0.72rem;">Doorstep inspection</div></div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; font-size: 0.8rem;">
            <i class="fas fa-lock" style="color: var(--accent-primary); font-size: 1.1rem;"></i>
            <div><strong>Secure Checkout</strong><div style="color: var(--text-muted); font-size: 0.72rem;">COD & UPI enabled</div></div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('quickViewModal').classList.add('active');
  document.body.style.overflow = 'hidden'; // Lock background scroll
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function addToCart(productId, qty = 1) {
  const products = getDbProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  let cart = getCart();
  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty: qty });
  }

  localStorage.setItem('sm_cart_db', JSON.stringify(cart));
  updateBadges();
  renderCartDrawer();
  toggleDrawer('cartDrawer', true);
  showToast(`Added "${product.title}" to Bag!`);
}

function updateCartQty(productId, delta) {
  let cart = getCart();
  const item = cart.find(c => c.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== productId);
    showToast(`Item removed from Bag`);
  }
  localStorage.setItem('sm_cart_db', JSON.stringify(cart));
  updateBadges();
  renderCartDrawer();
}

function renderCartDrawer() {
  const container = document.getElementById('cartDrawerItems');
  if (!container) return;
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 50px 0;">
        <i class="fas fa-bag-shopping" style="font-size: 2.5rem; margin-bottom: 12px;"></i>
        <h4 style="color: var(--text-primary); font-size: 1rem;">Your Bag is empty</h4>
        <p style="font-size: 0.82rem; margin-top: 4px;">Discover exclusive lifestyle releases.</p>
      </div>
    `;
    updatePriceSummary(0);
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart.map(item => {
    subtotal += item.price * item.qty;
    return `
      <div style="display: flex; gap: 14px; background: var(--bg-surface); border: 1px solid var(--border-color); padding: 12px; border-radius: var(--radius-sm);">
        <img src="${item.images[0]}" alt="${item.title}" style="width: 60px; height: 60px; border-radius: var(--radius-xs); object-fit: cover;">
        <div style="flex: 1;">
          <h4 style="font-size: 0.88rem; font-weight: 700; margin-bottom: 2px;">${item.title}</h4>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 8px;">₹${item.price.toLocaleString()}</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button onclick="updateCartQty('${item.id}', -1)" style="width: 24px; height: 24px; background: var(--bg-muted); border-radius: 4px; font-weight: 800;">-</button>
            <span style="font-size: 0.85rem; font-weight: 700;">${item.qty}</span>
            <button onclick="updateCartQty('${item.id}', 1)" style="width: 24px; height: 24px; background: var(--bg-muted); border-radius: 4px; font-weight: 800;">+</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  updatePriceSummary(subtotal);
}

function updatePriceSummary(subtotal) {
  const coupon = getAppliedCoupon();
  let discount = 0;

  if (coupon && subtotal >= (coupon.minSpend || 0)) {
    if (coupon.discountPercent) {
      discount = Math.min((subtotal * coupon.discountPercent) / 100, coupon.maxDiscount || 99999);
    } else if (coupon.flatDiscount) {
      discount = coupon.flatDiscount;
    }
  }

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  if (document.getElementById('drawerSubtotal')) document.getElementById('drawerSubtotal').innerText = `₹${subtotal.toLocaleString()}`;
  if (document.getElementById('drawerDiscount')) document.getElementById('drawerDiscount').innerText = `-₹${discount.toLocaleString()}`;
  if (document.getElementById('drawerGrandTotal')) document.getElementById('drawerGrandTotal').innerText = `₹${grandTotal.toLocaleString()}`;
}

function applyCouponCode() {
  const input = document.getElementById('couponCodeInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  const valid = SM_DATA.coupons.find(c => c.code === code);

  if (!valid) {
    showToast("Invalid promo code", "fa-circle-xmark");
    return;
  }

  localStorage.setItem('sm_applied_coupon', JSON.stringify(valid));
  showToast(`Coupon "${code}" applied successfully!`);
  renderCartDrawer();
}

function toggleWishlist(productId) {
  let wishlist = getWishlist();
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
    showToast("Removed from wishlist");
  } else {
    wishlist.push(productId);
    showToast("Added to wishlist", "fa-heart");
  }
  localStorage.setItem('sm_wishlist_db', JSON.stringify(wishlist));
  updateBadges();
  renderMarketplaceCatalog();
}

function toggleCompare(productId) {
  let compare = getCompare();
  if (compare.includes(productId)) {
    compare = compare.filter(id => id !== productId);
    showToast("Removed from comparison");
  } else {
    if (compare.length >= 3) {
      showToast("Maximum 3 items allowed in comparison", "fa-triangle-exclamation");
      return;
    }
    compare.push(productId);
    showToast("Added to comparison", "fa-code-compare");
  }
  localStorage.setItem('sm_compare_db', JSON.stringify(compare));
  renderCompareDock();
}

function renderCompareDock() {
  const dock = document.getElementById('compareDock');
  if (!dock) return;
  const compare = getCompare();
  if (compare.length > 0) {
    dock.classList.add('active');
    document.getElementById('compareCountText').innerText = `${compare.length} items selected`;
  } else {
    dock.classList.remove('active');
  }
}

function toggleDrawer(id, open) {
  const d = document.getElementById(id);
  const backdrop = document.getElementById('drawerBackdrop');
  if (!d) return;
  if (open) {
    if (backdrop) backdrop.classList.add('active');
    d.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    if (backdrop) backdrop.classList.remove('active');
    d.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function updateBadges() {
  const cart = getCart();
  const wishlist = getWishlist();
  const totalCart = cart.reduce((acc, c) => acc + c.qty, 0);

  document.querySelectorAll('.cart-badge-num').forEach(b => b.innerText = totalCart);
  document.querySelectorAll('.wishlist-badge-num').forEach(b => b.innerText = wishlist.length);
}

function setupSmartSearch() {
  const input = document.getElementById('globalSearchInput');
  const flyout = document.getElementById('searchSuggestionsFlyout');
  if (!input || !flyout) return;

  input.addEventListener('focus', () => flyout.classList.add('active'));
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !flyout.contains(e.target)) {
      flyout.classList.remove('active');
    }
  });

  input.addEventListener('input', (e) => {
    renderMarketplaceCatalog();
    const query = e.target.value.toLowerCase().trim();
    const suggestionsList = document.getElementById('dynamicSuggestionsList');
    if (!suggestionsList) return;

    if (!query) {
      suggestionsList.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted);">Type keywords to discover products & brands...</div>`;
      return;
    }

    const matches = getDbProducts().filter(p => p.title.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)).slice(0, 3);
    suggestionsList.innerHTML = matches.map(m => `
      <div class="suggestion-item" onclick="openQuickView('${m.id}')">
        <img src="${m.images[0]}" alt="${m.title}">
        <div>
          <div style="font-weight: 700; font-size: 0.85rem;">${m.title}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${m.brand} • ₹${m.price.toLocaleString()}</div>
        </div>
      </div>
    `).join('');
  });
}

function startDealsCountdown() {
  const end = Date.now() + 86400000 * 2;
  setInterval(() => {
    const diff = end - Date.now();
    if (diff <= 0) return;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const hElem = document.getElementById('clockHrs');
    const mElem = document.getElementById('clockMins');
    const sElem = document.getElementById('clockSecs');
    if (hElem) hElem.innerText = String(hours).padStart(2, '0');
    if (mElem) mElem.innerText = String(minutes).padStart(2, '0');
    if (sElem) sElem.innerText = String(seconds).padStart(2, '0');
  }, 1000);
}

// Global Keyboard Shortcuts (Escape to close modals & drawers)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal('quickViewModal');
    toggleDrawer('cartDrawer', false);
  }
});

// Bootstrapping
document.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('sm_theme_mode') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  
  renderUserGreeting();
  updateBadges();
  renderMarketplaceCatalog();
  setupSmartSearch();
  renderCompareDock();
  startDealsCountdown();
});