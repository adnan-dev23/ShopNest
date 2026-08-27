/**
 * SHOPMARKETS ENTERPRISE CATALOG & STORE DATA
 * Production-ready normalized schema separating static demo fixtures from persistent dynamic state.
 */

const SM_DATA = {
  categories: [
    {
      id: "electronics",
      name: "Electronics",
      icon: "fa-laptop",
      subcategories: ["Smart Audio", "Timepieces", "Cameras", "Accessories"]
    },
    {
      id: "fashion",
      name: "Fashion & Carry",
      icon: "fa-bag-shopping",
      subcategories: ["Technical Carry", "Urban Backpacks", "Travel Duffles", "Minimalist Wallets"]
    },
    {
      id: "fragrance",
      name: "Fragrance & Grooming",
      icon: "fa-spray-can-sparkles",
      subcategories: ["Extrait De Parfum", "Oud Blends", "Daily Cologne", "Grooming Sets"]
    },
    {
      id: "home",
      name: "Workspace & Living",
      icon: "fa-couch",
      subcategories: ["Desk Mats", "Ambient Lights", "Cable Organization", "Aroma Diffusers"]
    }
  ],

  brands: ["AuraTech", "NomadCarry", "L'Artisan", "Chronos", "UrbanForge", "Zenith Living"],

  coupons: [
    { code: "MARKET10", discountPercent: 10, minSpend: 1500, maxDiscount: 500, desc: "10% off on orders above ₹1,500" },
    { code: "FESTIVE20", discountPercent: 20, minSpend: 3999, maxDiscount: 1200, desc: "20% off on luxury catalog above ₹3,999" },
    { code: "WELCOME100", flatDiscount: 100, minSpend: 999, desc: "Flat ₹100 instant cash discount" }
  ],

  sellers: [
    { id: "s1", name: "Aura Precision Labs", rating: 4.9, totalOrders: 1420, verified: true, dispatchTime: "24 Hours" },
    { id: "s2", name: "Nomad Atelier Direct", rating: 4.8, totalOrders: 980, verified: true, dispatchTime: "Same Day" }
  ],

  products: [
    {
      id: "sm-01",
      title: "Chronos Voyager Automatic 42mm",
      category: "electronics",
      subcategory: "Timepieces",
      brand: "Chronos",
      sellerId: "s1",
      price: 4999,
      originalPrice: 7499,
      discountPercent: 33,
      rating: 4.9,
      reviewCount: 148,
      stock: 14,
      tag: "Bestseller",
      dealEndTimestamp: Date.now() + 86400000 * 2, // 48 hrs flash deal
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
        "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80"
      ],
      colors: ["#1e293b", "#334155", "#0284c7"],
      sizes: ["40mm", "42mm"],
      specs: {
        "Movement": "Japanese NH35A Automatic",
        "Glass": "Anti-Reflective Sapphire Crystal",
        "Water Resistance": "100M / 10 ATM",
        "Case Material": "316L Surgical Grade Steel",
        "Warranty": "2 Years Official International"
      },
      description: "Engineered for uncompromising reliability. Features precision automatic winding, surgical-grade 316L steel construction, and scratch-proof sapphire crystal glass.",
      features: [
        "41-Hour Power Reserve with bidirectional winding rotor",
        "Super-LumiNova BGW9 luminous hands and indices",
        "Solid link stainless steel bracelet with micro-adjustment clasp"
      ],
      shipping: "Dispatches within 24 Hours. Delivered across India in 3-5 business days."
    },
    {
      id: "sm-02",
      title: "Nomad Stealth Apex Hauler 28L",
      category: "fashion",
      subcategory: "Urban Backpacks",
      brand: "NomadCarry",
      sellerId: "s2",
      price: 3299,
      originalPrice: 4999,
      discountPercent: 34,
      rating: 4.8,
      reviewCount: 92,
      stock: 22,
      tag: "Trending",
      dealEndTimestamp: null,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80"
      ],
      colors: ["#0f172a", "#374151"],
      sizes: ["24L", "28L"],
      specs: {
        "Material": "840D Ballistic Cordura Nylon",
        "Zippers": "Weatherproof YKK AquaGuard",
        "Laptop Sleeve": "Suspended Padded (Up to 16-inch M3 Pro)",
        "Capacity": "28 Liters Expandable",
        "Weight": "980 grams"
      },
      description: "An impenetrable fortress for your tech and daily essentials. Built with indestructible 840D Cordura and seam-sealed weatherproof zippers.",
      features: [
        "Ergonomic airflow back panel with luggage pass-through strap",
        "Clamshell 180° opening for rapid security checkpoint transit",
        "Hidden magnetic passport & quick-access transit card pocket"
      ],
      shipping: "Free Express Shipping with full transit insurance."
    },
    {
      id: "sm-03",
      title: "Noir Royal Oud & Amber Extrait 60ml",
      category: "fragrance",
      subcategory: "Extrait De Parfum",
      brand: "L'Artisan",
      sellerId: "s1",
      price: 2499,
      originalPrice: 3499,
      discountPercent: 28,
      rating: 4.9,
      reviewCount: 64,
      stock: 8,
      tag: "Limited Batch",
      dealEndTimestamp: Date.now() + 86400000 * 3,
      images: [
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
        "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=80"
      ],
      colors: ["#b45309"],
      sizes: ["60ml", "100ml"],
      specs: {
        "Concentration": "Extrait de Parfum (35% Oil Concentration)",
        "Top Notes": "Cardamom, Smoked Bergamot",
        "Heart Notes": "Cambodian Aged Oud, Moroccan Rose",
        "Base Notes": "Rich Amber, Smoked Cedar, Madagascar Vanilla",
        "Longevity": "12-16 Hours on Skin / 24 Hours on Fabric"
      },
      description: "Small-batch hand-crafted artisanal extrait combining the smoky warmth of wild harvested oud with rich golden amber accords.",
      features: [
        "Pure IFRA compliant essential oils without synthetic fillers",
        "Heavy weighted Italian crystal flacon with magnetic cap",
        "Signature presentation box included"
      ],
      shipping: "Dispatched in temperature-controlled protective bubble packaging."
    },
    {
      id: "sm-04",
      title: "Aura Studio Hi-Res ANC Wireless Headphones",
      category: "electronics",
      subcategory: "Smart Audio",
      brand: "AuraTech",
      sellerId: "s1",
      price: 5999,
      originalPrice: 8999,
      discountPercent: 33,
      rating: 4.7,
      reviewCount: 210,
      stock: 18,
      tag: "Top Rated",
      dealEndTimestamp: null,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80"
      ],
      colors: ["#000000", "#e2e8f0"],
      sizes: ["Over-Ear"],
      specs: {
        "Drivers": "40mm Custom Bio-Cellulose Diaphragms",
        "ANC": "Hybrid Active Noise Cancellation (-42dB)",
        "Battery Life": "55 Hours (ANC Off) / 40 Hours (ANC On)",
        "Bluetooth": "v5.3 with LDAC / AAC / aptX HD",
        "Weight": "245 grams"
      },
      description: "Immersive studio-grade acoustic clarity. Custom bio-cellulose dynamic drivers deliver punchy bass and crystalline high frequencies with industry-leading hybrid ANC.",
      features: [
        "Multipoint connectivity: Switch seamlessly between laptop and phone",
        "Memory-foam ear cushions wrapped in breathable protein leather",
        "10-Minute Fast Charge gives 6 hours of continuous playback"
      ],
      shipping: "Same-day dispatch for orders received before 2:00 PM."
    },
    {
      id: "sm-05",
      title: "Zenith Solid Walnut Desk Mat & Organizer",
      category: "home",
      subcategory: "Desk Mats",
      brand: "Zenith Living",
      sellerId: "s2",
      price: 1899,
      originalPrice: 2799,
      discountPercent: 32,
      rating: 4.8,
      reviewCount: 41,
      stock: 35,
      tag: "Handmade",
      dealEndTimestamp: null,
      images: [
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
        "https://images.unsplash.com/photo-1581291518655-9523c932ded2?w=800&q=80"
      ],
      colors: ["#78350f", "#1f2937"],
      sizes: ["80x40 cm", "90x45 cm"],
      specs: {
        "Material": "Natural Vegan Saddle Leather + Solid Walnut Accents",
        "Base": "Non-Slip Eco Cork Lining",
        "Water Resistance": "Hydrophobic Oleophobic Coating",
        "Thickness": "3.5mm Cushioning"
      },
      description: "Elevate your desktop ergonomics with dual-layer premium saddle leather and sustainably sourced solid walnut docking bays for stylus and cables.",
      features: [
        "Integrated magnetic pen dock and cable route groove",
        "Stain-resistant smooth tracking surface optimized for optical sensors",
        "Includes micro-suede polishing pouch"
      ],
      shipping: "Standard courier delivery in 3-4 working days."
    },
    {
      id: "sm-06",
      title: "UrbanForge Minimalist RFID Bifold Cardholder",
      category: "fashion",
      subcategory: "Minimalist Wallets",
      brand: "UrbanForge",
      sellerId: "s2",
      price: 1299,
      originalPrice: 1999,
      discountPercent: 35,
      rating: 4.9,
      reviewCount: 115,
      stock: 45,
      tag: "Essential",
      dealEndTimestamp: null,
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80"
      ],
      colors: ["#1e293b", "#451a03"],
      sizes: ["Compact (8 Cards)"],
      specs: {
        "Leather": "Full-Grain Vegetable Tanned Italian Cowhide",
        "Shielding": "German 13.56 MHz RFID Blocking Foil",
        "Card Capacity": "Up to 10 cards + Quick-Access Cash Strap",
        "Dimensions": "10.2 x 7.0 x 0.8 cm"
      },
      description: "Slim profile wallet engineered from full-grain vegetable tanned leather with certified RFID shielding technology against digital theft.",
      features: [
        "Ultra-thin 8mm profile fits seamlessly into front pockets",
        "Patented pull-tab mechanism for instant access to secondary cards",
        "Develops a rich organic patina over time"
      ],
      shipping: "Free all-India delivery via Delhivery Air Express."
    }
  ],

  reviews: [
    {
      productId: "sm-01",
      author: "Vikram R.",
      rating: 5,
      date: "August 14, 2026",
      verified: true,
      title: "Exceptional craftsmanship for the price point",
      comment: "The sapphire crystal is super crisp and the automatic movement has lost less than 4 seconds over an entire week of daily wear. Phenomenal quality.",
      helpfulCount: 24
    },
    {
      productId: "sm-02",
      author: "Pooja Mehta",
      rating: 5,
      date: "July 28, 2026",
      verified: true,
      title: "The ultimate laptop backpack for daily commute",
      comment: "Weatherproofing is tested and proven in heavy Mumbai rains. My MacBook remained completely dry. The weight distribution straps are comfortable.",
      helpfulCount: 19
    }
  ],

  qa: [
    {
      productId: "sm-01",
      question: "Is the case genuine 316L steel or plated alloy?",
      answer: "Hello! The casing and solid bracelet are 100% solid 316L surgical grade stainless steel, ensuring zero corrosion and hypoallergenic wear.",
      answeredBy: "Aura Precision Labs (Verified Seller)"
    },
    {
      productId: "sm-02",
      question: "Does it fit a 16-inch MacBook Pro easily?",
      answer: "Yes, the suspended fleece-lined laptop sleeve easily accommodates up to 16-inch laptops with extra clearance for chargers.",
      answeredBy: "Nomad Atelier Direct (Verified Seller)"
    }
  ]
};

// State Manager Initializer
(function initShopMarketsState() {
  if (!localStorage.getItem('sm_products_db')) {
    localStorage.setItem('sm_products_db', JSON.stringify(SM_DATA.products));
  }
  if (!localStorage.getItem('sm_cart_db')) {
    localStorage.setItem('sm_cart_db', JSON.stringify([]));
  }
  if (!localStorage.getItem('sm_wishlist_db')) {
    localStorage.setItem('sm_wishlist_db', JSON.stringify([]));
  }
  if (!localStorage.getItem('sm_compare_db')) {
    localStorage.setItem('sm_compare_db', JSON.stringify([]));
  }
  if (!localStorage.getItem('sm_recent_view_db')) {
    localStorage.setItem('sm_recent_view_db', JSON.stringify([]));
  }
  if (!localStorage.getItem('sm_search_history')) {
    localStorage.setItem('sm_search_history', JSON.stringify(["Automatic Watches", "Cordura Backpacks", "Artisan Parfum"]));
  }
  if (!localStorage.getItem('sm_applied_coupon')) {
    localStorage.setItem('sm_applied_coupon', JSON.stringify(null));
  }
  if (!localStorage.getItem('sm_theme_mode')) {
    localStorage.setItem('sm_theme_mode', 'light');
  }
  if (!localStorage.getItem('sm_customer_orders')) {
    localStorage.setItem('sm_customer_orders', JSON.stringify([
      {
        orderId: "SM-984210",
        date: "24 Aug 2026",
        status: "Shipped",
        timelineStep: 3, // 1: Ordered, 2: Confirmed, 3: Packed, 4: Shipped, 5: Out for delivery, 6: Delivered
        trackingNumber: "DEL-84920194IN",
        courier: "Delhivery Air Express",
        items: [
          { id: "sm-01", title: "Chronos Voyager Automatic 42mm", price: 4999, qty: 1, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80" }
        ],
        subtotal: 4999,
        discount: 500,
        shipping: 0,
        total: 4499,
        paymentMode: "Prepaid UPI",
        address: "Flat 402, Skyline Residency, Bandra West, Mumbai - 400050"
      }
    ]));
  }
})();