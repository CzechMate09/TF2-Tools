document.getElementById("convert").addEventListener("click", convert);

const baseUrl = "https://steamuserimages-a.akamaihd.net/ugc/";
const elements = {
    url: document.getElementById("url"),
    ugcImg: document.getElementById("ugc_img"),
    ugcGroup: document.getElementById("ugc_group"),
    hiInt: document.getElementById("hi_int"),
    loInt: document.getElementById("lo_int"),
    hiFloat: document.getElementById("hi_float"),
    loFloat: document.getElementById("lo_float"),
    customTextureHi: document.getElementById("custom_texture_hi"),
    customTextureLo: document.getElementById("custom_texture_lo")
};

function setDisplay(element, display) {
    element.style.display = display;
}

function convert() {
    try {
        let url = elements.url.value;

        if (!url.startsWith(baseUrl)) {
            if (url.startsWith("ugc/")) {
                url = baseUrl + url.substring(4);
            } else {
                alert("Invalid URL format");
                return;
            }
        }

        elements.ugcImg.src = url;
        setDisplay(elements.ugcGroup, "block");

        let start = url.lastIndexOf("ugc/") + 4;
        let end = url.indexOf("/", start);
        if (start === 3 || end === -1) {
            alert("Invalid URL format");
            return;
        }

        let number = BigInt(url.substring(start, end));
        let hi = number >> 32n;
        let lo = number & 0xFFFFFFFFn;

        elements.hiInt.value = hi;
        elements.loInt.value = lo;

        let buffer = new ArrayBuffer(8);
        let intArray = new Int32Array(buffer);
        intArray[0] = Number(hi);
        intArray[1] = Number(lo);
        let floatArray = new Float32Array(buffer);
        elements.hiFloat.value = floatArray[0];
        elements.loFloat.value = floatArray[1];

        elements.customTextureHi.innerText = `AddAttribute("custom texture hi", ${floatArray[0]}, -1)`;
        elements.customTextureLo.innerText = `AddAttribute("custom texture lo", ${floatArray[1]}, -1)`;

    } catch (error) {
        alert("Error processing input");
        console.error(error);
    }
}