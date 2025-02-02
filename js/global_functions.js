function toggleDisplay(checkboxId, elementId, displayStyle) {
    document.getElementById(checkboxId).addEventListener("change", function() {
        const element = document.getElementById(elementId);
        setDisplay(element, this.checked ? displayStyle : "none")
    });
}

function setInputValue(elementId, value) {
    const element = document.getElementById(elementId);
    element.value = value;
    element.dispatchEvent(new Event("input"));
}

function toggleCheckbox(checkboxId, value, inputId) {
    const checkbox = document.getElementById(checkboxId);
    checkbox.checked = value !== null;
    checkbox.dispatchEvent(new Event("change"));
    setInputValue(inputId, value || "");
}

function RandomWeapon(weapons) {
    return weapons[Math.floor(Math.random() * weapons.length)];
}

function setDisplay(element, displayStyle) {
    element.style.display = displayStyle;
}

function setTextContent(element, textContent) {
    element.textContent = textContent;
}
function setBackgroundColor(element, backgroundColor) {
    element.style.backgroundColor = backgroundColor;
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

function downloadImage(imageDataUrl, fileName) {
    const link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = fileName;
    link.click();
}

function downloadImagePack(zipName, imageDataUrl, zipPath, readmeContent) {
    fetch(imageDataUrl)
        .then(response => response.blob())
        .then(blob => {
            const zip = new JSZip();
            zip.file(zipPath, blob);
            zip.file("readme.txt", readmeContent);
            zip.generateAsync({ type: "blob" }).then(content => {
                const downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(content);
                downloadLink.download = "decal.zip";
                downloadLink.download = zipName + ".zip";
                downloadLink.click();
            });
        })
        .catch(error => {
            console.error("Error creating zip file:", error);
            alert("Error creating zip file: " + error)
        });
}

function copyToClipboard(elementId) {
    var copyText = document.getElementById(elementId);
    var textToCopy;

    if (copyText.tagName === "INPUT" || copyText.tagName === "TEXTAREA") {
        let isDisabled = copyText.disabled;
        if (isDisabled) {
            copyText.disabled = false;
        }
        copyText.select();
        textToCopy = copyText.value;
        if (isDisabled) {
            copyText.disabled = true;
        }
    } else {
        var range = document.createRange();
        range.selectNode(copyText);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        textToCopy = window.getSelection().toString();
    }

    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}