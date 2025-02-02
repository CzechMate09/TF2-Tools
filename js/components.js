async function loadComponent(id, url) {
    const response = await fetch(url);
    const text = await response.text();
    document.getElementById(id).innerHTML = text;
}

async function initializePage() {
    await loadComponent("footer", "footer.html");
    await loadComponent("optionsOverlay", "options.html");

    initializeFooterFeatures();

    document.dispatchEvent(new Event("componentsLoaded"));
}

let clickSound = document.getElementById("clickSound");
let releaseSound = document.getElementById("releaseSound");
let fileLabel = document.getElementById("file-label");

function initializeFooterFeatures() {
    // --- audio ---
    addAudioElements();
    clickSound = document.getElementById("clickSound");
    releaseSound = document.getElementById("releaseSound");
    fileLabel = document.getElementById("file-label");
    const soundToggle = document.getElementById("soundToggle");
    const volumeSlider = document.getElementById("volumeSlider");

    const buttons = document.querySelectorAll("button");
    const inputs = document.querySelectorAll("input");

    // --- help overlay ---
    const helpOverlay = document.getElementById("helpOverlay")
    const helpButton = document.getElementById("helpButton")
    const okReturnHelp = document.getElementById("okReturnHelp")
    
    if (helpOverlay && helpButton && okReturnHelp) {
        helpButton.onclick = () => {
            helpOverlay.style.display = "flex";
        };
    
        okReturnHelp.onclick = () => {
            helpOverlay.style.display = "none";
        };
    }
    
    // --- options ---
    const optionsButton = document.getElementById("optionsButton")
    const optionsOverlay = document.getElementById("optionsOverlay")
    const optionsButtonReturn = document.getElementById("optionsButtonReturn")

    soundToggle.addEventListener("change", updateSoundSettings);
    volumeSlider.addEventListener("input", updateVolume);

    optionsButton.onclick = () => {
        optionsOverlay.style.display = "flex";
    };

    optionsButtonReturn.onclick = () => {
        optionsOverlay.style.display = "none";
    };

    const enableSounds = localStorage.getItem("enableSounds") === "true";
    const savedVolume = localStorage.getItem("volumeLevel");

    soundToggle.checked = enableSounds;
    updateSoundSettings();

    volumeSlider.value = savedVolume !== null ? savedVolume : 1.0;
    updateVolume();

    //--- item list ---
    const rememberItems = localStorage.getItem("rememberItems") === "true";
    const itemListSettingsToggle = document.getElementById("itemList_SettingsToggle");
    if (itemListSettingsToggle) {
        itemListSettingsToggle.checked = rememberItems;
        itemListSettingsToggle.addEventListener("change", function() {
            localStorage.setItem("rememberItems", itemListSettingsToggle.checked);
        });
    }

    //--- Currency ---
    const rememberCurrency = localStorage.getItem("rememberCurrency") === "true";
    const rememberCurrencyToggle = document.getElementById("itemList_currency");
    if (rememberCurrencyToggle) {
        rememberCurrencyToggle.checked = rememberCurrency;
        rememberCurrencyToggle.addEventListener("change", function() {
            if (!rememberCurrencyToggle.checked) {
                localStorage.removeItem("selectedCurrency");
            }
            localStorage.setItem("rememberCurrency", rememberCurrencyToggle.checked);
        });
    }

    attachEventListeners(buttons);
    attachEventListeners(inputs);
}

function addAudioElements() {
    const clickSound = document.createElement("audio");
    clickSound.id = "clickSound";
    clickSound.src = "sounds/buttonclick.wav";
    document.body.appendChild(clickSound);

    const releaseSound = document.createElement("audio");
    releaseSound.id = "releaseSound";
    releaseSound.src = "sounds/buttonclickrelease.wav";
    document.body.appendChild(releaseSound);
}

function playSoundOnInteraction(event, sound) {
    event.preventDefault();
    sound.currentTime = 0;  // Rewind to the start
    sound.play();
}

function handleMouseDown(event) {
    playSoundOnInteraction(event, clickSound);
}

function handleMouseUp(event) {
    playSoundOnInteraction(event, releaseSound);
}

function attachEventListeners(elements) {
    elements.forEach(element => {
        if (element == document.getElementById("inputDeg") || (element.tagName === "INPUT" && element.type === "number") || (element.tagName === "INPUT" && element.type === "text") || (element.tagName === "INPUT" && element.type === "range")) {
            return;
        }
        element.addEventListener("mousedown", handleMouseDown);
        element.addEventListener("mouseup", handleMouseUp);
    });
}

function detachEventListeners(elements) {
    elements.forEach(element => {
        element.removeEventListener("mousedown", handleMouseDown);
        element.removeEventListener("mouseup", handleMouseUp);
    });
}

function updateSoundSettings() {
    const enableSounds = soundToggle.checked;
    localStorage.setItem("enableSounds", enableSounds);

    const buttons = document.querySelectorAll("button");
    const inputs = document.querySelectorAll("input");

    if (enableSounds) {
        attachEventListeners(buttons);
        attachEventListeners(inputs);
    } else {
        detachEventListeners(buttons);
        detachEventListeners(inputs);
    }
}

function updateVolume() {
    const volumeSlider = document.getElementById("volumeSlider");
    const volumePercentage = document.getElementById("volumePercentage");
    const volume = volumeSlider.value;
    localStorage.setItem("volumeLevel", volume);
    
    clickSound.volume = volume;
    releaseSound.volume = volume;
    
    volumePercentage.textContent = `${Math.round(volume * 100)}%`;
}

initializePage();

