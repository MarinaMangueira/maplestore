/**
 * app.js — Maple (loja de acessórios para RPG & Card Games)
 *
 * Este arquivo é o "coração" do front. Ele NUNCA guarda produtos no HTML:
 * tudo vem de data/products.json via fetch(). Isso é o conceito de
 * "headless commerce" pedido no desafio: o catálogo (o "corpo" de dados)
 * fica separado de quem desenha a vitrine (este JS). Se um dia trocarmos
 * o JSON estático por uma API de verdade, nada aqui muda — só a função
 * carregarProdutos() passaria a chamar outra URL.
 */

const state = {
  produtos: [],       // todos os produtos, carregados uma única vez
  categoriaAtiva: "todos",
  termoBusca: "",
  carrinho: 0,
};

const els = {
  grid: document.getElementById("catalog-grid"),
  tabs: document.getElementById("binder-tabs"),
  busca: document.getElementById("busca-input"),
  contagem: document.getElementById("toolbar-count"),
  cartCount: document.getElementById("cart-count"),
};

/* ---------- 1. Carregar o catálogo (headless commerce) ---------- */

async function carregarProdutos() {
  try {
    const resposta = await fetch("data/products.json");
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    state.produtos = await resposta.json();
    montarAbasDeCategoria();
    renderizarGrade();
  } catch (erro) {
    els.grid.innerHTML = `
      <div class="empty-state">
        Não foi possível carregar o catálogo agora (${erro.message}).<br>
        Confira se <code>data/products.json</code> está no ar junto com a página.
      </div>`;
    console.error("[Maple] Falha ao buscar products.json:", erro);
  }
}

/* ---------- 2. Abas de categoria (as "divisórias de fichário") ---------- */

function montarAbasDeCategoria() {
  const categorias = [
    { id: "todos", label: "Tudo" },
    ...[...new Map(
      state.produtos.map((p) => [p.categoria, p.categoriaLabel])
    )].map(([id, label]) => ({ id, label })),
  ];

  els.tabs.innerHTML = categorias
    .map((cat) => {
      const qtd =
        cat.id === "todos"
          ? state.produtos.length
          : state.produtos.filter((p) => p.categoria === cat.id).length;
      const ativa = cat.id === state.categoriaAtiva;
      return `
        <button
          class="binder__tab"
          role="tab"
          aria-selected="${ativa}"
          data-categoria="${cat.id}"
        >${cat.label} <span class="count">${qtd}</span></button>`;
    })
    .join("");

  els.tabs.querySelectorAll(".binder__tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.categoriaAtiva = btn.dataset.categoria;
      montarAbasDeCategoria();
      renderizarGrade();
    });
  });
}

/* ---------- 3. Busca + filtro combinados ---------- */

function produtosFiltrados() {
  const termo = state.termoBusca.trim().toLowerCase();
  return state.produtos.filter((p) => {
    const bateCategoria =
      state.categoriaAtiva === "todos" || p.categoria === state.categoriaAtiva;
    const bateBusca =
      termo === "" ||
      p.nome.toLowerCase().includes(termo) ||
      p.descricao.toLowerCase().includes(termo);
    return bateCategoria && bateBusca;
  });
}

els.busca.addEventListener("input", (e) => {
  state.termoBusca = e.target.value;
  renderizarGrade();
});

/* ---------- 4. Renderização da grade de produtos ---------- */

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function iconeSvg(nome) {
  // Ícones inline (mesmo arquivo SVG usado no hero), reaproveitados por categoria.
  return `<svg aria-hidden="true"><use href="assets/icons/sprite.svg#${nome}"></use></svg>`;
}

function cardProduto(p) {
  // O ícone fica sempre no DOM como base; a <img> real (foto do produto)
  // fica por cima. Se a foto ainda não existir (pasta images/ vazia) ou
  // falhar ao carregar, ela some sozinha e o ícone continua visível —
  // sem hacks de string, só um listener de "error" comum.
  return `
    <article class="card" data-id="${p.id}">
      <div class="card__media">
        ${iconeSvg(p.icone)}
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
  els.contagem.textContent = `${lista.length} ${
    lista.length === 1 ? "item" : "itens"
  }`;

  els.grid.innerHTML = lista.length
    ? lista.map(cardProduto).join("")
    : `<div class="empty-state">Nada por aqui com esse filtro — tenta outra busca ou categoria.</div>`;

  els.grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => adicionarAoCarrinho(btn));
  });

  // Some com a <img> se a foto não existir/carregar; o ícone por baixo
  // fica visível sozinho. Assim que você colocar as fotos reais em
  // images/<categoria>/, elas aparecem automaticamente — sem mexer em JS.
  els.grid.querySelectorAll(".card__photo").forEach((img) => {
    img.addEventListener("error", () => img.remove(), { once: true });
  });
}

/* ---------- 5. Carrinho fictício (bônus de criatividade, sem checkout real) ---------- */

function adicionarAoCarrinho(botao) {
  state.carrinho += 1;
  els.cartCount.textContent = state.carrinho;
  els.cartCount.classList.add("bump");
  setTimeout(() => els.cartCount.classList.remove("bump"), 260);

  const original = botao.textContent;
  botao.textContent = "adicionado ✓";
  botao.disabled = true;
  setTimeout(() => {
    botao.textContent = original;
    botao.disabled = false;
  }, 900);
}

/* ---------- boot ---------- */

document.addEventListener("DOMContentLoaded", carregarProdutos);
