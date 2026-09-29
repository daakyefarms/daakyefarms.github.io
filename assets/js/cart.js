/**
 * Daakye Legacy Farms - Official Cart & WhatsApp Checkout Engine
 * Provides resilient order state (with localStorage & in-memory fallback),
 * live subtotal calculations, tactile button micro-interactions,
 * instant drawer sliding, and structured WhatsApp order messaging.
 */

// Resilient Cart Storage (works in file://, iframes, and local servers)
const CART_STORAGE_KEY = 'daakye-legacy-farms:cart:v1';
let cartMemory = [];

function getStoredCart() {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            const raw = localStorage.getItem(CART_STORAGE_KEY);
            if (raw) {
                const items = JSON.parse(raw);
                if (Array.isArray(items)) return items.filter(item =>
                    item && typeof item.name === 'string' &&
                    typeof item.unit === 'string' && Number.isFinite(item.price) &&
                    item.price >= 0 && Number.isFinite(item.qty) && item.qty > 0);
            }
        }
    } catch (e) {
        console.warn('LocalStorage not available, falling back to memory store:', e);
    }
    return cartMemory;
}

function persistCart(items) {
    cartMemory = items;
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    } catch (e) {
        console.warn('LocalStorage save failed:', e);
    }
}

function escapeCartText(value) {
    return value.replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
}

let cart = getStoredCart();
let toastTimer = null;

function saveCart() {
    persistCart(cart);
    updateCartUI();
}

/**
 * Add an item to the order list
 * @param {string} name - Product Cut Name
 * @param {number} price - Unit Price in GH₵
 * @param {string} unit - Pricing Unit ('kg', 'head', 'set')
 * @param {HTMLElement|null} btnElement - Optional button for micro-feedback
 */
function addToCart(name, price, unit = 'kg', btnElement = null) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price: Number(price), unit, qty: 1 });
    }
    saveCart();

    // 1. Tactile Button Micro-Interaction Feedback
    if (btnElement) {
        const originalHtml = btnElement.innerHTML;
        btnElement.innerHTML = `
            <span class="flex items-center justify-center gap-1.5 text-white font-black animate-pulse">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                </svg>
                Added to Order List!
            </span>
        `;
        btnElement.classList.remove('bg-farm-900', 'bg-emerald-950', 'hover:bg-farm-800');
        btnElement.classList.add('bg-emerald-600', 'scale-95');
        
        setTimeout(() => {
            btnElement.classList.remove('scale-95');
        }, 150);
        
        setTimeout(() => {
            btnElement.innerHTML = originalHtml;
            btnElement.classList.remove('bg-emerald-600');
            btnElement.classList.add('bg-farm-900', 'hover:bg-farm-800');

        }, 1500);
    }

    // 2. Display Bottom Toast Notification
    showToast(`🐖 Added ${name} (GH₵ ${price}/${unit}) to your order list!`);

    // 3. Immediately Slide Open the Order Drawer so the Customer Clearly Sees It
    toggleCartDrawer(true);
}

/**
 * Show a sleek bottom alert toast
 */
function showToast(msg) {
    if (typeof document === 'undefined') return;
    const toast = document.getElementById('orderToast');
    const text = document.getElementById('toastMessage');
    if (!toast || !text) return;

    text.innerText = msg;
    toast.classList.remove('hidden');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3500);
}

/**
 * Re-renders the cart drawer line items, badges, and grand total
 */
function updateCartUI() {
    if (typeof document === 'undefined') return;
    const list = document.getElementById('cartItemsList');
    const badge = document.getElementById('cartBadge');
    const floatingBadge = document.getElementById('floatingCartBadge');
    const totalDisp = document.getElementById('cartTotalDisplay');

    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);

    // Update Header Badge
    if (badge) {
        badge.innerText = totalQty;
        badge.classList.remove('hidden');
        badge.classList.add('scale-125');
        setTimeout(() => badge.classList.remove('scale-125'), 200);
    }

    // Update Floating Pill Badge if present
    if (floatingBadge) {
        floatingBadge.innerText = totalQty;
        floatingBadge.classList.toggle('hidden', totalQty === 0);
    }

    if (!list || !totalDisp) return;

    if (cart.length === 0) {
        list.innerHTML = `
            <div class="text-center py-12 space-y-3">
                <div class="w-16 h-16 mx-auto bg-stone-100 rounded-full flex items-center justify-center text-3xl shadow-inner">🐖</div>
                <p class="text-stone-700 text-sm font-bold">Your order list is empty</p>
                <p class="text-stone-400 text-xs">Browse our pork cuts and click "Add to Order List" to get started!</p>
            </div>
        `;
        totalDisp.innerText = `GH₵ 0`;
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        html += `
            <div class="py-3.5 border-b border-stone-100 flex items-center justify-between gap-3">
                <div class="flex-1 min-w-0">
                    <p class="font-black text-xs text-stone-900 truncate">${escapeCartText(item.name)}</p>
                    <p class="text-[11px] text-amber-600 font-bold mt-0.5">GH₵ ${item.price.toLocaleString()} / ${escapeCartText(item.unit)}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="changeQty(${index}, -1)" class="w-7 h-7 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-black transition-colors flex items-center justify-center shadow-xs" title="Decrease Quantity">−</button>
                    <span class="text-xs font-black text-stone-900 w-6 text-center">${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)" class="w-7 h-7 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-black transition-colors flex items-center justify-center shadow-xs" title="Increase Quantity">+</button>
                    <span class="text-xs font-black text-emerald-800 ml-2 w-20 text-right">GH₵ ${subtotal.toLocaleString()}</span>
                    <button onclick="removeItem(${index})" class="text-stone-400 hover:text-red-500 text-xs p-1 ml-1" title="Remove Item">✕</button>
                </div>
            </div>
        `;
    });

    list.innerHTML = html;
    totalDisp.innerText = `GH₵ ${total.toLocaleString()}`;
}

/**
 * Increment or decrement item quantity
 */
function changeQty(index, delta) {
    if (!cart[index]) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
}

/**
 * Remove an item completely
 */
function removeItem(index) {
    if (!cart[index]) return;
    cart.splice(index, 1);
    saveCart();
}

/**
 * Clear the entire order list
 */
function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Are you sure you want to clear your current order list?')) {
        cart = [];
        saveCart();
    }
}

/**
 * Toggle or force open/close the Order List Drawer
 */
function toggleCartDrawer(forceOpen = null) {
    if (typeof document === 'undefined') return;
    const drawer = document.getElementById('cartDrawer');
    if (!drawer) return;

    if (forceOpen === true) {
        drawer.classList.remove('hidden');
        drawer.style.display = 'block';
        document.body.classList.add('overflow-hidden');
    } else if (forceOpen === false) {
        drawer.classList.add('hidden');
        drawer.style.display = 'none';
        document.body.classList.remove('overflow-hidden');
    } else {
        const isHidden = drawer.classList.contains('hidden') || drawer.style.display === 'none';
        if (isHidden) {
            drawer.classList.remove('hidden');
            drawer.style.display = 'block';
            document.body.classList.add('overflow-hidden');
        } else {
            drawer.classList.add('hidden');
            drawer.style.display = 'none';
            document.body.classList.remove('overflow-hidden');
        }
    }
}

/**
 * Build formatted order message and send to WhatsApp (+233 24 321 2359)
 */
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert('Your order list is empty! Please add pork cuts or breeding stock before checking out.');
        return;
    }

    let text = `Hello Daakye Legacy Farms! 🐖\n\nI would like to place an order from your website:\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        text += `• ${item.name} (${item.qty} ${item.unit}) — GH₵ ${subtotal.toLocaleString()}\n`;
    });
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 Estimated Total: GH₵ ${total.toLocaleString()}\n\n`;
    text += `📍 Delivery Destination: [Please enter your area/city in Accra, Nsawam, or Koforidua]\n`;
    text += `Please confirm fresh cut availability, delivery schedule, and mobile money payment details. Thank you!`;

    const url = `https://wa.me/233243212359?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Auto initialize on DOM load
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            updateCartUI();
        });
    } else {
        updateCartUI();
    }
}
