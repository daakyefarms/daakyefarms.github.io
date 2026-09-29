/**
 * Daakye Legacy Farms - Official Cart & WhatsApp Checkout Engine
 * Provides persistent order state, live subtotal calculations,
 * interactive button feedback, and formatted WhatsApp order generation.
 */

let cart = JSON.parse(localStorage.getItem('dl_cart') || '[]');
let toastTimeout = null;

function saveCart() {
    localStorage.setItem('dl_cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(name, price, unit, btnElement = null) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, unit, qty: 1 });
    }
    saveCart();

    // 1. Tactile Button Micro-Interaction Feedback
    if (btnElement) {
        const originalHtml = btnElement.innerHTML;
        btnElement.innerHTML = `<span class="flex items-center justify-center gap-1.5 text-white font-black"><svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg> Added to Order!</span>`;
        btnElement.classList.remove('bg-farm-900', 'bg-emerald-950');
        btnElement.classList.add('bg-emerald-600', 'scale-95');
        
        setTimeout(() => {
            btnElement.classList.remove('scale-95');
        }, 150);
        
        setTimeout(() => {
            btnElement.innerHTML = originalHtml;
            btnElement.classList.remove('bg-emerald-600');
            btnElement.classList.add('bg-farm-900');
            if (window.lucide) lucide.createIcons();
        }, 1400);
    }

    // 2. Display Bottom Toast Notification
    showToast(`🐖 Added ${name} (GH₵ ${price}/${unit}) to your order list!`);

    // 3. Smoothly Open Order Drawer so Customer Sees Immediate Progress
    toggleCartDrawer(true);
}

function showToast(msg) {
    const toast = document.getElementById('orderToast');
    const text = document.getElementById('toastMessage');
    if (!toast || !text) return;

    text.innerText = msg;
    toast.classList.remove('hidden');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3200);
}

function updateCartUI() {
    const list = document.getElementById('cartItemsList');
    const badge = document.getElementById('cartBadge');
    const totalDisp = document.getElementById('cartTotalDisplay');

    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    if (badge) {
        badge.innerText = totalQty;
        badge.classList.add('scale-125');
        setTimeout(() => badge.classList.remove('scale-125'), 200);
    }

    if (!list || !totalDisp) return;

    if (cart.length === 0) {
        list.innerHTML = `
            <div class="text-center py-10 space-y-3">
                <div class="w-12 h-12 mx-auto bg-stone-100 rounded-full flex items-center justify-center text-2xl">🐖</div>
                <p class="text-stone-500 text-xs font-semibold">Your order list is empty.<br>Browse our cuts and add items to order!</p>
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
            <div class="py-3 border-b border-stone-100 flex items-center justify-between gap-3">
                <div class="flex-1">
                    <p class="font-black text-xs text-stone-900 leading-tight">${item.name}</p>
                    <p class="text-[11px] text-amber-600 font-bold mt-0.5">GH₵ ${item.price.toLocaleString()} / ${item.unit}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="changeQty(${index}, -1)" class="w-6 h-6 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-black transition-colors" title="Decrease Quantity">-</button>
                    <span class="text-xs font-black text-stone-900 w-5 text-center">${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)" class="w-6 h-6 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-black transition-colors" title="Increase Quantity">+</button>
                    <span class="text-xs font-black text-emerald-800 ml-2 w-16 text-right">GH₵ ${subtotal.toLocaleString()}</span>
                </div>
            </div>
        `;
    });

    list.innerHTML = html;
    totalDisp.innerText = `GH₵ ${total.toLocaleString()}`;
}

function changeQty(index, delta) {
    if (!cart[index]) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Are you sure you want to clear your order list?')) {
        cart = [];
        saveCart();
    }
}

function toggleCartDrawer(forceOpen = null) {
    const drawer = document.getElementById('cartDrawer');
    if (!drawer) return;
    if (forceOpen === true) {
        drawer.classList.remove('hidden');
    } else if (forceOpen === false) {
        drawer.classList.add('hidden');
    } else {
        drawer.classList.toggle('hidden');
    }
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert('Your order list is empty! Please add products before checking out.');
        return;
    }

    let text = `Hello Daakye Legacy Farms! 🐖\n\nI would like to place an order from your website:\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        text += `• ${item.name} (${item.qty} ${item.unit}) - GH₵ ${subtotal.toLocaleString()}\n`;
    });
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 Estimated Total: GH₵ ${total.toLocaleString()}\n\n`;
    text += `📍 Delivery Destination: [Please specify your area/city]\n`;
    text += `Please confirm product availability, delivery fee, and payment details. Thank you!`;

    window.open(`https://wa.me/233243212359?text=${encodeURIComponent(text)}`, '_blank');
}

// Auto initialize on load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        updateCartUI();
    });
}
