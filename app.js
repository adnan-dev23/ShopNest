// ShopMarkets Master Catalog
const initialProducts = [
  { id: 1, title: "Voyager Chrono 42", category: "Watches", price: 3499, originalPrice: 4999, img: "Images/Watches/1.jpg", tag: "Bestseller" },
  { id: 2, title: "Aero Stealth Daypack 24L", category: "Backpacks", price: 2199, originalPrice: 2999, img: "Images/Backpacks/1.jpg", tag: "Waterproof" },
  { id: 3, title: "Noir Oud Parfum 50ml", category: "Perfumes", price: 1899, originalPrice: 2499, img: "Images/Perfumes/1.jpg", tag: "Limited" },
  { id: 4, title: "Minimalist Field Steel", category: "Watches", price: 2999, originalPrice: 3999, img: "Images/Watches/2.jpg", tag: "Sapphire" },
  { id: 5, title: "Apex Tech Urban Hauler", category: "Backpacks", price: 2699, originalPrice: 3499, img: "Images/Backpacks/2.jpg", tag: "Ergonomic" },
  { id: 6, title: "Cedar Smoke Extrait", category: "Perfumes", price: 2199, originalPrice: 2899, img: "Images/Perfumes/2.jpg", tag: "Artisan" }
];

// LocalStorage Setup
if (!localStorage.getItem('sm_products')) {
  localStorage.setItem('sm_products', JSON.stringify(initialProducts));
}
if (!localStorage.getItem('sm_cart')) {
  localStorage.setItem('sm_cart', JSON.stringify([]));
}
if (!localStorage.getItem('sm_orders')) {
  localStorage.setItem('sm_orders', JSON.stringify([]));
}

// State Helpers
function getProducts() { return JSON.parse(localStorage.getItem('sm_products')) || []; }
function getCart() { return JSON.parse(localStorage.getItem('sm_cart')) || []; }
function saveCart(cart) { 
  localStorage.setItem('sm_cart', JSON.stringify(cart));
  updateCartBadge();
  renderDrawerCart();
}
function getOrders() { return JSON.parse(localStorage.getItem('sm_orders')) || []; }
function saveOrders(orders) { localStorage.setItem('sm_orders', JSON.stringify(orders)); }

// Render Storefront Grid
function renderStorefront(filter = "All", query = "") {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const products = getProducts();
  const filtered = products.filter(p => {
    const matchCat = filter === "All" || p.category.toLowerCase() === filter.toLowerCase();
    const matchQuery = p.title.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--aura-subtext);">No products found matching your search.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="product-card">
      <div class="card-img-wrap">
        <img src="${item.img}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'">
        ${item.tag ? `<span class="tag-badge">${item.tag}</span>` : ''}
      </div>
      <div class="card-body">
        <div class="card-category">${item.category}</div>
        <div class="card-title">${item.title}</div>
        <div class="card-price-row">
          <span class="price-current">₹${item.price.toLocaleString()}</span>
          ${item.originalPrice ? `<span class="price-original">₹${item.originalPrice.toLocaleString()}</span>` : ''}
        </div>
        <button class="btn-add-cart" onclick="addToCart(${item.id})">Add to Bag</button>
      </div>
    </div>
  `).join('');
}

// Render Categories
function renderCategories() {
  const filterBar = document.getElementById('categoryFilterBar');
  if (!filterBar) return;
  const categories = ["All", "Watches", "Backpacks", "Perfumes"];
  filterBar.innerHTML = categories.map((cat, idx) => `
    <button class="filter-btn ${idx === 0 ? 'active' : ''}" onclick="applyCategoryFilter('${cat}', this)">${cat}</button>
  `).join('');
}

function applyCategoryFilter(cat, elem) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  elem.classList.add('active');
  renderStorefront(cat);
}

// Cart Drawer Handlers
function toggleCartDrawer(open) {
  const backdrop = document.getElementById('drawerBackdrop');
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  if (open) {
    backdrop.classList.add('active');
    drawer.classList.add('active');
    renderDrawerCart();
  } else {
    backdrop.classList.remove('active');
    drawer.classList.remove('active');
  }
}

function addToCart(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  toggleCartDrawer(true);
}

function updateCartQty(productId, delta) {
  let cart = getCart();
  const item = cart.find(c => c.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== productId);
  }
  saveCart(cart);
}

function renderDrawerCart() {
  const body = document.getElementById('drawerBody');
  const totalElem = document.getElementById('drawerTotal');
  if (!body) return;

  const cart = getCart();
  if (cart.length === 0) {
    body.innerHTML = `<div style="text-align: center; color: var(--aura-subtext); margin-top: 40px;"><i class="fas fa-bag-shopping" style="font-size: 2rem; margin-bottom: 10px;"></i><p>Your ShopMarkets Bag is empty.</p></div>`;
    if (totalElem) totalElem.innerText = "₹0";
    return;
  }

  let total = 0;
  body.innerHTML = cart.map(item => {
    total += item.price * item.qty;
    return `
      <div class="cart-row">
        <img src="${item.img}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'">
        <div class="cart-row-details">
          <div class="cart-row-title">${item.title}</div>
          <div class="cart-row-price">₹${item.price.toLocaleString()} x ${item.qty}</div>
        </div>
        <div class="cart-row-ctrls">
          <button onclick="updateCartQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateCartQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  if (totalElem) totalElem.innerText = `₹${total.toLocaleString()}`;
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const cart = getCart();
  const totalItems = cart.reduce((acc, c) => acc + c.qty, 0);
  badge.innerText = totalItems;
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderStorefront();
  updateCartBadge();

  const search = document.getElementById('searchInput');
  if (search) {
    search.addEventListener('input', (e) => {
      renderStorefront("All", e.target.value);
    });
  }
});