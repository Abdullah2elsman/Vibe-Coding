/**
 * Aurora E-Commerce - Core Logic
 */

// Global State
let allProducts = [];
let cart = [];

/**
 * Initializes the application
 */
document.addEventListener('DOMContentLoaded', () => {
    loadCart(); // Load cart from localStorage
    getProducts();
});

/**
 * Fetches data from local json-server API.
 */
async function getProducts() {
    const loader = document.getElementById('loader');
    const container = document.getElementById('products-container');
    
    try {
        const response = await fetch('http://localhost:3000/products');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allProducts = await response.json();
        
        loader.style.display = 'none';
        container.classList.remove('hidden');
        
        renderProducts(allProducts, container);
        
    } catch (error) {
        console.error("Error fetching products:", error);
        loader.innerHTML = `<p style="color: #ef4444;">Failed to load products. Please try again later.</p>`;
    }
}

/**
 * Renders the products array dynamically into the HTML grid.
 */
function renderProducts(products, container) {
    container.innerHTML = '';
    
    products.forEach((product, index) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.style.animation = `fadeIn 0.6s ease-out ${index * 0.05}s both`;
        
        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h2 class="product-title">${product.title}</h2>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * Load cart from localStorage
 */
function loadCart() {
    const savedCart = localStorage.getItem('auroraCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartUI();
}

/**
 * Save cart to localStorage
 */
function saveCart() {
    localStorage.setItem('auroraCart', JSON.stringify(cart));
}

/**
 * Adds a product to the cart array
 */
function addToCart(productId) {
    // Find the product in our global array (safely converting IDs to strings to prevent type mismatches)
    const product = allProducts.find(p => String(p.id) === String(productId));
    if (!product) return;

    // Check if it already exists in the cart
    const existingItem = cart.find(item => String(item.id) === String(productId));

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    toggleCart(null, true); // Optionally auto-open cart when adding
}

/**
 * Updates the quantity of a cart item
 */
function updateCartQuantity(productId, change) {
    // Convert both to strings to ensure safe comparison against the cart array
    const itemIndex = cart.findIndex(item => String(item.id) === String(productId));
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        
        // Remove if quantity becomes 0
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    
    saveCart();
    updateCartUI();
}

/**
 * Updates the Cart Sidebar DOM and Header Badge
 */
function updateCartUI() {
    const cartCountElement = document.getElementById('cart-count');
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    
    // Calculate totals
    let totalItems = 0;
    let totalPrice = 0;
    
    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += (item.price * item.quantity);
    });
    
    // Update header badge with bounce animation
    if (cartCountElement.textContent !== totalItems.toString()) {
        cartCountElement.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 200);
    }
    cartCountElement.textContent = totalItems;
    
    // Update Sidebar items
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; margin-top: 2rem;">Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            `;
            cartContainer.appendChild(row);
        });
    }
    
    // Update Total Price
    cartTotalElement.textContent = '$' + totalPrice.toFixed(2);
}

/**
 * Toggles the visibility of the Cart Sidebar
 * @param {Event} e - Optional event object to prevent default link behavior
 * @param {boolean} forceOpen - If true, always opens the cart
 */
function toggleCart(e = null, forceOpen = false) {
    if (e) {
        e.preventDefault();
    }
    
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    
    if (forceOpen) {
        sidebar.classList.remove('hidden');
        overlay.classList.remove('hidden');
    } else {
        sidebar.classList.toggle('hidden');
        overlay.classList.toggle('hidden');
    }
}
