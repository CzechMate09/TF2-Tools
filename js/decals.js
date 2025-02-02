const imageInput = document.getElementById("imageInput");
const image = document.getElementById("cropper-image");
const container = document.getElementById("container");
const readmeContent = `
Thank you for using my website! <3

If you want to apply colored Clan Pride or Photo Badge, you have to use TF2 Patcher. More Info Here: 

Make sure your game is closed, then place the "tf" folder to Steam/steamapps/common/Team Fortress 2/
To find the Team Fortress folder easily, open "steam > Library > right-click on TF2 > manage > Browse local files" this will open the main TF2 directory, and now simply paste the downloaded "tf" folder.
After that, open TF2, use your Decal Tool and select the image from the "tf > custom > decal_tf2tools > scripts > items > custom_texture_blend_layers" folder.
After you have applied the decal, you can delete the decal_tf2tools folder inside the custom folder if you want to.
`;
const zipName = "decal_tf2tools"

let cropper;
var croppedImages = [];
var circleArray = [];
var circleColorArray = [];

var currentImageStep = 1; // Track which image is being uploaded
let cropperSettings = {
    aspectRatio: 1,
    viewMode: 0, // or 1
    dragMode: "move",
    responsive: true,
    autoCropArea: 1,
    zoomable: true,
    background: true,
    minCropBoxWidth: 70,
    minCropBoxHeight: 70,
    scalable: true, 
    autoCropArea: 1,
};

function initializeCropper() {
    if (cropper) cropper.destroy();
    cropper = new Cropper(image, cropperSettings);
}

// Load and preview image
imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            displayImage(e.target.result);
            updateFileName(event.target.files);
            initializeCropper();
        };
        reader.readAsDataURL(file);
    }
});

function displayImage(src) {
    image.src = src;
    setDisplay(image, "block");
    setDisplay(container, "block");
    setDisplay(document.getElementById("container-wrapper"), "block");
}

function updateFileName(files) {
    const fileNameDisplay = document.getElementById("fileName");
    if (files.length > 0) {
        setTextContent(fileNameDisplay, files[0].name)
    } else {
        setTextContent(fileNameDisplay, "No file chosen")
    }
}

//objector
const cropButton = document.getElementById("cropButton");

//flair
const cropFlairButton = document.getElementById("cropFlairButton");
const circleToggle = document.getElementById("circleToggle");
const circleColor = document.getElementById("circleColor");
const nextButton = document.getElementById("nextButton")
const generateFlairButton = document.getElementById("generateFlairButton")

const circle_group = document.getElementById("circle_group")

//photo badge
const cropPhotoBadgeButton = document.getElementById("cropPhotoBadgeButton");

//clan pride
const cropClanPrideButton = document.getElementById("cropClanPrideButton");

//all
const cropped_select = document.getElementById("cropped_select");
const overlay = document.getElementById("overlay");
const croppedImagePreview = document.getElementById("croppedImagePreview");
const downloadButton = document.getElementById("downloadButton");
const backgroundToggle = document.getElementById("backgroundToggle");
const bgColorInput = document.getElementById("bgColor");
const hideCropper = document.getElementById("hideCropper");
const inputDeg = document.getElementById("inputDeg");
const inputViewMode = document.getElementById("viewMode")
const inputDragMode = document.getElementById("dragMode")
const downloadZipButton = document.getElementById("downloadZipButton")
const cropperCropBox = document.getElementsByClassName("cropper-crop-box")

var scaleX = 1; // Horizontal scale
var scaleY = 1; // Vertical scale

// File label
fileLabel.addEventListener("mousedown", (event) => playSoundOnInteraction(event, clickSound));
fileLabel.addEventListener("mouseup", (event) => playSoundOnInteraction(event, releaseSound));

document.addEventListener("DOMContentLoaded", function() {
    showOptions("objector");
});

cropped_select.addEventListener("change", function() {
    showOptions(cropped_select.value);
});

function showOptions(selectedOption) {
    const elements = ["cropButton", "cropFlairButton", "cropClanPrideButton", "cropPhotoBadgeButton", "circle_group", "nextButton", "generateFlairButton", "reloadButton", "imageSize_group"];
    elements.forEach(element => setDisplay(document.getElementById(element), "none"));

    // Remove the circle-style class by default
    document.body.classList.remove("circle-style");

    if (selectedOption === "objector") {
        setDisplay(document.getElementById("cropButton"), "block")
        setDisplay(document.getElementById("imageSize_group"), "flex")
    } else if (selectedOption === "flair") {
        setDisplay(document.getElementById("cropFlairButton"), "block")
        setDisplay(document.getElementById("circle_group"), "block")
        document.body.classList.add("circle-style");
    } else if (selectedOption === "clanPride") {
        setDisplay(document.getElementById("cropClanPrideButton"), "block")
        document.body.classList.add("circle-style");
    } else if (selectedOption === "photoBadge") {
        setDisplay(document.getElementById("cropPhotoBadgeButton"), "block")
    }
    croppedImages = [];
    circleArray = [];
    circleColorArray = [];
    fileLabel.innerHTML = '<i class="fa-solid fa-file-import"></i>Choose File'
    // initializeCropper()
}

//objector
cropButton.addEventListener("click", () => {
    CreateCropper_objector()
});

function CreateCropper_objector() {
    if (cropper) {
        const selectedColor = backgroundToggle.checked ? bgColorInput.value : "rgba(0, 0, 0, 0)";
        const imageSizeObjector = document.getElementById("imageSizeInput").value
        const croppedCanvas = cropper.getCroppedCanvas({
            width: imageSizeObjector,  // 256 for c_picket_paper
            height: imageSizeObjector,  
            fillColor: selectedColor,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
        });

        // Show the overlay
        setDisplay(overlay, "flex")
        croppedImagePreview.src = croppedCanvas.toDataURL("image/png");
        const fileName = "paper_overlay.png"
        const zipPath = "tf/custom/decal_tf2tools/scripts/items/custom_texture_blend_layers/" + fileName;
        const imageDataUrl = croppedCanvas.toDataURL("image/png")
        downloadButton.onclick = () => {
            downloadImage(imageDataUrl, fileName)
        };

        downloadZipButton.onclick = () => {
            downloadImagePack(zipName, imageDataUrl, zipPath, readmeContent)
        }
    }
}

//photo badge
cropPhotoBadgeButton.addEventListener("click", () => {
    CreateCropper_photoBadge()
});

function CreateCropper_photoBadge() {
    if (cropper) {
        const selectedColor = backgroundToggle.checked ? bgColorInput.value : "rgba(0, 0, 0, 0)";
        const croppedCanvas = cropper.getCroppedCanvas({
            width: 128,
            height: 128,  
            fillColor: selectedColor,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
        });
        setDisplay(overlay, "flex")
        croppedImagePreview.src = croppedCanvas.toDataURL("image/png");
        const fileName = "photo_badge.png"
        const zipPath = "tf/custom/decal_tf2tools/scripts/items/custom_texture_blend_layers/" + fileName;
        const imageDataUrl = croppedCanvas.toDataURL("image/png")
        downloadButton.onclick = () => {
            downloadImage(imageDataUrl, fileName)
        };

        downloadZipButton.onclick = () => {
            downloadImagePack(zipName, imageDataUrl, zipPath, readmeContent)
        }
    }
}

//clan pride
cropClanPrideButton.addEventListener("click", () => {
    CreateCropper_clanPride()
});

function CreateCropper_clanPride() {
    if (cropper) {
        const imageSize = 124;
        const canvasSize = 128;
        const selectedColor = backgroundToggle.checked ? bgColorInput.value : "rgba(0, 0, 0, 0)";

        const croppedCanvas = cropper.getCroppedCanvas({
            width: imageSize,
            height: imageSize,
            fillColor: selectedColor,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
        });

        const roundedCanvas = document.createElement("canvas");
        roundedCanvas.width = imageSize;
        roundedCanvas.height = imageSize;
        const ctx = roundedCanvas.getContext("2d");

        ctx.beginPath();
        ctx.arc(imageSize / 2, imageSize / 2, imageSize / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(croppedCanvas, 0, 0, imageSize, imageSize);

        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = canvasSize;
        finalCanvas.height = canvasSize;
        const finalCanvasCtx = finalCanvas.getContext("2d");

        finalCanvasCtx.fillStyle = selectedColor;
        finalCanvasCtx.fillRect(0, 0, canvasSize, canvasSize);

        const offset = (canvasSize - imageSize) / 2;
        finalCanvasCtx.drawImage(roundedCanvas, offset, offset, imageSize, imageSize);

        const fileName = "clan_pride.png"
        const zipPath = "tf/custom/decal_tf2tools/scripts/items/custom_texture_blend_layers/" + fileName;
        const imageDataUrl = finalCanvas.toDataURL("image/png", 1);
        setDisplay(overlay, "flex")

        croppedImagePreview.src = imageDataUrl;
        downloadButton.onclick = () => {
            downloadImage(imageDataUrl, fileName)
        };

        downloadZipButton.onclick = () => {
            downloadImagePack(zipName, imageDataUrl, zipPath, readmeContent);
        };
    }
}

//flair
const imageSize = 60
cropFlairButton.addEventListener("click", () => {
    CreateCropper_flair()
});

function CreateCropper_flair() {
    if (cropper) {
        const selectedColor = backgroundToggle.checked ? bgColorInput.value : "rgba(0, 0, 0, 0)";
        const croppedCanvas = cropper.getCroppedCanvas({
            width: 60, //it"s actually just 60px, not 64 despite the fact that it needs to be 128px????? 
            height: 60, 
            fillColor: selectedColor,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
        });
        const roundedCanvas = document.createElement("canvas");
        roundedCanvas.width = imageSize;
        roundedCanvas.height = imageSize;
        const ctx = roundedCanvas.getContext("2d");

        ctx.beginPath();
        ctx.arc(imageSize/2, imageSize/2, imageSize/2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(croppedCanvas, 0, 0, imageSize, imageSize);

        croppedImages.push(roundedCanvas.toDataURL("image/png", 1));
        if (circleToggle.checked) {
            circleArray.push(true);
            circleColorArray.push(circleColor.value);
        } else {
            circleArray.push(false);
            circleColorArray.push("rgba(0, 0, 0, 0)");
        }

        setDisplay(cropFlairButton, "none")
        setDisplay(fileLabel, "none")

        if (croppedImages.length < 4) {
            setDisplay(nextButton, "flex")
        } else {
            setDisplay(generateFlairButton, "block")
        }
    }
}

document.getElementById("okButton").onclick = () => {
    setDisplay(overlay, "none")
};

document.getElementById("reset").onclick = () => {
    cropper.reset();
    scaleX = 1;
    scaleY = 1;
    setBackgroundColor(container, "rgba(0, 0, 0, 0)")
    setBackgroundColor(cropperCropBox[0], "rgba(0, 0, 0, 0)")
    setDisplay(bgColorInput, "none")
    cropperSettings.background = true;
    hideCropper.checked = false;
    backgroundToggle.checked = false;
    inputDeg.value = 45;
    cropperSettings.viewMode = 0;
    cropperSettings.dragMode = "move";
    inputViewMode.value = 0
    inputDragMode.value = "move"
    document.documentElement.style.setProperty("--circle-color", "transparent");
    circleToggle.checked = false;
    setDisplay(circleColor, "none")
    initializeCropper();
};

document.getElementById("rotate").onclick = () => {
    cropper.rotate(inputDeg.value);
};

document.getElementById("mirror_hor").onclick = () => {
    scaleX = scaleX === 1 ? -1 : 1;
    cropper.scaleX(scaleX);
};

document.getElementById("mirror_ver").onclick = () => {
    scaleY = scaleY === 1 ? -1 : 1;
    cropper.scaleY(scaleY); 
};

inputViewMode.addEventListener("change", function () {
    cropperSettings.viewMode = parseInt(this.value, 10);
    initializeCropper();
});

// Background Toggle
backgroundToggle.addEventListener("change", function () {
    cropperSettings.background = !this.checked;
    if (this.checked) {
        setBackgroundColor(container, bgColorInput.value)
        setBackgroundColor(cropperCropBox[0], bgColorInput.value)
        setDisplay(bgColorInput, "inline-block")
        initializeCropper();
        hideCropper.checked = false
    } else {
        setBackgroundColor(container, "transparent")
        setBackgroundColor(cropperCropBox[0], "transparent")
        setDisplay(bgColorInput, "none")
        initializeCropper();
        hideCropper.checked = false
    }
});

circleToggle.addEventListener("change", function () {
    if (this.checked) {
        document.documentElement.style.setProperty("--circle-color", circleColor.value);
        setDisplay(circleColor, "inline-block")
        initializeCropper();
        hideCropper.checked = false
    } else {
        document.documentElement.style.setProperty("--circle-color", "transparent");
        setDisplay(circleColor, "none")
        initializeCropper();
        hideCropper.checked = false
    }
});

hideCropper.addEventListener("change", function () {
    this.checked ? cropper.clear() : cropper.crop();
});

bgColorInput.addEventListener("input", function () {
    setBackgroundColor(container, this.value)
});

circleColor.addEventListener("input", function () {
    document.documentElement.style.setProperty("--circle-color", circleColor.value);
});

inputDragMode.addEventListener("change", function () {
    cropperSettings.dragMode = this.value;
    initializeCropper();
});

nextButton.addEventListener("click", () => {
    currentImageStep++;
    imageInput.value = "";
    image.src = "";
    setDisplay(cropFlairButton, "block")
    setDisplay(nextButton, "none")
    imageInput.click(); 
    setDisplay(fileLabel, "block")
    fileLabel.innerHTML = '<i class="fa-solid fa-file-import"></i>Reselect image'
});

generateFlairButton.addEventListener("click", () => {
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = 128; //60 outer, 48 inner circle
    finalCanvas.height = 128;
    const ctx = finalCanvas.getContext("2d");

    // Draw each cropped image in the 2x2 grid
    const positions = [
        { x: 2, y: 2 },
        { x: 66, y: 2 },
        { x: 2, y: 66 },
        { x: 66, y: 66 }
    ];
    croppedImages.forEach((dataUrl, index) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
            const pos = positions[index];
            ctx.save();

            if (circleArray[index] == true) {
                // Draws the black ring
                ctx.beginPath();
                ctx.arc(pos.x + imageSize / 2, pos.y + imageSize / 2, 30, 0, Math.PI * 2); // Outer circle (30px radius for 60px diameter)
                ctx.closePath();
                ctx.fillStyle = circleColorArray[index];
                ctx.fill();
                ctx.restore();

                // Clip a smaller circle (48px diameter) and draw the image within it
                ctx.save();
                ctx.beginPath();
                ctx.arc(pos.x + imageSize / 2, pos.y + imageSize / 2, 24, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
            }

            ctx.drawImage(img, pos.x, pos.y, imageSize, imageSize);
            ctx.restore();

            if (index === croppedImages.length - 1) {
                setDisplay(overlay, "flex")
                let imageDataUrl = finalCanvas.toDataURL("image/png", 1)
                croppedImagePreview.src = imageDataUrl;
                const fileName = "flair_template_guide.png"
                const zipPath = "tf/custom/decal_tf2tools/scripts/items/custom_texture_blend_layers/" + fileName;
                downloadButton.onclick = () => {
                    downloadImage(imageDataUrl, fileName)
                }
                downloadZipButton.onclick = () => {
                    downloadImagePack(zipName, imageDataUrl, zipPath, readmeContent)
                }
                
            }
        };
    });

    setDisplay(document.getElementById("reloadButton"), "flex")
    setDisplay(generateFlairButton, "none")
});