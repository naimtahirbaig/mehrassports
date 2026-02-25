/* ============================================
   MEHRAS SPORTS — SHOPPING CART & CHECKOUT
   ============================================ */
const MehrasCart = {
  items: [],
  
  init() {
    this.items = JSON.parse(localStorage.getItem('mehras_cart') || '[]');
    this.updateUI();
    this.renderCartPage();
    this.renderCheckoutPage();
    this.bindEvents();
  },

  save() {
    localStorage.setItem('mehras_cart', JSON.stringify(this.items));
    this.updateUI();
  },

  add(product) {
    const existing = this.items.find(i => i.id === product.id && i.size === product.size && i.color === product.color);
    if (existing) {
      existing.qty += product.qty || 1;
    } else {
      this.items.push({ ...product, qty: product.qty || 1 });
    }
    this.save();
    this.showNotification(product.name);
  },

  remove(index) {
    this.items.splice(index, 1);
    this.save();
    this.renderCartPage();
    this.renderCheckoutPage();
  },

  updateQty(index, qty) {
    if (qty < 1) return this.remove(index);
    this.items[index].qty = qty;
    this.save();
    this.renderCartPage();
    this.renderCheckoutPage();
  },

  clear() {
    this.items = [];
    this.save();
    this.renderCartPage();
    this.renderCheckoutPage();
  },

  getTotal() {
    return this.items.reduce((sum, i) => sum + (i.price * i.qty), 0);
  },

  getCount() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  updateUI() {
    // Update cart badge in header
    document.querySelectorAll('.cart-count').forEach(el => {
      const count = this.getCount();
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  showNotification(name) {
    // Remove existing
    const old = document.querySelector('.cart-notification');
    if (old) old.remove();
    
    const n = document.createElement('div');
    n.className = 'cart-notification';
    n.innerHTML = `
      <div class="cart-notif-inner">
        <i class="fas fa-check-circle"></i>
        <div>
          <strong>${name}</strong>
          <span>added to cart</span>
        </div>
        <a href="${window.location.pathname.includes('/products/') ? '../cart.html' : 'cart.html'}" class="cart-notif-btn">View Cart</a>
      </div>
    `;
    document.body.appendChild(n);
    setTimeout(() => n.classList.add('show'), 10);
    setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 400); }, 3500);
  },

  renderCartPage() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    const summaryEl = document.getElementById('cartSummary');
    
    if (this.items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <i class="fas fa-shopping-cart"></i>
          <h3>Your Cart is Empty</h3>
          <p>Browse our products and add items to your cart</p>
          <a href="index.html" class="cta-btn" style="margin-top:20px">Continue Shopping</a>
        </div>
      `;
      if (summaryEl) summaryEl.style.display = 'none';
      return;
    }
    
    if (summaryEl) summaryEl.style.display = 'block';
    
    let html = '<div class="cart-table"><div class="cart-header-row"><span>Product</span><span>Price</span><span>Quantity</span><span>Total</span><span></span></div>';
    
    this.items.forEach((item, i) => {
      const imgPath = window.location.pathname.includes('/products/') ? `../${item.img}` : item.img;
      html += `
        <div class="cart-row">
          <div class="cart-product">
            <img src="${imgPath}" alt="${item.name}">
            <div>
              <h4>${item.name}</h4>
              ${item.size ? `<span class="cart-variant">Size: ${item.size}</span>` : ''}
              ${item.color ? `<span class="cart-variant">Color: ${item.color}</span>` : ''}
            </div>
          </div>
          <div class="cart-price">$${item.price.toFixed(2)}</div>
          <div class="cart-qty">
            <button onclick="MehrasCart.updateQty(${i}, ${item.qty - 1})"><i class="fas fa-minus"></i></button>
            <span>${item.qty}</span>
            <button onclick="MehrasCart.updateQty(${i}, ${item.qty + 1})"><i class="fas fa-plus"></i></button>
          </div>
          <div class="cart-total">$${(item.price * item.qty).toFixed(2)}</div>
          <button class="cart-remove" onclick="MehrasCart.remove(${i})"><i class="fas fa-trash-alt"></i></button>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
    
    // Update summary
    const subtotal = this.getTotal();
    const shipping = subtotal >= 500 ? 0 : 49.99;
    const total = subtotal + shipping;
    
    document.getElementById('cartSubtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('cartShipping').textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
    document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
    if (shipping === 0) {
      document.getElementById('cartShipping').style.color = '#25D366';
      document.getElementById('cartShipping').style.fontWeight = '700';
    }
  },

  renderCheckoutPage() {
    const container = document.getElementById('checkoutItems');
    if (!container) return;
    
    if (this.items.length === 0) {
      window.location.href = 'cart.html';
      return;
    }
    
    let html = '';
    this.items.forEach(item => {
      html += `
        <div class="checkout-item">
          <img src="${item.img}" alt="${item.name}">
          <div class="checkout-item-info">
            <h4>${item.name}</h4>
            <span>Qty: ${item.qty}</span>
          </div>
          <span class="checkout-item-price">$${(item.price * item.qty).toFixed(2)}</span>
        </div>
      `;
    });
    container.innerHTML = html;
    
    const subtotal = this.getTotal();
    const shipping = subtotal >= 500 ? 0 : 49.99;
    const total = subtotal + shipping;
    
    if (document.getElementById('checkoutSubtotal')) {
      document.getElementById('checkoutSubtotal').textContent = '$' + subtotal.toFixed(2);
      document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
      document.getElementById('checkoutTotal').textContent = '$' + total.toFixed(2);
    }
  },

  getOrderSummaryText() {
    let text = 'Order from Mehras Sports:\n';
    this.items.forEach(item => {
      text += `- ${item.name} x${item.qty} = $${(item.price * item.qty).toFixed(2)}\n`;
    });
    const subtotal = this.getTotal();
    const shipping = subtotal >= 500 ? 0 : 49.99;
    text += `\nSubtotal: $${subtotal.toFixed(2)}`;
    text += `\nShipping: ${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}`;
    text += `\nTotal: $${(subtotal + shipping).toFixed(2)}`;
    return text;
  },

  proceedToPayPal() {
    const total = this.getTotal() + (this.getTotal() >= 500 ? 0 : 49.99);
    const desc = encodeURIComponent(this.getOrderSummaryText());
    // PayPal.me link
    window.open(`https://www.paypal.com/paypalme/junaiduol/${total.toFixed(2)}USD`, '_blank');
    // Also open PayPal send money as backup
    this.showPaymentConfirm('PayPal', total);
  },

  proceedToWise() {
    const total = this.getTotal() + (this.getTotal() >= 500 ? 0 : 49.99);
    window.open('https://wise.com/pay/me/naimb50', '_blank');
    this.showPaymentConfirm('Wise', total);
  },

  proceedToWhatsApp() {
    const total = this.getTotal() + (this.getTotal() >= 500 ? 0 : 49.99);
    const form = document.getElementById('checkoutForm');
    let customerInfo = '';
    if (form) {
      const fd = new FormData(form);
      customerInfo = `\n\nCustomer: ${fd.get('name') || 'N/A'}\nEmail: ${fd.get('email') || 'N/A'}\nPhone: ${fd.get('phone') || 'N/A'}\nAddress: ${fd.get('address') || 'N/A'}, ${fd.get('city') || ''}, ${fd.get('country') || ''}`;
    }
    const msg = encodeURIComponent(this.getOrderSummaryText() + customerInfo);
    window.open(`https://wa.me/+923417007400?text=${msg}`, '_blank');
  },

  showPaymentConfirm(method, total) {
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
      <div class="payment-modal-content">
        <div class="payment-modal-icon"><i class="fas fa-clock"></i></div>
        <h3>Complete Your ${method} Payment</h3>
        <p class="payment-modal-amount">Amount: <strong>$${total.toFixed(2)} USD</strong></p>
        <div class="payment-modal-steps">
          <div class="pm-step"><span>1</span> Complete the payment of <strong>$${total.toFixed(2)}</strong> on ${method}</div>
          <div class="pm-step"><span>2</span> Send payment confirmation via WhatsApp</div>
          <div class="pm-step"><span>3</span> We'll process & ship your order within 24-48 hours</div>
        </div>
        ${method === 'PayPal' ? '<p class="payment-modal-email">PayPal: <strong>junaid.uol.edu.pk@gmail.com</strong></p>' : '<p class="payment-modal-email">Wise: <strong>@naimb50</strong></p>'}
        <div class="payment-modal-actions">
          <a href="https://wa.me/+923417007400?text=${encodeURIComponent('Hi! I just made a ' + method + ' payment of $' + total.toFixed(2) + ' for my order. Please confirm.')}" target="_blank" class="pm-btn-wa"><i class="fab fa-whatsapp"></i> Confirm on WhatsApp</a>
          <button onclick="this.closest('.payment-modal').remove()" class="pm-btn-close">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
  },

  bindEvents() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const data = btn.dataset;
        const sizeEl = document.getElementById('productSize');
        const colorEl = document.getElementById('productColor');
        const qtyEl = document.getElementById('productQty');
        
        this.add({
          id: data.id,
          name: data.name,
          price: parseFloat(data.price),
          img: data.img,
          size: sizeEl ? sizeEl.value : '',
          color: colorEl ? colorEl.value : '',
          qty: qtyEl ? parseInt(qtyEl.value) : 1
        });
      });
    });

    // Quantity controls on product pages
    document.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
      });
    });
    document.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        input.value = parseInt(input.value) + 1;
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => MehrasCart.init());
