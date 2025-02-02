async function loadImageData() {
    const response = await fetch("json/backgrounds.json");
    return await response.json();
}

// Original Snippet: https://gist.github.com/endel/dfe6bb2fbe679781948c
var Moon = {
    phases: ["new-moon", "waxing-crescent-moon", "quarter-moon", "waxing-gibbous-moon", "full-moon", "waning-gibbous-moon", "last-quarter-moon", "waning-crescent-moon"],
    phase: function (year, month, day) {
        let c = e = jd = b = 0;
    
        if (month < 3) {
            year--;
            month += 12;
        }
    
        ++month;
        c = 365.25 * year;
        e = 30.6 * month;
        jd = c + e + day - 694039.09; // jd is total days elapsed
        jd /= 29.5305882; // divide by the moon cycle
        b = parseInt(jd); // int(jd) -> b, take integer part of jd
        jd -= b; // subtract integer part to leave fractional part of original jd
        b = Math.round(jd * 8); // scale fraction from 0-8 and round
    
        if (b >= 8) b = 0; // 0 and 8 are the same so turn 8 into 0
        // 0 => New Moon
        // 1 => Waxing Crescent Moon
        // 2 => Quarter Moon
        // 3 => Waxing Gibbous Moon
        // 4 => Full Moon
        // 5 => Waning Gibbous Moon
        // 6 => Last Quarter Moon
        // 7 => Waning Crescent Moon

      return {phase: b, name: Moon.phases[b]};
    }
};
  
function isFullMoon() {
    const today = new Date();
    const moonPhase = Moon.phase(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return moonPhase.name === "full-moon";
}

function isFullMoonEvent(date = new Date()) {
    const referenceDate = new Date(Date.UTC(2016, 4, 21, 0, 0, 0)); // May 21, 2016 UTC
    const lunarCycle = 29.53 * 24 * 60 * 60 * 1000; // Lunar cycle in milliseconds
    const eventDuration = 2 * 24 * 60 * 60 * 1000; // 48 hours in milliseconds
  
    const diff = date - referenceDate;
    const cyclePosition = diff % lunarCycle;
  
    return cyclePosition >= 0 && cyclePosition < eventDuration;
  }

function getCurrentSeason() {
    const date = new Date();
    const month = date.getMonth() + 1; // JavaScript months are 0-11

    if (month === 10 || isFullMoonEvent(new Date())) return "halloween";
    if (month === 12) return "christmas"; // December
    return "main"; // Default is "normal"
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function setRandomBackgroundAndCharacter() {
    try {
        const imageData = await loadImageData();
        const season = getCurrentSeason();

        if (!imageData[season]) {
            console.error(`Season data not found for ${season}`);
            return;
        }

        const backgrounds = imageData[season].backgrounds;
        const characters = imageData[season].characters;
        
        if (backgrounds.length === 0 || characters.length === 0) {
            console.error(`No images found for season: ${season}`);
            return;
        }

        const randomBackground = getRandomItem(backgrounds);
        const backgroundUrl = randomBackground.url;
        const hasCharacter = randomBackground.hasCharacter !== false;
        let characterUrl = "";
        if (hasCharacter && characters.length > 0) {
            characterUrl = getRandomItem(characters);
        }

        const mainMenu = document.querySelector(".main_menu");
        if (characterUrl) {
            mainMenu.style.backgroundImage = `url(${characterUrl}), url(${backgroundUrl})`;
        } else {
            mainMenu.style.backgroundImage = `url(${characterUrl}), url(${backgroundUrl})`;
        }
    } catch (error) {
        console.error("Error loading or setting images:", error);
    }
}

window.addEventListener("load", setRandomBackgroundAndCharacter);
const h1Element = document.querySelector("h1");
const shadowColor = "#b25216";
const startXOffset = -10;
const endXOffset = 30;
const startYOffset = -10;
const endYOffset = 30;

let shadowStyles = "";
for (let i = 0; i <= endXOffset - startXOffset; i++) {
    const xOffset = startXOffset + i;
    const yOffset = startYOffset + i;
    shadowStyles += `${xOffset}px ${yOffset}px ${shadowColor}`;
    if (i < endXOffset - startXOffset) shadowStyles += ", ";
}
h1Element.style.textShadow = shadowStyles;