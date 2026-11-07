"use strict";

const WHATSAPP_NUMBER = "5561981723197";
const CART_STORAGE_KEY = "cafeteria-imperial-cart";
const SUGAR_OPTIONS = ["Sem açúcar", "Pouco açúcar", "Adoçante"];
const PRODUCTS = [
    {
        id: "cafe-coado",
        name: "Café Coado",
        description: "",
        image: "cafe_coado.jpg",
        price: 15.99,
        category: "quente"
    },
    {
        id: "cappuccino",
        name: "Cappuccino",
        description: "",
        image: "imagem2.jpg",
        price: 15.99,
        originalPrice: 20.99,
        category: "quente"
    },
    {
        id: "cafe-expresso",
        name: "Café Expresso",
        description: "",
        image: "imagem3.jpg",
        price: 15.99,
        originalPrice: 20.99,
        category: "quente"
    },
    {
        id: "cafe-com-leite",
        name: "Café com Leite",
        description: "",
        image: "imagem4.jpg",
        price: 15.99,
        originalPrice: 20.99,
        category: "quente"
    },
    {
        id: "mocaccino",
        name: "Mocaccino",
        description: "",
        image: "imagem5.jpg",
        price: 15.99,
        originalPrice: 20.99,
        category: "quente"
    },
    {
        id: "cafe-gelado",
        name: "Café Gelado",
        description: "",
        image: "imagem6.jpg",
        price: 15.99,
        originalPrice: 20.99,
        category: "gelado"
    },
    {
        id: "Iced-Latte",
        name: "Iced Latte",
        description: "O clássico. Espresso + leite gelado + muito gelo. Leve e cremoso.",
        image: "file.jpg",
        price: 15.99,
        originalPrice: 20.99,
        category: "gelado"
    },

    {
        id: "Frappuccino",
        name: "Frappuccino",
        description: "Batido com gelo, tipo milkshake de café. Com chantilly por cima.",
        image: "Frappuccino.jpg",
        price: 15.99,
        originalPrice: 20.99,
        category: "gelado"
    },
    {
        id: "Cold Brew",
        name: "Cold Brew",
        description: "Café feito na água fria por 12h. Mais forte, menos ácido, super refrescante.",
        image: "coldBrew.jpg",
        price: 15.99,
        originalPrice: 20.99,
        category: "gelado"
    },
    {
        id: "Iced Mocha",
        name: "Iced Mocha",
        description: "Pra quem ama chocolate. Espresso + chocolate + leite gelado.",
        image: "Iced_Mocha.jpg",
        price: 15.99,
        originalPrice: 20.99,
        category: "gelado"
    },
    {
        id: "Iced Caramel Macchiato",
        name: "Iced Caramel Macchiato",
        description: "Leite gelado + espresso + calda de caramelo. Doce na medida certa.",
        image: "Iced_Caramel_Macchiato.jpg",
        price: 15.99,
        originalPrice: 20.99,
        category: "gelado"
    },

];
const productList = document.getElementById("product-list");
const categoryFilters = [...document.querySelectorAll(".menu-filter")];
const menuCards = [];
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const cartStatus = document.getElementById("cart-status");
const searchControl = document.querySelector(".search-control");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const noResults = document.getElementById("no-results");
const pickupCodeResult = document.getElementById("pickup-code-result");
const pickupCodeElement = document.getElementById("pickup-code");
const imagePreview = document.getElementById("image-preview");
const imagePreviewTitle = document.getElementById("image-preview-title");
const imagePreviewImage = document.getElementById("image-preview-image");
let selectedCategory = "all";
let pickupCode = null;
const restoredCart = loadCart();
const cart = restoredCart.items;

function normalizeText(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function loadCart() {
    let savedCart;
    try {
        savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    } catch (error) {
        console.error("Não foi possível carregar o carrinho salvo.", error);
        return { items: [], warning: "O carrinho salvo não pôde ser carregado neste navegador." };
    }

    if (!savedCart) {
        return { items: [], warning: "" };
    }

    try {
        const parsedCart = JSON.parse(savedCart);
        if (!Array.isArray(parsedCart)) {
            throw new TypeError("O formato do carrinho salvo é inválido.");
        }

        const validItems = parsedCart.filter(item =>
            item &&
            PRODUCTS.some(product => product.id === item.productId) &&
            SUGAR_OPTIONS.includes(item.sugar) &&
            Number.isSafeInteger(item.quantity) &&
            item.quantity > 0
        );
        if (validItems.length !== parsedCart.length) {
            console.error("Alguns itens inválidos do carrinho salvo foram ignorados.");
            return { items: validItems, warning: "Alguns itens salvos não puderam ser restaurados." };
        }

        return { items: validItems, warning: "" };
    } catch (error) {
        console.error("Não foi possível interpretar o carrinho salvo.", error);
        return { items: [], warning: "O carrinho salvo estava inválido e foi iniciado vazio." };
    }
}

function saveCart() {
    try {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        return true;
    } catch (error) {
        console.error("Não foi possível salvar o carrinho.", error);
        return false;
    }
}

function formatCurrency(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function getProduct(productId) {
    const product = PRODUCTS.find(item => item.id === productId);
    if (!product) {
        throw new Error(`Produto desconhecido no carrinho: ${productId}`);
    }
    return product;
}

function announce(message) {
    cartStatus.textContent = "";
    window.setTimeout(() => {
        cartStatus.textContent = message;
    }, 20);
}

function setSearchOpen(isOpen) {
    searchForm.hidden = !isOpen;
    document.getElementById("btn-search").setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
        searchInput.focus();
    } else {
        document.getElementById("btn-search").focus();
    }
}

function invalidatePickupCode() {
    pickupCode = null;
    pickupCodeResult.hidden = true;
    pickupCodeElement.textContent = "";
}

function createPickupCode() {
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    const code = String(randomValues[0] % 100000000).padStart(8, "0");
    return `IMP-${code}`;
}

function renderCart() {
    cartItems.replaceChildren();

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "cart-empty";
        emptyMessage.textContent = "Seu carrinho está vazio.";
        cartItems.append(emptyMessage);
    }

    let itemCount = 0;
    let total = 0;

    cart.forEach((item, index) => {
        const product = getProduct(item.productId);
        itemCount += item.quantity;
        total += product.price * item.quantity;

        const row = document.createElement("article");
        row.className = "cart-item";

        const details = document.createElement("div");
        const name = document.createElement("h3");
        name.textContent = product.name;
        const sugar = document.createElement("p");
        sugar.textContent = `Açúcar: ${item.sugar}`;
        const actions = document.createElement("div");
        actions.className = "cart-item-actions";

        const decrease = document.createElement("button");
        decrease.type = "button";
        decrease.dataset.action = "decrease";
        decrease.dataset.index = String(index);
        decrease.setAttribute("aria-label", `Diminuir quantidade de ${product.name}`);
        decrease.textContent = "−";

        const quantity = document.createElement("span");
        quantity.textContent = String(item.quantity);
        quantity.setAttribute("aria-label", "Quantidade");

        const increase = document.createElement("button");
        increase.type = "button";
        increase.dataset.action = "increase";
        increase.dataset.index = String(index);
        increase.setAttribute("aria-label", `Aumentar quantidade de ${product.name}`);
        increase.textContent = "+";

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-item";
        remove.dataset.action = "remove";
        remove.dataset.index = String(index);
        remove.textContent = "Remover";

        actions.append(decrease, quantity, increase, remove);
        details.append(name, sugar, actions);

        const price = document.createElement("span");
        price.className = "cart-item-price";
        price.textContent = formatCurrency(product.price * item.quantity);

        row.append(details, price);
        cartItems.append(row);
    });

    cartCount.textContent = String(itemCount);
    cartTotal.textContent = formatCurrency(total);
    document.getElementById("cart-checkout").disabled = cart.length === 0;
}

function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "box";
    card.dataset.productId = product.id;

    const imageContainer = document.createElement("button");
    imageContainer.type = "button";
    imageContainer.className = "menu-image";
    imageContainer.setAttribute("aria-label", `Ampliar imagem de ${product.name}`);
    const image = document.createElement("img");
    image.src = `./img/${product.image}`;
    image.alt = product.name;
    image.loading = "lazy";
    imageContainer.append(image);
    imageContainer.addEventListener("click", () => {
        imagePreviewTitle.textContent = `Imagem ampliada: ${product.name}`;
        imagePreviewImage.src = image.src;
        imagePreviewImage.alt = product.name;
        imagePreview.showModal();
    });

    const name = document.createElement("h3");
    name.textContent = product.name;

    if (product.description) {
        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;
        card.append(imageContainer, name, description);
    } else {
        card.append(imageContainer, name);
    }

    const price = document.createElement("div");
    price.className = "price";
    price.append(document.createTextNode(formatCurrency(product.price)));
    if (product.originalPrice !== undefined) {
        const originalPrice = document.createElement("span");
        originalPrice.textContent = formatCurrency(product.originalPrice);
        price.append(originalPrice);
    }

    const sugarLabel = document.createElement("label");
    sugarLabel.className = "sugar-choice";
    sugarLabel.append(document.createTextNode("Açúcar"));
    const sugarSelect = document.createElement("select");
    sugarSelect.className = "sugar-select";
    sugarSelect.setAttribute("aria-label", `Opção de açúcar para ${product.name}`);
    SUGAR_OPTIONS.forEach(optionText => {
        const option = document.createElement("option");
        option.textContent = optionText;
        sugarSelect.append(option);
    });
    sugarLabel.append(sugarSelect);

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "btn add-to-cart";
    addButton.textContent = "Adicionar ao carrinho";
    addButton.addEventListener("click", () => addToCart(card));

    card.append(price, sugarLabel, addButton);
    return card;
}

function renderMenu() {
    productList.replaceChildren();
    PRODUCTS.forEach(product => {
        const card = createProductCard(product);
        menuCards.push(card);
        productList.append(card);
    });
}

function addToCart(card) {
    const product = PRODUCTS.find(item => item.id === card.dataset.productId);
    if (!product) {
        console.error(`Produto desconhecido: ${card.dataset.productId}`);
        announce("Não foi possível adicionar este produto ao carrinho.");
        return;
    }

    const sugar = card.querySelector(".sugar-select").value;
    const existingItem = cart.find(item =>
        item.productId === product.id && item.sugar === sugar
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId: product.id, sugar, quantity: 1 });
    }

    invalidatePickupCode();
    renderCart();
    const saved = saveCart();
    announce(saved
        ? `${product.name} adicionado ao carrinho. Açúcar: ${sugar}.`
        : "Item adicionado, mas o carrinho não pôde ser salvo neste navegador.");
}

function setCartOpen(isOpen) {
    document.body.classList.toggle("cart-open", isOpen);
    cartDrawer.setAttribute("aria-hidden", String(!isOpen));
    cartDrawer.inert = !isOpen;
    cartOverlay.setAttribute("aria-hidden", String(!isOpen));
    document.getElementById("btn-cart").setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
        document.getElementById("cart-close").focus();
    } else {
        document.getElementById("btn-cart").focus();
    }
}

function filterMenu(query) {
    const normalizedQuery = normalizeText(query.trim());
    let visibleCount = 0;

    menuCards.forEach(card => {
        const product = PRODUCTS.find(item => item.id === card.dataset.productId);
        const matchesQuery = normalizeText(product.name).includes(normalizedQuery);
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        const matches = matchesQuery && matchesCategory;
        card.hidden = !matches;
        if (matches) {
            visibleCount += 1;
        }
    });

    noResults.hidden = visibleCount > 0;
}

categoryFilters.forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;
        categoryFilters.forEach(filter => {
            filter.setAttribute("aria-pressed", String(filter === button));
        });
        filterMenu(searchInput.value);
    });
});

renderMenu();

document.getElementById("btn-cart").addEventListener("click", () => setCartOpen(true));
document.getElementById("cart-close").addEventListener("click", () => setCartOpen(false));
cartOverlay.addEventListener("click", () => setCartOpen(false));
document.getElementById("btn-search").addEventListener("click", () => {
    setSearchOpen(searchForm.hidden);
});
document.getElementById("image-preview-close").addEventListener("click", () => imagePreview.close());
imagePreview.addEventListener("click", event => {
    if (event.target === imagePreview) {
        imagePreview.close();
    }
});

cartItems.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) {
        return;
    }

    const index = Number(button.dataset.index);
    const item = cart[index];
    if (!item) {
        return;
    }

    if (button.dataset.action === "increase") {
        item.quantity += 1;
    } else if (button.dataset.action === "decrease") {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart.splice(index, 1);
        }
    } else if (button.dataset.action === "remove") {
        cart.splice(index, 1);
    }

    invalidatePickupCode();
    renderCart();
    if (!saveCart()) {
        announce("O carrinho foi atualizado, mas não pôde ser salvo neste navegador.");
    }
});

searchInput.addEventListener("input", () => filterMenu(searchInput.value));
searchForm.addEventListener("submit", event => {
    event.preventDefault();
    filterMenu(searchInput.value);
    document.getElementById("menu").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.addEventListener("click", event => {
    if (!searchForm.hidden && !searchControl.contains(event.target)) {
        setSearchOpen(false);
    }
});

document.addEventListener("keydown", event => {
    if (document.body.classList.contains("cart-open")) {
        if (event.key === "Escape") {
            event.preventDefault();
            setCartOpen(false);
            return;
        }

        if (event.key === "Tab") {
            const focusableElements = [...cartDrawer.querySelectorAll(
                'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
            )].filter(element => !element.hidden);
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }

        return;
    }

    if (event.key === "Escape" && !searchForm.hidden) {
        setSearchOpen(false);
    }
});

document.getElementById("cart-checkout").addEventListener("click", () => {
    if (cart.length === 0) {
        announce("Adicione um produto antes de finalizar o pedido.");
        return;
    }

    const customerName = document.getElementById("customer-name");
    if (!customerName.checkValidity()) {
        customerName.reportValidity();
        return;
    }

    if (!pickupCode) {
        pickupCode = createPickupCode();
    }

    pickupCodeElement.textContent = pickupCode;
    pickupCodeResult.hidden = false;

    const note = document.getElementById("customer-note").value.trim();
    const lines = cart.map(item => {
        const product = getProduct(item.productId);
        return `${item.quantity}x ${product.name} - ${item.sugar} - ${formatCurrency(product.price * item.quantity)}`;
    });
    const total = cart.reduce((sum, item) => sum + getProduct(item.productId).price * item.quantity, 0);
    const message = [
        "Olá! Gostaria de fazer este pedido:",
        "",
        ...lines,
        "",
        `Código para retirada: ${pickupCode}`,
        `Total: ${formatCurrency(total)}`,
        `Nome: ${customerName.value.trim()}`,
        ...(note ? [`Observações: ${note}`] : [])
    ].join("\n");
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

renderCart();
if (restoredCart.warning) {
    announce(restoredCart.warning);
} else if (cart.length > 0) {
    announce("Carrinho restaurado.");
}
