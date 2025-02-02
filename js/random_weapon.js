document.addEventListener("DOMContentLoaded", () => {
    const generate_random_weapon_button = document.getElementById("generate_random_weapon_button")
   
    fetch("json/weapons.json")
    .then(response => response.json())
    .then(data => {
        weapons = data.weapons;
        populateFilters(weapons);
    });

    fetch("json/attribute_list.json")
    .then(response => response.json())
    .then(data => {
        attributes = data;
    });

    fetch("json/community-made/community_description.json")
    .then(response => response.json())
    .then(data => {
        communityDescriptions = data.community_descriptions;
    });

    fetch("json/community-made/community_name.json")
    .then(response => response.json())
    .then(data => {
        communityName = data.community_names;
    });

    fetch("json/community-made/community_type.json")
    .then(response => response.json())
    .then(data => {
        communityType = data.community_weapon_types;
    });

    fetch("json/community-made/community_attribute.json")
        .then(response => response.json())
        .then(data => {
        communityAttributes = data.community_attributes;
    });

    generate_random_weapon_button.addEventListener("click", () => {
        GenerateRandomWeapon(weapons, attributes, communityDescriptions, communityName, communityType, communityAttributes)
    })

   
    toggleDisplay("custom_level_range_checkbox", "custom_level_range_inputs", "flex");
    toggleDisplay("use_multiples_checkbox", "multiple_value_input", "inline-block");

    const scaleSelect = document.getElementById("scale_select");
    const resolutionDisplay = document.getElementById("resolution_display");
    const container = document.querySelector(".weapon_card_container");

    function getDimensions() {
        const originalWidth = container.offsetWidth;
        const originalHeight = container.offsetHeight;
        const scale = parseInt(scaleSelect.value);
        return { originalWidth, originalHeight, scale };
    }

    function updateResolutionDisplay() {
        const { originalWidth, originalHeight, scale } = getDimensions();
        const width = originalWidth * scale;
        const height = originalHeight * scale;
        setTextContent(resolutionDisplay, `(Image Resolution: ${width} x ${height})`);
    }

    scaleSelect.addEventListener("change", updateResolutionDisplay);

    const observer = new MutationObserver(updateResolutionDisplay);
    observer.observe(container, { attributes: true, childList: true, subtree: true });

    updateResolutionDisplay();

    document.getElementById("download_card_button").addEventListener("click", () => {
        const { originalWidth, originalHeight, scale } = getDimensions();

        domtoimage.toPng(container, {
        style: {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: `${container.offsetWidth}px`,
            height: `${container.offsetHeight}px`,
        },
            width: originalWidth * scale,
            height: originalHeight * scale,
            quality: 1,
            useCORS: true
        })
        .then(dataUrl => {
            const link = document.createElement("a");
            link.download = "weapon_card.png";
            link.href = dataUrl;
            link.click();
        })
        .catch(error => {
            console.error("An error occurred while capturing the image:", error);
            alert("An error occurred while capturing the image: " + error)
        });
    });
    const matchNameWithImageCheckbox = document.getElementById("match_name_with_image_checkbox");
    const matchNameWithTypeCheckbox = document.getElementById("match_name_with_type_checkbox");
    const communityNameCheckbox = document.getElementById("community_name_checkbox");
    const communityTypeCheckbox = document.getElementById("community_type_checkbox");

    function handleCheckboxChange(event) {
        if (event.target === communityNameCheckbox && communityNameCheckbox.checked) {
            matchNameWithImageCheckbox.checked = false;
            matchNameWithTypeCheckbox.checked = false;
        } else if ((event.target === matchNameWithImageCheckbox || event.target === matchNameWithTypeCheckbox) && (matchNameWithImageCheckbox.checked || matchNameWithTypeCheckbox.checked)) {
            communityNameCheckbox.checked = false;
        }

        if (event.target === communityTypeCheckbox && communityTypeCheckbox.checked) {
            matchNameWithTypeCheckbox.checked = false;
        } else if (event.target === matchNameWithTypeCheckbox && matchNameWithTypeCheckbox.checked) {
            communityTypeCheckbox.checked = false;
        }
    }

    matchNameWithImageCheckbox.addEventListener("change", handleCheckboxChange);
    matchNameWithTypeCheckbox.addEventListener("change", handleCheckboxChange);
    communityNameCheckbox.addEventListener("change", handleCheckboxChange);
    communityTypeCheckbox.addEventListener("change", handleCheckboxChange);
})

function GenerateRandomWeapon(weapons, attributes, communityDescriptions, communityNames, communityTypes) {
    const classFilter = document.getElementById("weapon-class-filter").value;
    const slotFilter = document.getElementById("weapon-slot-filter").value;
    const typeFilter = document.getElementById("weapon-type-filter").value;
    const weaponFilter = document.getElementById("weapon-filter").value;

    const matchNameWithImage = document.getElementById("match_name_with_image_checkbox").checked;
    const matchNameWithType = document.getElementById("match_name_with_type_checkbox").checked;
    const useCommunityName = document.getElementById("community_name_checkbox").checked;
    const useCommunityType = document.getElementById("community_type_checkbox").checked;

    let filteredWeapons = weapons;

    if (classFilter) {
        filteredWeapons = filteredWeapons.filter(weapon => weapon.class.includes(classFilter));
    }

    if (slotFilter) {
        filteredWeapons = filteredWeapons.filter(weapon => weapon.slot === slotFilter);
    }

    if (typeFilter) {
        filteredWeapons = filteredWeapons.filter(weapon => weapon.type === typeFilter);
    }

    if (weaponFilter) {
        filteredWeapons = filteredWeapons.filter(weapon => weapon.name === weaponFilter);
    }

    if (filteredWeapons.length === 0) {
        alert("No weapons match the selected filters.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredWeapons.length);
    const selectedWeapon = filteredWeapons[randomIndex];

    const nameDisplay = document.getElementById("weapon_attr_name_display");
    const imageDisplay = document.getElementById("weapon_card_image");
    const typeDisplay = document.getElementById("weapon_attr_weaponType_display");
    
    if (useCommunityName) {
        const randomCommunityIndex = Math.floor(Math.random() * communityNames.length);
        const communityName = communityNames[randomCommunityIndex].name;
        setTextContent(nameDisplay, communityName);
    } else {
        setTextContent(nameDisplay, selectedWeapon.name);
    }

    setDisplay(imageDisplay, "flex")
    imageDisplay.src = matchNameWithImage ? selectedWeapon.image : RandomWeapon(weapons).image;

    let type;
    if (useCommunityType) {
        const randomCommunityTypeIndex = Math.floor(Math.random() * communityTypes.length);
        type = communityTypes[randomCommunityTypeIndex].weapon_type;
    } else {
        type = matchNameWithType ? selectedWeapon.type : RandomWeapon(weapons).type;
    }
    setDisplay(typeDisplay, "block");

    const level = GenerateRandom_Level();
    const display = document.getElementById("weapon_attr_weaponType_display");

    let displayText = "";
    if (level) {
        displayText += `Level ${level}`;
    }
    if (type) {
        if (displayText) {
            displayText += " ";
        }
        displayText += type;
    }

    if (displayText) {
        setTextContent(display, displayText)
        setDisplay(display, "block")
    } else {
        setDisplay(display, "none")
    }

    GenerateRandom_Stats(attributes, communityAttributes);

    const use_random_description_checkbox = document.getElementById("use_random_description_checkbox");
    const use_community_description_checkbox = document.getElementById("use_community_description_checkbox");

    if (use_random_description_checkbox.checked || use_community_description_checkbox.checked) {
        GenerateRandom_description(weapons, communityDescriptions, use_random_description_checkbox.checked, use_community_description_checkbox.checked);
    }

}

function GenerateRandom_Level() {
    let min = 1;
    let max = 100;

    const customLevelRangeCheckbox = document.getElementById("custom_level_range_checkbox");
    if (customLevelRangeCheckbox.checked) {
        const customMin = parseInt(document.getElementById("custom_level_min").value, 10);
        const customMax = parseInt(document.getElementById("custom_level_max").value, 10);
        if (!isNaN(customMin) && !isNaN(customMax) && customMin <= customMax) {
            min = customMin;
            max = customMax;
        }
    }

    return getRandomInt(min, max)
}

function GenerateRandom_Stats(attributes, communityAttributes) {
    const customStatDisplay = document.getElementById("weapon_attr_customStat_display");
    customStatDisplay.innerHTML = "";

    let minStats = 1;
    let maxStats = 5;

    const customMinStats = parseInt(document.getElementById("custom_stat_min_input").value, 10);
    const customMaxStats = parseInt(document.getElementById("custom_stat_max_input").value, 10);
    if (!isNaN(customMinStats) && !isNaN(customMaxStats) && customMinStats <= customMaxStats) {
        minStats = customMinStats;
        maxStats = customMaxStats;
    }

    const numStats = getRandomInt(minStats, maxStats);
    const neutralStats = [];
    const positiveStats = [];
    const negativeStats = [];

    const customMinValue = parseInt(document.getElementById("custom_stat_min_value").value, 10);
    const customMaxValue = parseInt(document.getElementById("custom_stat_max_value").value, 10);
    const useMultiples = document.getElementById("use_multiples_checkbox").checked;
    const multipleValue = parseInt(document.getElementById("multiple_value_input").value, 10);

    // Filter attributes based on user selection
    let selectedAttributes = [];
    if (document.getElementById("use_normal_stats_checkbox").checked) {
        selectedAttributes = selectedAttributes.concat(attributes.attributes);
    }
    if (document.getElementById("use_hidden_stats_checkbox").checked) {
        selectedAttributes = selectedAttributes.concat(attributes.attributes_hidden);
    }
    if (document.getElementById("use_unused_stats_checkbox").checked) {
        selectedAttributes = selectedAttributes.concat(attributes.attributes_unused);
    }
    if (document.getElementById("community_stats_checkbox").checked) {
        selectedAttributes = selectedAttributes.concat(communityAttributes);
    }
  
    for (let i = 0; i < numStats; i++) {
        let selectedAttribute;
        let description = "";

        // Loop until a non-empty description is found
        while (!description) {
            const randomIndex = Math.floor(Math.random() * selectedAttributes.length);
            selectedAttribute = selectedAttributes[randomIndex];
            description = selectedAttribute.description;
        }

        // let randomValue;
        // if (!isNaN(customMinValue) && !isNaN(customMaxValue) && customMinValue <= customMaxValue) {
        //     randomValue = getRandomInt(customMinValue, customMaxValue);
        // } else {
        //     randomValue = getRandomInt(1, 100); // Default range
        // }

        // if (useMultiples && !isNaN(multipleValue) && multipleValue > 0) {
        //     randomValue = Math.floor(randomValue / multipleValue) * multipleValue;
        // }

        // description = description.replace("%s1", randomValue);

        const placeholderValues = {};
        description = description.replace(/%s(\d+)/g, (match, p1) => {
            if (!placeholderValues[p1]) {
                let randomValue;
                if (!isNaN(customMinValue) && !isNaN(customMaxValue) && customMinValue <= customMaxValue) {
                    randomValue = getRandomInt(customMinValue, customMaxValue);
                } else {
                    randomValue = getRandomInt(1, 100); // Default range
                }

                if (useMultiples && !isNaN(multipleValue) && multipleValue > 0) {
                    randomValue = Math.floor(randomValue / multipleValue) * multipleValue;
                }

                placeholderValues[p1] = randomValue;
            }
            return placeholderValues[p1];
        });

        const descriptionParts = description.split("\n");
        descriptionParts.forEach(part => {
            const statDiv = document.createElement("div");
            setTextContent(statDiv, part.trim())
            statDiv.className = selectedAttribute.status;

            if (selectedAttribute.status === "neutral") {
                neutralStats.push(statDiv);
            } else if (selectedAttribute.status === "positive") {
                positiveStats.push(statDiv);
            } else if (selectedAttribute.status === "negative") {
                negativeStats.push(statDiv);
            }
        });
    }

    neutralStats.forEach(stat => customStatDisplay.appendChild(stat));
    positiveStats.forEach(stat => customStatDisplay.appendChild(stat));
    negativeStats.forEach(stat => customStatDisplay.appendChild(stat));

    setDisplay(customStatDisplay, "block")
}

function populateFilters(weapons) {
    const filters = {
        "weapon-class-filter": [...new Set(weapons.map(weapon => weapon.class).flat())],
        "weapon-slot-filter": [...new Set(weapons.map(weapon => weapon.slot))],
        "weapon-type-filter": [...new Set(weapons.map(weapon => weapon.type))],
        "weapon-filter": [...new Set(weapons.map(weapon => weapon.name))]
    };

    Object.keys(filters).forEach(filterId => {
        const filterElement = document.getElementById(filterId);
        filters[filterId].forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            setTextContent(option, value)
            filterElement.appendChild(option);
        });
    });
}

function GenerateRandom_description(weapons, communityDescriptions, useRandomWeaponDescription, useCommunityDescription) {
    const descriptionDisplay = document.getElementById("weapon_attr_customStat_display");
    descriptionDisplay.innerHTML = "";
    let description = "";

    if (useRandomWeaponDescription && useCommunityDescription) {
        console.log("Both random weapon and community descriptions selected. Choosing randomly between the two...");
        const randomChoice = Math.random() < 0.5 ? "weapon" : "community";
        if (randomChoice === "weapon") {
            description = getRandomWeaponDescription(weapons);
        } else {
            description = getRandomCommunityDescription(communityDescriptions);
        }
    } else if (useRandomWeaponDescription) {
        description = getRandomWeaponDescription(weapons);
    } else if (useCommunityDescription) {
        description = getRandomCommunityDescription(communityDescriptions);
    }

    if (description) {
        const descriptionParts = description.split("\n");
        descriptionParts.forEach(part => {
            const statDiv = document.createElement("div");
            setTextContent(statDiv, part.trim());
            statDiv.className = "neutral";
            descriptionDisplay.appendChild(statDiv);
        });
        setDisplay(descriptionDisplay, "block");
    }
}

function getRandomWeaponDescription(weapons) {
    let description = "";
    while (!description) {
        const selectedWeapon = RandomWeapon(weapons);
        description = selectedWeapon.description || selectedWeapon.weapon_stats.find(stat => stat.id === null)?.value || "";
    }
    return description;
}

function getRandomCommunityDescription(communityDescriptions) {
    const randomIndex = Math.floor(Math.random() * communityDescriptions.length);
    return communityDescriptions[randomIndex].description;
}