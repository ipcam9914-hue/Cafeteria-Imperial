# Guia completo dos arquivos do site

Este guia explica os principais blocos do projeto e como eles trabalham juntos. As linhas indicadas correspondem ao código atual e podem mudar quando os arquivos forem editados.

## Visão geral do projeto

- [`index.html`](./index.html): estrutura da página principal e do carrinho.
- [`style.css`](./style.css): aparência, layout, responsividade e estilos de acessibilidade.
- [`script.js`](./script.js): produtos, filtros, busca, carrinho, código de retirada e envio do pedido.
- [`accessibility.js`](./accessibility.js): tamanho do texto, alto contraste, salvamento das preferências e atalhos de teclado.
- [`privacidade.html`](./privacidade.html): página com o aviso de privacidade.
- [`img/`](./img/): imagens e vídeo utilizados pelo site.
- [`.vscode/settings.json`](./.vscode/settings.json): configurações locais do Visual Studio Code para o projeto.

## 1. Página principal — `index.html`

### Início do documento e recursos

- **Linhas 1–14 — `DOCTYPE`, `<html>` e `<head>`:** declaram HTML5 e português do Brasil, configuram caracteres e visualização em dispositivos móveis e carregam o ícone, o CSS e a fonte Roboto. `<title>` define o nome mostrado na aba do navegador.
- **Linha 16 — `<body>`:** começa o conteúdo visível da página.
- **Linha 17 — link para pular ao conteúdo:** acessibilidade por teclado; aparece quando recebe foco e leva ao conteúdo principal.

### Cabeçalho

- **Linhas 18–79 — `<header>`:** cabeçalho fixo com a logo, os links de navegação e os controles de acessibilidade, busca e carrinho.
- **Linhas 20–24 — logo:** imagem da cafeteria, clicável para voltar ao início.
- **Linhas 26–28 — navegação:** links internos que levam às seções identificadas por `home`, `about`, `menu`, `review` e `address`.
- **Linhas 30–57 — acessibilidade:** painel expansível com controle de tamanho do texto, alto contraste, restauração do padrão e uma mensagem de status para leitores de tela. Os botões são tratados por `accessibility.js`.
- **Linhas 58–69 — busca:** botão que abre o campo de pesquisa. O campo é conectado ao filtro de produtos em `script.js`.
- **Linhas 70–75 — carrinho:** botão que abre o painel e contém o contador de itens.

### Conteúdo e seções

- **Linhas 81–96 — `<main>` e Home:** identifica o conteúdo principal e apresenta a chamada da cafeteria, o texto introdutório e o botão que leva ao menu.
- **Linhas 98–115 — Sobre:** vídeo e texto de apresentação.
- **Linhas 117–128 — Menu:** botões de categoria “Todos”, “Cafés quentes” e “Gelados”; `#product-list` é preenchido por JavaScript; `#no-results` avisa quando nenhum produto corresponde à pesquisa e aos filtros.
- **Para adicionar uma categoria:** dentro de `.menu-filters`, copie um botão de filtro e altere o valor de `data-category` e o texto visível. Por exemplo:
  ```html
  <button type="button" class="btn menu-filter" data-category="acompanhamentos" aria-pressed="false">Acompanhamentos</button>
  ```
  Depois, nos produtos que devem aparecer nela, defina `category: "acompanhamentos"` dentro de `PRODUCTS` em `script.js`. O valor de `data-category` deve ser igual ao valor de `category`; não é necessário alterar a função do filtro.
- **Linhas 130–139 — Avaliações:** convite e link externo para enviar avaliação pelo Instagram.
- **Linhas 141–148 — Endereço:** mapa incorporado.

### Rodapé e painel do carrinho

- **Linhas 150–174 — `<footer>`:** links de privacidade, Instagram e WhatsApp, além dos créditos.
- **Linhas 176–180 — diálogo `#image-preview`:** apresenta a imagem do produto ampliada, com título acessível e botão para fechar.
- **Linha 183 — camada do carrinho:** fundo escurecido que aparece atrás do painel aberto.
- **Linhas 185–214 — painel do carrinho:** diálogo lateral com os produtos adicionados, o formulário do pedido e o botão de finalização.
- **Linhas 195–196 — nome:** o asterisco indica obrigatoriedade visual; `required` no campo `#customer-name` indica a obrigatoriedade para o navegador.
- **Linhas 197–199 — observações:** campo opcional para instruções do pedido.
- **Linhas 200–203 — código de retirada:** área escondida inicialmente; recebe e mostra o código criado pelo JavaScript quando o pedido é finalizado com nome válido.
- **Linhas 205–211 — total, envio e aviso:** total do carrinho, botão de envio pelo WhatsApp e aviso sobre o tratamento dos dados.
- **Linhas 217–218 — scripts:** carregam primeiro `accessibility.js` e depois `script.js`.

## 2. Aparência — `style.css`

### Base e acessibilidade — linhas 1–79

- **`:root`:** define variáveis reutilizáveis de cor e borda. A fonte-base começa em `62.5%`, para que `1rem` corresponda a aproximadamente 10 px no tamanho padrão.
- **Seletor `*`:** aplica margens, preenchimento, dimensionamento e fonte consistentes aos elementos.
- **Controles de formulário:** botões, campos, seletores e áreas de texto herdam a fonte do site.
- **`:focus-visible`:** cria contorno visível ao navegar com teclado.
- **`.skip-link` e `.visually-hidden`:** permitem, respectivamente, revelar o atalho para pular ao conteúdo e manter textos disponíveis para tecnologias assistivas sem exibi-los visualmente.
- **`html`, `body` e `section`:** controlam rolagem, cor de fundo, tamanho padrão do texto e largura/espaçamento geral das seções.

### Cabeçalho, controles e busca — aproximadamente linhas 80–496

- **`.header` e `.header-inner`:** fixam o cabeçalho no topo e alinham logo, navegação e ícones.
- **`.logo img`, `.navbar` e `.icons`:** dimensionam a logo, estilizam os links e organizam os botões do cabeçalho.
- **`.accessibility-*` e `.font-controls`:** definem o painel de acessibilidade, os controles de texto, o ícone e os estados aberto e hover.
- **`body.high-contrast`:** substitui cores e bordas para dar mais contraste; regras seguintes ajustam componentes específicos nessa modalidade.
- **`.footer`, `.social-links` e `.footer-credit`:** aparência do rodapé e dos links de contato.
- **`.search-control`, `.search-form` e `.icon-btn`:** posicionam o formulário de busca e formatam botões de busca e carrinho, inclusive contador e foco.

### Botões e conteúdo — aproximadamente linhas 497–740

- **`.btn`:** aparência comum dos botões principais e efeito ao passar o mouse.
- **`.home-container`:** imagem de fundo, altura da apresentação inicial e largura do texto.
- **`.title`:** padrão dos títulos de seção.
- **`.about .row` e `.about-video`:** organização responsiva do vídeo e do texto da seção Sobre.
- **`.menu .box-container`:** grade de produtos que se ajusta à largura disponível.
- **`.menu-filters` e `.menu-filter[aria-pressed="false"]`:** alinhamento dos botões de filtro e aparência de filtros não selecionados. O estado selecionado é indicado no HTML pelo atributo `aria-pressed`.
- **`.menu .box-container .box` e seletores relacionados:** cartão do produto, imagem, nome, preço e preço original riscado. A imagem pode ser clicada ou tocada para abrir ampliada no diálogo `#image-preview`.
- **`.image-preview` e `.image-preview-close`:** aparência do diálogo que mostra a imagem ampliada e do botão de fechar.
- **`.sugar-choice` e `.sugar-select`:** rótulo e seletor de açúcar em cada cartão.
- **`.add-to-cart`:** botão para incluir o produto no pedido.
- **`.review-invite`:** apresentação do convite para enviar uma avaliação.
- **`.address iframe`:** remove a borda do mapa.

### Carrinho — aproximadamente linhas 741–948

- **`#cart-overlay`:** camada escura que cobre a página; fica visível quando `body` recebe a classe `cart-open`.
- **`#cart-drawer`:** painel lateral do carrinho, inicialmente deslocado para fora da tela; a classe `cart-open` o traz para a tela e bloqueia a rolagem do fundo.
- **`.cart-header`, `#cart-close`:** título e botão de fechar.
- **`#cart-items`, `.cart-empty` e `.cart-item`:** área rolável dos itens, mensagem de carrinho vazio e apresentação de cada produto.
- **`.cart-item-actions`:** botões de aumentar, diminuir e remover quantidades.
- **`.cart-footer`:** campos do pedido, total e ação de finalizar.
- **`.pickup-code-result`:** caixa visual do código de retirada.
- **`.privacy-notice`:** aviso e link para a página de privacidade.
- **`:disabled`:** reduz a ênfase visual e muda o cursor de controles desativados.

### Página de privacidade e telas menores — aproximadamente linhas 949–1063

- **`.privacy-page`:** espaçamento e cores do texto do aviso de privacidade.
- **`@media (prefers-reduced-motion: reduce)`:** reduz animações e transições quando o sistema do visitante pede menos movimento.
- **`@media (max-width: 900px)`:** reorganiza cabeçalho e navegação em telas médias.
- **`@media (max-width: 560px)`:** reduz dimensões e espaços do cabeçalho para celulares.
- **`@media (forced-colors: active)`:** mantém foco perceptível nos modos de cores forçadas do sistema.

## 3. Funcionalidades — `script.js`

### Configuração e dados — aproximadamente linhas 1–33

- **`"use strict"`:** ativa regras mais estritas do JavaScript.
- **`WHATSAPP_NUMBER`:** número usado para criar o link de envio do pedido.
- **`CART_STORAGE_KEY`:** nome da chave usada para guardar o carrinho neste navegador.
- **`SUGAR_OPTIONS`:** opções que aparecem no seletor de açúcar.
- **`PRODUCTS`:** catálogo de produtos. Cada objeto contém identificador, nome, imagem, preço, preço original e categoria (`quente` ou `gelado`). Para incluir/alterar produtos, este é o primeiro local a consultar.
- **Constantes DOM:** guardam referências aos elementos HTML usados pelo script, como o menu, filtros, carrinho, busca e código de retirada.
- **`selectedCategory`, `pickupCode`, `cart`:** guardam a categoria ativa, o código da finalização atual e os itens do carrinho.

### Formatação, persistência e acessibilidade — aproximadamente linhas 34–130

- **`normalizeText(value)`:** remove diferenças de acentos e caixa para a busca; por isso, uma busca sem acento também pode encontrar um produto acentuado.
- **`loadCart()`:** lê o carrinho do `localStorage`, interpreta os dados e valida produto, opção de açúcar e quantidade. Se houver erro, registra no console e prepara uma mensagem para o visitante.
- **`saveCart()`:** grava o carrinho no navegador e informa sucesso ou falha ao chamador.
- **`formatCurrency(value)`:** formata valores como moeda brasileira (R$).
- **`getProduct(productId)`:** encontra os dados de um produto; informa erro se o identificador não existir.
- **`announce(message)`:** coloca avisos na região de status acessível do carrinho.
- **`setSearchOpen(isOpen)`:** abre ou fecha o formulário de busca, atualiza `aria-expanded` e move o foco para o campo ou botão.
- **`invalidatePickupCode()`:** apaga e esconde um código anterior quando o carrinho muda.
- **`createPickupCode()`:** gera um código no formato `IMP-` mais oito dígitos aleatórios.

### Renderização e manipulação de produtos — aproximadamente linhas 132–283

- **`renderCart()`:** recria a lista do carrinho, incluindo nome, açúcar, preço e botões de quantidade; atualiza contador, total e disponibilidade do botão de finalizar.
- **`createProductCard(product)`:** constrói o cartão de um produto, imagem, preços, seletor de açúcar e botão “Adicionar ao carrinho”. A imagem é um botão acessível que abre o diálogo `#image-preview` com a imagem ampliada e o nome do produto.
- **`renderMenu()`:** percorre `PRODUCTS`, cria os cartões e os insere em `#product-list`.
- **`addToCart(card)`:** lê produto e açúcar escolhidos, aumenta a quantidade de um item igual ou cria um item novo, invalida código antigo, atualiza a tela e tenta salvar.
- **`setCartOpen(isOpen)`:** abre/fecha carrinho, atualiza atributos de acessibilidade, controla o foco e ativa ou remove a classe visual `cart-open`.
- **`filterMenu(query)`:** mostra apenas cartões que correspondem ao texto pesquisado e à categoria selecionada; controla a mensagem de nenhum resultado.
- **Filtros de categoria:** cada botão com a classe `.menu-filter` atualiza a categoria ativa e `aria-pressed`, depois aplica novamente o filtro. Para uma categoria nova, basta adicionar o botão correspondente em `index.html` e usar o mesmo valor em `category` nos produtos; o filtro já trata essa categoria.
- **`renderMenu()` (chamada de inicialização):** cria os cartões antes de os eventos de interação serem usados.

### Eventos, teclado e finalização — aproximadamente linhas 328–456

- **Eventos de abrir/fechar:** ligam os botões do cabeçalho, o botão de fechar e a camada externa ao painel do carrinho.
- **Pré-visualização da imagem:** clicar ou tocar na imagem do cartão abre a versão ampliada; o botão de fechar, o clique fora ou a tecla `Escape` fecham o diálogo.
- **Ações nos itens:** um único ouvinte em `#cart-items` identifica os botões de aumentar, diminuir e remover; após a ação, atualiza a tela e salva.
- **Eventos de busca:** atualizam os resultados enquanto o visitante digita, permitem submeter a pesquisa e levam a tela até o menu.
- **Clique fora da busca:** fecha o campo de busca quando o clique ocorre fora do controle.
- **Tecla Escape e foco do carrinho:** Escape fecha o painel; Tab e Shift+Tab mantêm o foco dentro do diálogo enquanto ele estiver aberto.
- **Finalização (`#cart-checkout`):** verifica se há itens e se o nome obrigatório é válido; cria e exibe o código; monta a mensagem com itens, quantidades, açúcar, total, nome e observações; abre o WhatsApp com o texto preenchido. O visitante ainda precisa confirmar o envio no WhatsApp.
- **Inicialização final:** desenha o carrinho salvo e anuncia se ele foi restaurado ou se houve problema ao recuperá-lo.

## 4. Preferências de acessibilidade — `accessibility.js`

### Como o recurso foi acrescentado ao site

A acessibilidade foi implementada em conjunto no HTML, no CSS e no JavaScript:

- **HTML (`index.html` e `privacidade.html`):** foi incluído no cabeçalho um painel de controles com botões para diminuir/aumentar o texto, ativar o alto contraste e restaurar os padrões. Os `id`s desses elementos são usados pelo JavaScript; mantenha-os iguais nas duas páginas para que o mesmo script funcione em ambas. O HTML também informa os atalhos de teclado e contém uma região `aria-live` para anunciar mudanças a leitores de tela.
- **CSS (`style.css`):** foram adicionados os estilos do painel e da classe `high-contrast`, que altera cores e bordas dos componentes para aumentar o contraste. O JavaScript ativa ou remove essa classe no `<body>`.
- **JavaScript (`accessibility.js`):** o script conecta os controles às suas ações, aplica as preferências salvas e anuncia o resultado. Ele é carregado depois do HTML dos controles, no final de cada página.
- **Persistência e sincronização:** as opções ficam no `localStorage` do navegador. Ao abrir outra página do site, o script recupera as preferências; alterações feitas em outra aba também podem ser sincronizadas pelo evento `storage`.
- **Teclado:** além de permitir operar os botões com teclado, os atalhos `Alt+1`, `Alt+2` e `Alt+3` levam ao conteúdo, ao menu/navegação e ao rodapé.

- **Linhas 1–11 — referências e valores padrão:** obtém os botões de acessibilidade e define o tamanho inicial da fonte e a chave de armazenamento.
- **`getPreferences()`:** carrega preferências do `localStorage`, limita o tamanho da fonte ao intervalo permitido e usa padrões se os dados estiverem ausentes ou inválidos.
- **`savePreferences()`:** salva tamanho do texto e estado de alto contraste no navegador.
- **`updateFontSize(nextSize, shouldSave)`:** aplica o tamanho, atualiza o indicador percentual e, quando solicitado, salva e anuncia a mudança. O ajuste é limitado para evitar valores muito pequenos ou grandes.
- **`applyPreferences(preferences)`:** aplica tamanho e contraste ao documento e sincroniza o estado do botão com `aria-pressed`.
- **Botões de fonte:** diminuem ou aumentam o tamanho em passos de 6,25 pontos.
- **Botão de alto contraste:** alterna a classe `high-contrast` no `<body>`, atualiza o rótulo e salva a escolha.
- **Restaurar padrão:** retorna fonte e contraste aos valores iniciais.
- **Evento `storage`:** sincroniza preferências se elas mudarem em outra aba do site.
- **Atalhos Alt+1, Alt+2 e Alt+3:** levam o foco ao conteúdo, navegação/menu ou rodapé, conforme a página atual.
- **Mensagens de status:** comunicam mudanças e falhas por uma região `aria-live` do HTML.

## 5. Aviso — `privacidade.html`

- **Linhas 1–16 — configuração da página:** idioma, descrição para mecanismos de busca, CSS, fontes, ícone e título da aba.
- **Linhas 18–55 — cabeçalho:** link para voltar ao site e o mesmo painel de acessibilidade da página principal.
- **Linhas 57–144 — conteúdo do aviso:** descreve o responsável informado, dados usados, funcionamento do pedido pelo WhatsApp, armazenamento, serviços externos, cookies/publicidade, direitos e uso de depoimentos e fotos.
- **Links `mailto:`:** abrem um aplicativo de e-mail para contato sobre privacidade.
- **Links “Voltar ao site”:** retornam ao `index.html`.
- **Linhas 146–148 — rodapé e script:** mostra os créditos e carrega `accessibility.js`, permitindo usar as mesmas preferências nesta página.
- **Estilos:** a classe `.privacy-page` e os elementos relacionados estão no final de `style.css`.

## 6. Imagens e vídeo — pasta `img/`

- **`Fundo.jpg`:** imagem de fundo da seção inicial; referenciada pelo CSS.
- **`imagem1.jpg` a `imagem6.jpg`:** imagens dos produtos; associadas aos produtos pela propriedade `image` em `PRODUCTS`, no `script.js`.
- **`logoentrada.jpg`:** logo mostrada no cabeçalho.
- **`logo1.jpg`:** ícone da aba do navegador.
- **`sobre.mp4`:** vídeo da seção Sobre.
- **Outros arquivos de imagem:** `fotopessoa*.jpg` e `logocomentario.jpg` também estão na pasta; confirme se alguma página ou estilo os utiliza antes de removê-los.

## 7. Configuração do editor — `.vscode/settings.json`

Esse arquivo configura a extensão Live Server para usar a porta `5501` ao abrir o site localmente no Visual Studio Code. Ele não define o conteúdo da página nem substitui as regras de HTML, CSS ou JavaScript.

## Onde alterar itens comuns

- **Texto, títulos e links:** procure no arquivo HTML correspondente (`index.html` ou `privacidade.html`).
- **Cor principal:** altere `--main-color` no início de `style.css`; vários componentes usam essa variável.
- **Layout ou aparência de um componente:** procure pelo seletor CSS ligado à classe ou ao `id` do elemento.
- **Produto, imagem, preço ou categoria:** atualize a lista `PRODUCTS`, no começo de `script.js`; veja as instruções detalhadas abaixo. A imagem precisa existir em `img/`.
- **Categorias dos botões:** os valores `data-category` em `index.html` precisam corresponder às categorias dos produtos em `PRODUCTS`.
- **Opções de açúcar:** atualize `SUGAR_OPTIONS` no `script.js`.
- **Número de WhatsApp:** atualize `WHATSAPP_NUMBER` no `script.js`.
- **Campo obrigatório:** o atributo `required` fica no input do nome, em `index.html`; a finalização também verifica o campo em `script.js`.
- **Código de retirada:** geração em `createPickupCode()`, exibição no bloco `#pickup-code-result` do HTML e aparência no seletor `.pickup-code-result` do CSS.

### Alterar preços, adicionar ou remover produtos

Os produtos são cadastrados no array `PRODUCTS`, no início de `script.js`. Cada linha é um objeto com os dados de um produto:

```js
{ id: "cafe-coado", name: "Café Coado", image: "imagem1.jpg", price: 15.99, originalPrice: 20.99, category: "quente" }
```

- **Alterar o preço:** encontre o produto pelo `id` ou `name` e mude `price` para o novo valor, usando número e ponto para os centavos (por exemplo, `18.50`, sem `R$`). `price` é obrigatório. `originalPrice` é opcional: quando informado, aparece como preço de referência riscado; se não quiser mostrar o preço riscado, remova somente essa propriedade e mantenha `price`.
- **Adicionar um produto:** inclua um novo objeto dentro de `PRODUCTS`, separado dos demais por vírgula. Preencha `id` exclusivo, `name`, `image` (nome de um arquivo existente em `img/`), `price` e `category`. `originalPrice` é opcional: informe-o apenas se quiser mostrar também um preço de referência riscado. Use `quente` ou `gelado` em `category`, conforme os filtros existentes.
- **Remover um produto:** apague a linha inteira do objeto correspondente em `PRODUCTS` e ajuste as vírgulas entre os objetos restantes. A imagem do produto não precisa ser apagada de `img/`; confirme antes que nenhuma outra parte do site a utiliza.
- **Depois de editar:** salve `script.js`, atualize/recarregue o site e confira o produto no menu, nos filtros, no carrinho e no total do pedido. Ao remover um produto, ele também deixa de ser reconhecido em carrinhos que ainda estejam salvos no navegador.

### Observação sobre opções de açúcar por categoria

Para uma categoria em que açúcar não se aplica, pode-se mostrar “Açúcar: não se aplica” em vez do seletor. Essa mudança não deve ser feita apenas escondendo o seletor: `createProductCard`, `addToCart`, `renderCart`, a validação do carrinho salvo e a montagem da mensagem do WhatsApp em `script.js` também precisam tratar os produtos dessa categoria sem uma opção de açúcar.
