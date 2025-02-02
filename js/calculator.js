// Conversion constants
const SCRAP_TO_RECLAIMED = 3;
const RECLAIMED_TO_REFINED = 3;
const REFINED_TO_KEY = 76.11;
const KEY_TO_DOLLAR = 1.6;
const KEY_TO_EARBUDS = 7.05;

// Real currency conversion rates (initially set to static values, will be updated with live rates)
let REAL_CURRENCY_RATES = {
    usd: 1,
    eur: 0.85,
    gbp: 0.75,
    jpy: 110,
    aud: 1.35,
    cad: 1.25
};

async function fetchLiveConversionRates() {
    const apiUrl = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json";
    const statusLight = document.getElementById("api-status-light");
    const statusText = document.getElementById("api-status-text");
    const currencySelect = document.getElementById("calc_currency_select");
    const rememberCurrencyToggle = document.getElementById("itemList_currency");

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        REAL_CURRENCY_RATES = data.usd;
        console.log("Live conversion rates updated:", REAL_CURRENCY_RATES);

        currencySelect.innerHTML = "";
        for (const [currency, rate] of Object.entries(REAL_CURRENCY_RATES)) {
            const option = document.createElement("option");
            option.value = currency;
            option.textContent = currency.toUpperCase();
            option.textContent = currency.toUpperCase();
            currencySelect.appendChild(option);
        }

        const savedCurrency = localStorage.getItem("selectedCurrency");
        if (savedCurrency && rememberCurrencyToggle.checked) {
            currencySelect.value = savedCurrency;
        } else {
            currencySelect.value = "usd";
        }

        statusLight.className = "status-light green";
        statusText.textContent = "API Currency Status: Online";
    } catch (error) {
        console.error("Error fetching live conversion rates:", error);
        statusLight.className = "status-light red";
        statusText.textContent = "API Currency Status: Offline";
    }
}

function saveSelectedCurrency() {
    const currencySelect = document.getElementById("calc_currency_select");
    const rememberCurrencyToggle = document.getElementById("itemList_currency");
    if (rememberCurrencyToggle.checked) {
        localStorage.setItem("selectedCurrency", currencySelect.value);
    } else {
        localStorage.removeItem("selectedCurrency");
    }
}

document.addEventListener("componentsLoaded", function() {
    fetchLiveConversionRates();
    const currencySelect = document.getElementById("calc_currency_select");
    currencySelect.addEventListener("change", saveSelectedCurrency);
    const rememberCurrencyToggle = document.getElementById("itemList_currency");
    rememberCurrencyToggle.addEventListener("change", saveSelectedCurrency);
});

function calculateValues(scrap, reclaimed, refined, key, earbuds, currency, selectedCurrency) {
    return {
        scrap: reclaimed * SCRAP_TO_RECLAIMED,
        reclaimed: refined * RECLAIMED_TO_REFINED,
        refined: key * REFINED_TO_KEY,
        key: earbuds * KEY_TO_EARBUDS,
        currency: key * KEY_TO_DOLLAR * REAL_CURRENCY_RATES[selectedCurrency]
    };
}

function updateCurrencies(event) {
    let scrap = parseFloat(document.getElementById("calc_scrap").value) || 0;
    let reclaimed = parseFloat(document.getElementById("calc_reclaimed").value) || 0;
    let refined = parseFloat(document.getElementById("calc_refined").value) || 0;
    let key = parseFloat(document.getElementById("calc_key").value) || 0;
    let earbuds = parseFloat(document.getElementById("calc_earbuds").value) || 0;
    let currency = parseFloat(document.getElementById("calc_currency_value").value) || 0;
    let selectedCurrency = document.getElementById("calc_currency_select").value;

    const values = calculateValues(scrap, reclaimed, refined, key, earbuds, currency, selectedCurrency);

    if (event.target.id === "calc_scrap") {
        reclaimed = scrap / SCRAP_TO_RECLAIMED;
        refined = reclaimed / RECLAIMED_TO_REFINED;
        key = refined / REFINED_TO_KEY;
        currency = key * KEY_TO_DOLLAR * REAL_CURRENCY_RATES[selectedCurrency];
        earbuds = key / KEY_TO_EARBUDS;
    }

    if (event.target.id === "calc_reclaimed") {
        scrap = reclaimed * SCRAP_TO_RECLAIMED;
        refined = reclaimed / RECLAIMED_TO_REFINED;
        key = refined / REFINED_TO_KEY;
        currency = key * KEY_TO_DOLLAR * REAL_CURRENCY_RATES[selectedCurrency];
        earbuds = key / KEY_TO_EARBUDS;
    }

    if (event.target.id === "calc_refined") {
        scrap = refined * RECLAIMED_TO_REFINED * SCRAP_TO_RECLAIMED;
        reclaimed = refined * RECLAIMED_TO_REFINED;
        key = refined / REFINED_TO_KEY;
        currency = key * KEY_TO_DOLLAR * REAL_CURRENCY_RATES[selectedCurrency];
        earbuds = key / KEY_TO_EARBUDS;
    }

    if (event.target.id === "calc_key") {
        refined = key * REFINED_TO_KEY;
        reclaimed = refined * RECLAIMED_TO_REFINED;
        scrap = reclaimed * SCRAP_TO_RECLAIMED;
        currency = key * KEY_TO_DOLLAR * REAL_CURRENCY_RATES[selectedCurrency];
        earbuds = key / KEY_TO_EARBUDS;
    }

    if (event.target.id === "calc_earbuds") {
        key = earbuds * KEY_TO_EARBUDS;
        refined = key * REFINED_TO_KEY;
        reclaimed = refined * RECLAIMED_TO_REFINED;
        scrap = reclaimed * SCRAP_TO_RECLAIMED;
        currency = key * KEY_TO_DOLLAR * REAL_CURRENCY_RATES[selectedCurrency];
    }

    if (event.target.id === "calc_currency_value") {
        key = currency / (KEY_TO_DOLLAR * REAL_CURRENCY_RATES[selectedCurrency]);
        refined = key * REFINED_TO_KEY;
        reclaimed = refined * RECLAIMED_TO_REFINED;
        scrap = reclaimed * SCRAP_TO_RECLAIMED;
        earbuds = key / KEY_TO_EARBUDS;
    }

    if (event.target.id === "calc_currency_select") {
        currency = key * KEY_TO_DOLLAR * REAL_CURRENCY_RATES[selectedCurrency];
    }

    updateDOMValues(scrap, reclaimed, refined, key, earbuds, currency, event.target.id);
}

function updateDOMValues(scrap, reclaimed, refined, key, earbuds, currency, targetId) {
    if (targetId !== "calc_scrap") {
        document.getElementById("calc_scrap").value = scrap.toFixed(2);
    }
    if (targetId !== "calc_reclaimed") {
        document.getElementById("calc_reclaimed").value = reclaimed.toFixed(2);
    }
    if (targetId !== "calc_refined") {
        document.getElementById("calc_refined").value = refined.toFixed(2);
    }
    if (targetId !== "calc_key") {
        document.getElementById("calc_key").value = key.toFixed(2);
    }
    if (targetId !== "calc_earbuds") {
        document.getElementById("calc_earbuds").value = earbuds.toFixed(2);
    }
    if (targetId !== "calc_currency_value") {
        document.getElementById("calc_currency_value").value = currency.toFixed(3);
    }
}

const inputIds = ["calc_scrap", "calc_reclaimed", "calc_refined", "calc_key", "calc_earbuds", "calc_currency_value"];
inputIds.forEach(id => {
    document.getElementById(id).addEventListener("input", updateCurrencies);
});

document.getElementById("calc_currency_select").addEventListener("change", updateCurrencies);

document.addEventListener("componentsLoaded", function() {
    const addItemButton = document.getElementById("addItemButton");
    const removeAllItems = document.getElementById("removeAllItems");
    const itemListContainer = document.querySelector(".itemList_list");
    const totalCurrencySelect = document.getElementById("total_Currency");
    const itemListSettingsToggle = document.getElementById("itemList_SettingsToggle");

    const conversionRates = {
        keys: 1,
        scrap: 1 / (59 * 3 * 3),
        reclaimed: 1 / (59 * 3),
        refined: 1 / 59,
        earbuds: 8,
    };

    function saveItems() {
        if (itemListSettingsToggle.checked) {
            const items = [];
            itemListContainer.querySelectorAll(".itemList_item").forEach(item => {
                items.push({
                    name: item.getAttribute("data-name"),
                    amount: item.getAttribute("data-amount"),
                    price: item.getAttribute("data-price"),
                    currency: item.getAttribute("data-currency")
                });
            });
            localStorage.setItem("shoppingListItems", JSON.stringify(items));
        } else {
            localStorage.removeItem("shoppingListItems");
        }
    }

    function loadItems() {
        const items = JSON.parse(localStorage.getItem("shoppingListItems")) || [];
        items.forEach(item => {
            addItemToDOM(item.name, item.amount, item.price, item.currency);
        });
        updateTotal();
    }

    function addItemToDOM(name, amount, price, currency) {
        const newItem = document.createElement("div");
        if (!name) {
            name = "Unnamed Item";
        }
        newItem.className = "itemList_item";
        newItem.setAttribute("data-name", name);
        newItem.setAttribute("data-amount", amount);
        newItem.setAttribute("data-price", price);
        newItem.setAttribute("data-currency", currency);
        newItem.innerHTML = `
            <div class="handle" style="cursor: move;"><i class="fa-solid fa-bars"></i></div>
            <input type="text" value="${name}" placeholder="name" autocomplete="off" class="item_list_ItemName">
            <input type="text" value="${amount}" placeholder="amount" autocomplete="off" class="item_list_itemAmount">
            <input type="text" value="${price}" placeholder="price" autocomplete="off" class="item_list_itemPrice">
            <select class="item_list_currency">
                <option ${currency === "keys" ? "selected" : ""}>keys</option>
                <option ${currency === "scrap" ? "selected" : ""}>scrap</option>
                <option ${currency === "reclaimed" ? "selected" : ""}>reclaimed</option>
                <option ${currency === "refined" ? "selected" : ""}>refined</option>
                <option ${currency === "earbuds" ? "selected" : ""}>earbuds</option>
            </select>
            <button class="item_list_removeButton"><i class="icon">&#xe922</i></button>
        `;

        newItem.querySelector(".item_list_ItemName").addEventListener("input", function() {
            newItem.setAttribute("data-name", this.value || "Unnamed Item");
            saveItems();
        });

        newItem.querySelector(".item_list_itemAmount").addEventListener("input", function() {
            newItem.setAttribute("data-amount", this.value || 0);
            updateTotal();
            saveItems();
        });

        newItem.querySelector(".item_list_itemPrice").addEventListener("input", function() {
            newItem.setAttribute("data-price", this.value || 0);
            updateTotal();
            saveItems();
        });

        newItem.querySelector(".item_list_currency").addEventListener("change", function() {
            newItem.setAttribute("data-currency", this.value);
            updateTotal();
            saveItems();
        });

        newItem.querySelector(".item_list_removeButton").addEventListener("click", function() {
            newItem.remove();
            updateTotal();
            saveItems();
        });

        itemListContainer.insertBefore(newItem, itemListContainer.firstChild);
    }

    addItemButton.addEventListener("click", function() {
        let itemName = document.getElementById("list_itemName").value;
        let itemAmount = parseFloat(document.getElementById("list_itemAmount").value);
        let itemPrice = parseFloat(document.getElementById("list_itemPrice").value);
        const itemCurrency = document.getElementById("list_itemCurrency").value;

        if (isNaN(itemAmount)) {
            itemAmount = 0;
        }
        if (isNaN(itemPrice)) {
            itemPrice = 0;
        }

        if (itemAmount && itemPrice) {
            addItemToDOM(itemName, itemAmount, itemPrice, itemCurrency);
            updateTotal();
            saveItems();
        }
    });

    removeAllItems.addEventListener("click", function() {
        itemListContainer.innerHTML = "";
        updateTotal();
        saveItems();
    });

    itemListSettingsToggle.addEventListener("change", function() {
        if (itemListSettingsToggle.checked) {
            saveItems();
        } else {
            localStorage.removeItem("shoppingListItems");
        }
    });

    new Sortable(document.getElementById("itemList_list"), {
        handle: ".handle",
        animation: 150,
    });

    function convertToTotalCurrency(price, currency, totalCurrency) {
        const priceInKeys = price * conversionRates[currency];
        return priceInKeys / conversionRates[totalCurrency];
    }

    function updateTotal() {
        let total = 0;
        const totalCurrency = totalCurrencySelect.value;
        const items = itemListContainer.querySelectorAll(".itemList_item");
        items.forEach(item => {
            const amount = parseFloat(item.getAttribute("data-amount")) || 0;
            const price = parseFloat(item.getAttribute("data-price")) || 0;
            const currency = item.getAttribute("data-currency");
            total += convertToTotalCurrency(price * amount, currency, totalCurrency);
        });

        document.querySelector(".itemList_group p").textContent = `Total price: ${total.toFixed(2)} ${totalCurrency}`;
    }

    totalCurrencySelect.addEventListener("change", updateTotal);

    loadItems();
});