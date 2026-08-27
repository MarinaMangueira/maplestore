/**
 * Maple — catálogo + carrinho fictício.
 * Tecnologias: HTML + CSS + JavaScript.
 * O catálogo continua vindo de data/products.json via fetch().
 */

const CART_KEY = "maple-cart";

const state = {
  produtos: [],
  categoriaAtiva: "todos",
  termoBusca: "",
};

const els = {
  grid: document.getElementById("catalog-grid"),
  tabs: document.getElementById("binder-tabs"),
  busca: document.getElementById("busca-input"),
  contagem: document.getElementById("toolbar-count"),
  cartCount: document.getElementById("cart-count"),
};

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

function cartQuantity() {
  return getCart().reduce((total, item) => total + item.quantidade, 0);
}

function atualizarContadorCarrinho() {
  if (!els.cartCount) return;
  els.cartCount.textContent = cartQuantity();
}

async function carregarProdutos() {
  try {
    const resposta = await fetch("data/products.json");
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    state.produtos = await resposta.json();
    montarAbasDeCategoria();
    renderizarGrade();
    atualizarContadorCarrinho();
  } catch (erro) {
    els.grid.innerHTML = `
      <div class="empty-state">
        Não foi possível carregar o catálogo agora (${erro.message}).<br>
        Confira se <code>data/products.json</code> está no ar junto com a página.
      </div>`;
    console.error("[Maple] Falha ao buscar products.json:", erro);
  }
}

function montarAbasDeCategoria() {
  const categorias = [
    { id: "todos", label: "Tudo" },
    ...[...new Map(
      state.produtos.map((p) => [p.categoria, p.categoriaLabel])
    )].map(([id, label]) => ({ id, label })),
  ];

  els.tabs.innerHTML = categorias.map((cat) => {
    const qtd = cat.id === "todos"
      ? state.produtos.length
      : state.produtos.filter((p) => p.categoria === cat.id).length;
    const ativa = cat.id === state.categoriaAtiva;
    return `
      <button class="binder__tab" role="tab" aria-selected="${ativa}" data-categoria="${cat.id}">
        ${cat.label} <span class="count">${qtd}</span>
      </button>`;
  }).join("");

  els.tabs.querySelectorAll(".binder__tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.categoriaAtiva = btn.dataset.categoria;
      montarAbasDeCategoria();
      renderizarGrade();
    });
  });
}

function produtosFiltrados() {
  const termo = state.termoBusca.trim().toLowerCase();
  return state.produtos.filter((p) => {
    const bateCategoria = state.categoriaAtiva === "todos" || p.categoria === state.categoriaAtiva;
    const bateBusca = termo === "" ||
      p.nome.toLowerCase().includes(termo) ||
      p.descricao.toLowerCase().includes(termo);
    return bateCategoria && bateBusca;
  });
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function cardProduto(p) {
  return `
    <article class="card" data-id="${p.id}">
      <div class="card__media">
        <span class="product-icon product-icon--${p.icone}" aria-hidden="true"></span>
        <img class="card__photo" src="${p.imagem}" alt="${p.nome}" loading="lazy">
        <span class="card__rarity" data-r="${p.raridade}">${p.raridade}</span>
      </div>
      <div class="card__body">
        <span class="card__category">${p.categoriaLabel}</span>
        <h3 class="card__name">${p.nome}</h3>
        <p class="card__desc">${p.descricao}</p>
        <div class="card__footer">
          <span class="card__price">${formatarPreco(p.preco)}</span>
          <span class="card__stock">${p.estoque} em estoque</span>
        </div>
        <button class="card__add" data-add="${p.id}">+ carrinho</button>
      </div>
    </article>`;
}

function renderizarGrade() {
  const lista = produtosFiltrados();
  els.contagem.textContent = `${lista.length} ${lista.length === 1 ? "item" : "itens"}`;

  els.grid.innerHTML = lista.length
    ? lista.map(cardProduto).join("")
    : `<div class="empty-state">Nada por aqui com esse filtro — tenta outra busca ou categoria.</div>`;

  els.grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => adicionarAoCarrinho(btn.dataset.add, btn));
  });

  els.grid.querySelectorAll(".card__photo").forEach((img) => {
    img.addEventListener("error", () => img.remove(), { once: true });
  });
}

function adicionarAoCarrinho(id, botao) {
  const produto = state.produtos.find((p) => p.id === id);
  if (!produto) return;

  const cart = getCart();
  const existente = cart.find((item) => item.id === id);

  if (existente) {
    existente.quantidade = Math.min(existente.quantidade + 1, produto.estoque);
  } else {
    cart.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem,
      categoriaLabel: produto.categoriaLabel,
      estoque: produto.estoque,
      quantidade: 1,
    });
  }

  saveCart(cart);
  atualizarContadorCarrinho();

  if (els.cartCount) {
    els.cartCount.classList.add("bump");
    setTimeout(() => els.cartCount.classList.remove("bump"), 260);
  }

  const original = botao.textContent;
  botao.textContent = "adicionado ✓";
  botao.disabled = true;
  setTimeout(() => {
    botao.textContent = original;
    botao.disabled = false;
  }, 900);
}

if (els.busca) {
  els.busca.addEventListener("input", (e) => {
    state.termoBusca = e.target.value;
    renderizarGrade();
  });
}

document.addEventListener("DOMContentLoaded", carregarProdutos);