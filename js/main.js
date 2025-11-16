// Shared site behaviors: nav, cart modal, cart storage
const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));

// Year
const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu
const mobileBtn = $('#mobileMenuBtn');
const mobileMenu = $('#mobileMenu');
if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', ()=> mobileMenu.classList.toggle('hidden'));
}

// Cart helpers
const CART_KEY = 'cart';
function loadCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }
function cartTotal(cart){ return cart.reduce((s,i)=>s + i.price * i.qty, 0); }
function fmt(n){ return `$${n.toFixed(2)}`; }

// Render cart modal
const cartOverlay = $('#cartOverlay');
const cartItems = $('#cartItems');
const cartTotalEl = $('#cartTotal');
function renderCart(){
  if (!cartItems) return;
  const cart = loadCart();
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="text-gray-600">Your cart is empty.</p>';
  } else {
    cart.forEach((item, idx)=>{
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between py-2';
      row.innerHTML = `
        <div>
          <p class="font-medium">${item.title}</p>
          <p class="text-sm text-gray-600">${fmt(item.price)} x ${item.qty}</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-ghost" data-idx="${idx}" data-act="dec">-</button>
          <span>${item.qty}</span>
          <button class="btn-ghost" data-idx="${idx}" data-act="inc">+</button>
          <button class="btn-ghost" data-idx="${idx}" data-act="rm">Remove</button>
        </div>`;
      cartItems.appendChild(row);
    });
  }
  if (cartTotalEl) cartTotalEl.textContent = fmt(cartTotal(cart));
}

// Open/close cart
const openCartBtn = $('#openCartBtn');
const closeCartBtn = $('#closeCartBtn');
if (openCartBtn && cartOverlay) openCartBtn.addEventListener('click', ()=>{ cartOverlay.style.display='flex'; renderCart(); });
if (closeCartBtn && cartOverlay) closeCartBtn.addEventListener('click', ()=> cartOverlay.style.display='none');

// Clear cart
const clearCartBtn = $('#clearCartBtn');
if (clearCartBtn) clearCartBtn.addEventListener('click', ()=>{ saveCart([]); renderCart(); });

// Quantity and remove handlers (event delegation)
if (cartItems) cartItems.addEventListener('click', (e)=>{
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;
  const act = t.getAttribute('data-act');
  const idx = parseInt(t.getAttribute('data-idx')||'-1',10);
  if (!act || idx < 0) return;
  const cart = loadCart();
  if (act === 'inc') cart[idx].qty += 1;
  if (act === 'dec') cart[idx].qty = Math.max(1, cart[idx].qty - 1);
  if (act === 'rm') cart.splice(idx,1);
  saveCart(cart); renderCart();
});

// Expose helpers for store.js
window.__flames = { loadCart, saveCart, fmt };
