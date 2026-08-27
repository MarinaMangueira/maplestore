const CART_KEY = "maple-cart";

const itemsEl = document.getElementById("cart-items");
const subtotalEl = document.getElementById("cart-subtotal");
const totalEl = document.getElementById("cart-total");
const countEl = document.getElementById("cart-count");
const contentEl = document.getElementById("cart-content");
const emptyEl = document.getElementById("cart-empty");

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function atualizarContador(cart) {
  countEl.textContent = cart.reduce((total, item) => total + item.quantidade, 0);
}

function renderizarCarrinho() {
  const cart = getCart();
  atualizarContador(cart);

  if (!cart.length) {
    contentEl.hidden = true;
    emptyEl.hidden = false;
    return;
  }

  contentEl.hidden = false;
  emptyEl.hidden = true;

  itemsEl.innerHTML = cart.map((item) => `
    <article class="cart-item">
      <div class="cart-item__media">
        <img src="${item.imagem}" alt="${item.nome}">
      </div>
      <div class="cart-item__info">
        <span class="card__category">${item.categoriaLabel}</span>
        <h2>${item.nome}</h2>
        <span class="cart-item__price">${formatarPreco(item.preco)}</span>
        <button class="remove-link" data-remove="${item.id}">Remover</button>
      </div>
      <div class="quantity-control" aria-label="Quantidade de ${item.nome}">
        <button type="button" data-minus="${item.id}" aria-label="Diminuir quantidade">−</button>
        <span>${item.quantidade}</span>
        <button type="button" data-plus="${item.id}" aria-label="Aumentar quantidade">+</button>
      </div>
      <strong class="cart-item__total">${formatarPreco(item.preco * item.quantidade)}</strong>
    </article>
  `).join("");

  const subtotal = cart.reduce((total, item) => total + item.preco * item.quantidade, 0);
  subtotalEl.textContent = formatarPreco(subtotal);
  totalEl.textContent = formatarPreco(subtotal);

  itemsEl.querySelectorAll("[data-minus]").forEach((button) => {
    button.addEventListener("click", () => alterarQuantidade(button.dataset.minus, -1));
  });

  itemsEl.querySelectorAll("[data-plus]").forEach((button) => {
    button.addEventListener("click", () => alterarQuantidade(button.dataset.plus, 1));
  });

  itemsEl.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removerProduto(button.dataset.remove));
  });

  itemsEl.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.parentElement.classList.add("image-fallback");
      img.remove();
    }, { once: true });
  });
}

function alterarQuantidade(id, delta) {
  const cart = getCart();
  const item = cart.find((produto) => produto.id === id);
  if (!item) return;

  item.quantidade += delta;
  if (item.quantidade <= 0) {
    saveCart(cart.filter((produto) => produto.id !== id));
  } else {
    item.quantidade = Math.min(item.quantidade, item.estoque);
    saveCart(cart);
  }

  renderizarCarrinho();
}

function removerProduto(id) {
  saveCart(getCart().filter((item) => item.id !== id));
  renderizarCarrinho();
}

renderizarCarrinho();
