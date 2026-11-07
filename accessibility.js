"use strict";

const fontDecrease = document.getElementById("font-decrease");
const fontIncrease = document.getElementById("font-increase");
const fontSizeValue = document.getElementById("font-size-value");
const contrastToggle = document.getElementById("contrast-toggle");
const accessibilityStatus = document.getElementById("accessibility-status");
const rootElement = document.documentElement;
const defaultFontSize = 62.5;
const preferenceKey = "cafeteria-imperial-accessibility";
let fontSize = defaultFontSize;

function getPreferences() {
    try {
        const savedPreferences = window.localStorage.getItem(preferenceKey);
        if (!savedPreferences) {
            return { fontSize: defaultFontSize, highContrast: false };
        }

        const preferences = JSON.parse(savedPreferences);
        return {
            fontSize: Number.isFinite(preferences.fontSize)
                ? Math.min(100, Math.max(50, preferences.fontSize))
                : defaultFontSize,
            highContrast: preferences.highContrast === true
        };
    } catch (error) {
        console.error("Não foi possível carregar as preferências de acessibilidade.", error);
        accessibilityStatus.textContent = "As preferências salvas não puderam ser carregadas.";
        return { fontSize: defaultFontSize, highContrast: false };
    }
}

function savePreferences() {
    try {
        window.localStorage.setItem(preferenceKey, JSON.stringify({
            fontSize,
            highContrast: document.body.classList.contains("high-contrast")
        }));
    } catch (error) {
        console.error("Não foi possível salvar as preferências de acessibilidade.", error);
        accessibilityStatus.textContent = "As preferências não puderam ser salvas neste navegador.";
    }
}

function updateFontSize(nextSize, shouldSave = true) {
    fontSize = Math.min(100, Math.max(50, nextSize));
    rootElement.style.fontSize = `${fontSize}%`;
    fontSizeValue.textContent = `${Math.round(fontSize / defaultFontSize * 100)}%`;
    if (shouldSave) {
        savePreferences();
        accessibilityStatus.textContent = `Tamanho do texto: ${fontSizeValue.textContent}.`;
    }
}

function applyPreferences(preferences) {
    updateFontSize(preferences.fontSize, false);
    document.body.classList.toggle("high-contrast", preferences.highContrast);
    contrastToggle.setAttribute("aria-pressed", String(preferences.highContrast));
    contrastToggle.textContent = preferences.highContrast
        ? "Desativar alto contraste"
        : "Ativar alto contraste";
}

fontDecrease.addEventListener("click", () => updateFontSize(fontSize - 6.25));
fontIncrease.addEventListener("click", () => updateFontSize(fontSize + 6.25));

contrastToggle.addEventListener("click", () => {
    const enabled = document.body.classList.toggle("high-contrast");
    contrastToggle.setAttribute("aria-pressed", String(enabled));
    contrastToggle.textContent = enabled ? "Desativar alto contraste" : "Ativar alto contraste";
    savePreferences();
    accessibilityStatus.textContent = enabled ? "Alto contraste ativado." : "Alto contraste desativado.";
});

document.getElementById("accessibility-reset").addEventListener("click", () => {
    updateFontSize(defaultFontSize);
    document.body.classList.remove("high-contrast");
    contrastToggle.setAttribute("aria-pressed", "false");
    contrastToggle.textContent = "Ativar alto contraste";
    savePreferences();
    accessibilityStatus.textContent = "Ajustes de acessibilidade restaurados.";
});

applyPreferences(getPreferences());

window.addEventListener("storage", event => {
    if (event.key !== preferenceKey) {
        return;
    }

    if (event.newValue === null) {
        applyPreferences({ fontSize: defaultFontSize, highContrast: false });
        return;
    }

    try {
        const preferences = JSON.parse(event.newValue);
        applyPreferences({
            fontSize: Number.isFinite(preferences.fontSize) ? preferences.fontSize : defaultFontSize,
            highContrast: preferences.highContrast === true
        });
        accessibilityStatus.textContent = "Preferências atualizadas em outra aba.";
    } catch (error) {
        console.error("Não foi possível sincronizar as preferências de acessibilidade.", error);
        accessibilityStatus.textContent = "As preferências de outra aba não puderam ser aplicadas.";
    }
});

document.addEventListener("keydown", event => {
    if (!event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) {
        return;
    }

    const targetIds = {
        "1": document.getElementById("main-content") || document.getElementById("privacy-content"),
        "2": document.getElementById("menu") || document.getElementById("main-navigation"),
        "3": document.getElementById("site-footer")
    };
    const target = targetIds[event.key];

    if (!target) {
        return;
    }

    event.preventDefault();
    target.focus();
    target.scrollIntoView({ behavior: "auto", block: "start" });
});
