/**
 * AURA Store Engine 2026
 * Pure Vanilla State Management & UI Reactive Controller
 */

const AURA_CATALOG = [
  {
    id: "AUR-01",
    name: "AURA Chronomaster Analog Watch (Pack of 2)",
    brand: "AURA Precision",
    category: "Timepieces",
    price: 1299,
    mrp: 2499,
    rating: 4.8,
    reviews: 142,
    badge: "BESTSELLER",
    image: "Images/Watches/Voguish Men Waches/1.jpg",
    description: "Surgical-grade stainless steel quartz movement with sapphire-coated glass."
  },
  {
    id: "AUR-02",
    name: "Denver Elite Fragrance Set (3 x 50ml)",
    brand: "Denver",
    category: "Fragrance",
    price: 649,
    mrp: 1199,
    rating: 4.7,
    reviews: 89,
    badge: "POPULAR",
    image: "Images/Perfumes/denver/1.jpg",
    description: "Formulated for long-lasting masculine freshness and notes."
  },
  {
    id: "AUR-03",
    name: "Urban Pro Technical Laptop Backpack",
    brand: "AURA Technical",
    category: "Carry",
    price: 1899,
    mrp: 3499,
    rating: 4.9,
    reviews: 210,
    badge: "FEATURED",
    image: "Images/Watches/BackPacks/IMG-20251025-WA0019.jpg",
    description: "Waterproof technical ballistic nylon with cushioned 16-inch compartment."
  },
  {
    id: "AUR-04",
    name: "Digital OLED Minimalist Smart Timepiece",
    brand: "AURA Tech",
    category: "Timepieces",
    price: 899,
    mrp: 1799,
    rating: 4.5,
    reviews: 64,
    badge: "NEW",
    image: "Images/Watches/led watch/1.jpg",
    description: "Featherlight skin-friendly silicone watch with crystal touch interface."
  },
  {
    id: "AUR-05",
    name: "Colorblocked Ergonomic Commuter Pack",
    brand: "AURA Technical",
    category: "Carry",
    price: 1499,
    mrp: 2999,
    rating: 4.6,
    reviews: 98,
    badge: "SALE",
    image: "Images/Backpacks/Travel-College-Bags/blue-1.jpg",
    description: "High-capacity multi-compartment pack built for urban work and travel."
  }
];

// Reactive Storage Helpers
const getStorage = (key, fallback) => JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
const setStorage = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// Global Runtime State
let currentCategory = "All";
let activeSearchQuery = "";
let cartItems = getStorage("aura_cart", []);
let wishlistIds = new Set(getStorage("aura_wishlist", []));

// DOM Nodes
const productGrid = document.getElementById("productGrid");
const categoryFilterBar = document.getElementById("categoryFilterBar");
const searchInput = document.getElementById("searchInput");
const cartBadge = document.getElementById("cartBadge");
const cartDrawer = document.getElementById("cartDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const drawerBody = document.getElementById("drawerBody");
const drawerTotal = document.getElementById("drawerTotal");

// Initialize Navigation Badges
function updateCounters() {
  if (cartBadge) cartBadge.textContent = cartItems.length;
}

// Render Category Filter Pills
function renderCategories() {
  if (!categoryFilterBar) return;
  const categories = ["All", ...new Set(AURA_CATALOG.map(p => p.category))];
  
  categoryFilterBar.innerHTML = categories.map(cat => `
    <button class="cat-pill ${cat === currentCategory ? 'active' : ''}" onclick="filterCategory('${cat}')">
      ${cat}
    </button>
  `).join("");
}

// Render Products Grid
function renderCatalog() {
  if (!productGrid) return;

  let items = AURA_CATALOG;

  if (currentCategory !== "All") {
    items = items.filter(p => p.category === currentCategory);
  }

  if (activeSearchQuery) {
    const q = activeSearchQuery.toLowerCase();
    items = items.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }

  if (items.length === 0) {
    productGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--aura-subtext);">
        <p style="font-size: 1.1rem; font-weight: 600;">No products match your criteria.</p>
      </div>`;
    return;
  }

  productGrid.innerHTML = items.map(product => {
    const isLiked = wishlistIds.has(product.id);
    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

    return `
      <div class="product-card" onclick="openProductDetail('${product.id}')">
        <div class="card-img-wrap">
          ${product.badge ? `<span class="card-badge">${product.badge}</span>` : ''}
          <button class="wishlist-toggle ${isLiked ? 'liked' : ''}" onclick="toggleWishlist(event, '${product.id}')" aria-label="Wishlist">
            <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
          </button>
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="card-details">
          <span class="card-brand">${product.brand}</span>
          <h3 class="card-title">${product.name}</h3>
          <div class="card-price-row">
            <span class="price-current">₹${product.price.toLocaleString('en-IN')}</span>
            <span class="price-mrp">₹${product.mrp.toLocaleString('en-IN')}</span>
            <span class="price-discount">${discount}% OFF</span>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Cart Drawer Interaction
function toggleCartDrawer(open) {
  if (!cartDrawer || !drawerBackdrop) return;
  cartDrawer.classList.toggle("active", open);
  drawerBackdrop.classList.toggle("active", open);
  if (open) renderCartDrawer();
}

function addToCart(productId) {
  const product = AURA_CATALOG.find(p => p.id === productId);
  if (!product) return;

  cartItems.push(product);
  setStorage("aura_cart", cartItems);
  updateCounters();
  toggleCartDrawer(true);
}

function removeFromCart(index) {
  cartItems.splice(index, 1);
  setStorage("aura_cart", cartItems);
  updateCounters();
  renderCartDrawer();
}

function renderCartDrawer() {
  if (!drawerBody || !drawerTotal) return;

  if (cartItems.length === 0) {
    drawerBody.innerHTML = `<div style="text-align:center; padding: 40px 0; color: var(--aura-subtext);">Your shopping bag is empty.</div>`;
    drawerTotal.textContent = "₹0";
    return;
  }

  let total = 0;
  drawerBody.innerHTML = cartItems.map((item, idx) => {
    total += item.price;
    return `
      <div class="cart-item-card">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</span>
        </div>
        <button onclick="removeFromCart(${idx})" style="background:none; border:none; color: var(--aura-subtext); cursor:pointer;">
          <i class="fas fa-trash-can"></i>
        </button>
      </div>
    `;
  }).join("");

  drawerTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
}

// Filter Event Handlers
function filterCategory(cat) {
  currentCategory = cat;
  renderCategories();
  renderCatalog();
}

function toggleWishlist(e, id) {
  e.stopPropagation();
  if (wishlistIds.has(id)) {
    wishlistIds.delete(id);
  } else {
    wishlistIds.add(id);
  }
  setStorage("aura_wishlist", Array.from(wishlistIds));
  renderCatalog();
}

function openProductDetail(id) {
  // Navigation for standalone flow
  window.location.href = `customer.html#product-${id}`;
}

// Global Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderCatalog();
  updateCounters();

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeSearchQuery = e.target.value.trim();
      renderCatalog();
    });
  }
});