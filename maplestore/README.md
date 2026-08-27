# Maple — Acessórios para RPG & Card Games

Projeto do desafio **"Minha Loja no Ar"** (Bootcamp AI/R, Trilha Commerce).

Loja estática (HTML + CSS + JS puros, sem framework — como o próprio
desafio sugere) com catálogo separado do front em `data/products.json`,
busca + filtro por categoria, e um carrinho fictício de bônus.

---

## 1. Estrutura do projeto

```
index.html            → página da loja (vitrine)
como-fiz/index.html   → página exigida com o vídeo + explicação técnica
css/style.css         → toda a identidade visual
js/app.js             → busca, filtro por categoria, render e carrinho
data/products.json    → catálogo — o "backend" de dados, separado do front
assets/icons/sprite.svg → ícones usados no site (logo, categorias, busca, carrinho)
images/               → onde entram as FOTOS REAIS dos produtos (veja seção 3)
```

**Por que não tem uma pasta `backend/` de verdade?** O próprio desafio
recomenda site estático (framework ou servidor não dá ponto extra — a
nota é da explicação). `data/products.json` cumpre o papel de backend de
dados: o front nunca tem produto escrito no HTML, sempre busca no JSON
via `fetch`. Isso já é o "headless commerce em miniatura" pedido no
desafio. Se um dia isso virar uma API de verdade, só o `fetch` de
`js/app.js` muda de endereço — nada mais no projeto precisa mudar.

---

## 2. Rodar localmente

Não dá pra abrir `index.html` direto clicando duas vezes (o `fetch` do
JSON é bloqueado por segurança do navegador em arquivos `file://`).
Suba um servidor simples:

```bash
# dentro da pasta do projeto
python3 -m http.server 8080
# depois abra http://localhost:8080 no navegador
```

Ou, com Node instalado: `npx serve .`



## 3. Publicar de graça

**GitHub Pages** (sugestão do próprio desafio):

1. Crie um repositório novo no GitHub e suba todo o conteúdo desta
   pasta pra ele (`git init`, `git add .`, `git commit`, `git push`).
2. No repositório: **Settings → Pages → Branch: main → pasta `/root`
   → Save**.
3. Em alguns minutos, o GitHub te dá a URL pública
   (`https://seu-usuario.github.io/nome-do-repo/`).

Alternativas igualmente válidas e gratuitas: **Netlify**, **Cloudflare
Pages** ou **Vercel** — nesses casos normalmente é só arrastar a pasta
do projeto no painel deles. O desafio pede pra você justificar no
vídeo qual você escolheu e por quê.

---

## 5. Preparando o vídeo (5 a 8 min, ao vivo no código)

A página `como-fiz/index.html` já está estruturada nas 5 perguntas
obrigatórias do desafio — mas o texto que está lá é um **rascunho pra
você estudar e reescrever com suas próprias palavras**, não pra ler
igual no vídeo. Os trechos marcados com `<!-- TODO -->` no HTML são os
que você precisa preencher com dados reais (ID do vídeo, scores do
Lighthouse que você realmente rodou, onde publicou e por quê).

Roteiro sugerido, seguindo a ordem que o desafio pede:

1. **O que construí / organização do código** — abra as pastas ao
   vivo e mostre `index.html`, `css/style.css`, `js/app.js` e
   `data/products.json`.
2. **Por que o catálogo é separado do front** — abra o
   `products.json`, mostre o `fetch` em `js/app.js` (função
   `carregarProdutos`), e explique headless commerce com suas
   palavras.
3. **Mapeamento pra AWS + cache** — use o diagrama da seção 3 da
   página `como-fiz` como apoio visual, mas explique com a boca o
   caminho navegador → CDN → origem.
4. **Lighthouse ao vivo** — F12 → aba Lighthouse → Analyze, no site
   **publicado** (não local). Comente os scores reais.
5. **Onde entraria IA + o que foi mais difícil** — seja honesto aqui,
   é o critério mais fácil de perder pontos por parecer decorado.

**Importante:** a call individual depois da entrega vai perguntar
"por que você fez assim?" e "o que acontece se eu mudar isso aqui?"
sobre esse código específico. Vale a pena ler `js/app.x` com calma
antes de gravar (é o arquivo `js/app.js`) — se algo no código não fizer
sentido pra você, é melhor simplificar agora do que travar na call.

---

## 6. Requisitos do desafio já cobertos por este projeto

- [x] Tema e identidade próprios (loja de RPG/card game, sem copiar os
      exemplos de aula)
- [x] Catálogo em `products.json`, mínimo 6 produtos (tem 8), carregado
      via `fetch`, nada hardcoded no HTML
- [x] Busca **e** filtro por categoria funcionando juntos
- [x] Site estático, HTML + CSS + JS puros
- [x] Página `/como-fiz` com espaço pro vídeo
- [ ] Hospedar publicamente (passo que só você consegue fazer — seção 4)
- [ ] Gravar o vídeo (seção 5)
- [ ] Bônus: vídeo auto-hospedado / diagrama de arquitetura com BFF
      (o diagrama do BFF já está esboçado em `como-fiz/index.html`,
      seção "Bônus")
