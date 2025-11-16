// Store page: render product cards and add-to-cart
const { loadCart, saveCart, fmt } = window.__flames || {};
const grid = document.getElementById('productGrid');

const products = [
  { id: 'kit-basic', title: 'Starter UI Kit', desc: 'Clean components to bootstrap your site.', price: 39, img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop' },
  { id: 'payments', title: 'Payments Template', desc: 'Modern checkout and invoice flows.', price: 59, img: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=800&auto=format&fit=crop' },
  { id: 'diy-kit', title: 'DIY Hardware Kit', desc: 'All parts to assemble your own device.', price: 129, img: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop' },
  { id: 'icons', title: 'Icon Pack', desc: '200+ crisp icons in multiple styles.', price: 19, img: 'https://images.unsplash.com/photo-1493119508027-2b584f234d6c?q=80&w=800&auto=format&fit=crop' },
  { id: 'license', title: 'Commercial License', desc: 'One-time license for commercial use.', price: 99, img: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=800&auto=format&fit=crop' },
  { id: 'support', title: 'Priority Support', desc: 'Hands-on help for your launch.', price: 149, img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop' }
];

function cardTemplate(p){
  return `
  <div class="card product-card flex flex-col card-shadow">
    <img src="${p.img}" alt="${p.title}" class="w-full h-40 object-cover rounded-lg" />
    <h3 class="mt-4 text-lg font-semibold text-[color:var(--brand-navy)]">${p.title}</h3>
    <p class="mt-1 text-gray-600">${p.desc}</p>
    <div class="mt-4 flex items-center justify-between">
      <span class="text-[color:var(--brand-navy)] font-semibold">${fmt(p.price)}</span>
      <div class="flex items-center gap-2">
        <button class="btn-ghost qty-dec" aria-label="decrease">-</button>
        <input type="number" class="w-14 input qty" min="1" value="1" />
        <button class="btn-ghost qty-inc" aria-label="increase">+</button>
      </div>
    </div>
    <button class="btn-primary mt-4 add" data-id="${p.id}">Add to Cart</button>
  </div>`;
}

function render(){
  if (!grid) return;
  grid.innerHTML = products.map(cardTemplate).join('');
  // Attach handlers for each card
  grid.querySelectorAll('.product-card').forEach((card, i)=>{
    const qtyInput = card.querySelector('.qty');
    card.querySelector('.qty-inc').addEventListener('click', ()=>{ qtyInput.value = String(parseInt(qtyInput.value||'1',10)+1); });
    card.querySelector('.qty-dec').addEventListener('click', ()=>{ qtyInput.value = String(Math.max(1, parseInt(qtyInput.value||'1',10)-1)); });
    card.querySelector('.add').addEventListener('click', ()=>{
      const p = products[i];
      const qty = Math.max(1, parseInt(qtyInput.value||'1',10));
      const cart = loadCart();
      const existing = cart.findIndex(x=>x.id===p.id);
      if (existing >= 0) cart[existing].qty += qty; else cart.push({ id:p.id, title:p.title, price:p.price, qty });
      saveCart(cart);
      // Optional feedback
      const btn = card.querySelector('.add');
      btn.textContent = 'Added';
      setTimeout(()=>{ btn.textContent = 'Add to Cart'; }, 1000);
    });
  });
}

render();
