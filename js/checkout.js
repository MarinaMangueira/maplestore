const CART_KEY = "maple-cart";

const state = {
  produtos: [],
  carrinho: carregarCarrinho(),
};

const els = {
  form: document.getElementById("checkout-form"),
  empty: document.getElementById("checkout-empty"),
  success: document.getElementById("checkout-success"),
  items: document.getElementById("checkout-items"),
  count: document.getElementById("cart-count"),
  subtotal: document.getElementById("checkout-subtotal"),
  total: document.getElementById("checkout-total"),
};

function carregarCarrinho() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CART_KEY));
    return salvo && typeof salvo === "object" ? salvo : {};
  } catch {
    return {};
  }
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function itensDoCarrinho() {
  return Object.entries(state.carrinho)
    .map(([id, quantidade]) => {
      const produto = state.produtos.find((p) => p.id === id);
      return produto && quantidade > 0 ? { produto, quantidade } : null;
    })
    .filter(Boolean);
}

function renderizarResumo() {
  const itens = itensDoCarrinho();
  const quantidadeTotal = itens.reduce((soma, item) => soma + item.quantidade, 0);
  const subtotal = itens.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0);

  els.count.textContent = quantidadeTotal;
  els.subtotal.textContent = formatarPreco(subtotal);
  els.total.textContent = formatarPreco(subtotal);

  els.items.innerHTML = itens.map(({ produto: p, quantidade }) => `
    <div class="checkout-item">
      <div class="checkout-item__thumb">
        <img src="${p.imagem}" alt="" onerror="this.style.display='none'">
        <span>${quantidade}×</span>
      </div>
      <div>
        <strong>${p.nome}</strong>
        <small>${formatarPreco(p.preco)} cada</small>
      </div>
      <strong>${formatarPreco(p.preco * quantidade)}</strong>
    </div>`).join("");
}

async function carregarProdutos() {
  try {
    const resposta = await fetch("data/products.json");
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    state.produtos = await resposta.json();

    const itens = itensDoCarrinho();
    if (!itens.length) {
      els.empty.hidden = false;
      els.form.hidden = true;
      return;
    }

    renderizarResumo();
  } catch (erro) {
    els.empty.hidden = false;
    els.form.hidden = true;
    els.empty.querySelector("p").textContent = `Não foi possível carregar o pedido (${erro.message}).`;
  }
}

els.form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!els.form.checkValidity()) {
    els.form.reportValidity();
    return;
  }

  els.form.hidden = true;
  els.success.hidden = false;
  localStorage.removeItem(CART_KEY);
  els.count.textContent = "0";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener("DOMContentLoaded", carregarProdutos);
