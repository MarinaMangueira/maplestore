const CART_KEY = "maple-cart";

const form = document.getElementById("checkout-form");
const itemsEl = document.getElementById("checkout-items");
const subtotalEl = document.getElementById("checkout-subtotal");
const totalEl = document.getElementById("checkout-total");
const countEl = document.getElementById("cart-count");
const emptyEl = document.getElementById("checkout-empty");
const errorEl = document.getElementById("checkout-error");
const successEl = document.getElementById("success-box");

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const cart = getCart();
countEl.textContent = cart.reduce((total, item) => total + item.quantidade, 0);

if (!cart.length) {
  form.hidden = true;
  emptyEl.hidden = false;
} else {
  const subtotal = cart.reduce((total, item) => total + item.preco * item.quantidade, 0);

  itemsEl.innerHTML = cart.map((item) => `
    <div class="checkout-item">
      <span>${item.quantidade}× ${item.nome}</span>
      <strong>${formatarPreco(item.preco * item.quantidade)}</strong>
    </div>
  `).join("");

  subtotalEl.textContent = formatarPreco(subtotal);
  totalEl.textContent = formatarPreco(subtotal);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorEl.hidden = true;

  if (!form.checkValidity()) {
    errorEl.hidden = false;
    form.reportValidity();
    return;
  }

  localStorage.removeItem(CART_KEY);
  form.hidden = true;
  successEl.hidden = false;
  countEl.textContent = "0";
  window.scrollTo({ top: 0, behavior: "smooth" });
});