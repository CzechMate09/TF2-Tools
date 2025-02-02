// --- download card ---
document.addEventListener("DOMContentLoaded", () => {
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
    setTextContent(resolutionDisplay, `(Image Resolution: ${width} x ${height})`)
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
      alert("An error occurred while capturing the image: " + error)
      console.error("An error occurred while capturing the image:", error);
    });
  });
});

// --- Weapon image ---  
const imageUpload = document.getElementById("imageUpload");
const weaponCardImage = document.getElementById("weapon_card_image");

imageUpload.addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      setDisplay(weaponCardImage, "flex")
      weaponCardImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// --- name ---
const weaponAttrNameInput = document.getElementById("weapon_attr_name_input");
const weaponAttrNameDisplay = document.getElementById("weapon_attr_name_display");

weaponAttrNameInput.addEventListener("input", function(event) {
  setTextContent(weaponAttrNameDisplay, event.target.value)
});
  
// --- Weapon quality ---  
const qualityColors = {
  normal: "var(--q_normal)",
  unique: "var(--q_unique)",
  vintage: "var(--q_vintage)",
  genuine: "var(--q_genuine)",
  strange: "var(--q_strange)",
  unusual: "var(--q_unusual)",
  haunted: "var(--q_haunted)",
  collectors: "var(--q_collectors)",
  decorated: "var(--q_decorated)",
  community: "var(--q_community)",
  selfmade: "var(--q_community)",
  valve: "var(--q_valve)"
};

function populateQualitySelect() {
  const qualitySelect = document.getElementById("weapon_attr_quality_select");
  qualitySelect.innerHTML = '';

  for (const quality in qualityColors) {
    const option = document.createElement("option");
    option.value = quality;
    option.textContent = quality.charAt(0).toUpperCase() + quality.slice(1);
    if (quality === 'unique') {
      option.selected = true;
    }
    qualitySelect.appendChild(option);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  populateQualitySelect();

  document.getElementById("weapon_attr_quality_select").addEventListener("change", function(event) {
    const quality = event.target.value;
    const nameDisplay = document.getElementById("weapon_attr_name_display");
    nameDisplay.style.color = qualityColors[quality] || "var(--q_unique)";
  });
});

// --- weapon level and type ---
  const limitedCheckbox = document.getElementById("weapon_attr_limited_checkbox");
  function updateLevelTypeDisplay() {
    const level = document.getElementById("weapon_attr_level_input").value;
    const type = document.getElementById("weapon_attr_weaponType_input").value;
    const display = document.getElementById("weapon_attr_weaponType_display");

    let displayText = "";
    if (limitedCheckbox.checked) {
      displayText += "Limited ";
      display.style.color = "yellow";
    } else {
      display.style.color = "";
    }

    if (level || type) {
      displayText += level ? `Level ${level} ` : "";
      displayText += type ? type : '';
      setTextContent(display, displayText.trim())
      setDisplay(display, "block")
    } else {
      setTextContent(display, "")
      setDisplay(display, "none")
    }
}

limitedCheckbox.addEventListener("change", updateLevelTypeDisplay);
document.getElementById("weapon_attr_level_input").addEventListener("input", updateLevelTypeDisplay);
document.getElementById("weapon_attr_weaponType_input").addEventListener("input", updateLevelTypeDisplay);

// --- Crafted by ---
document.getElementById("weapon_attr_crafted_checkbox").addEventListener("change", function(event) {
  const isChecked = event.target.checked;
  const craftedByLabel = document.getElementById("craftedByLabel");
  const craftedByInput = document.getElementById("weapon_attr_crafted_input");
  const craftedDisplay = document.getElementById("weapon_attr_crafted_display");

  if (isChecked) {
    setDisplay(craftedByLabel, "inline");
    setDisplay(craftedByInput, "inline");
    setDisplay(craftedDisplay, "block");
  } else {
    setDisplay(craftedByLabel, "none");
    setDisplay(craftedByInput, "none");
    setDisplay(craftedDisplay, "none");
  }
});

document.getElementById("weapon_attr_crafted_input").addEventListener("input", function(event) {
  setTextContent(document.getElementById("weapon_attr_crafted_display"), `Crafted by ${event.target.value}`)
});

// --- halloween resctriction ---
// --- halloween restriction ---
document.getElementById("weapon_attr_restrictionHalloween_checkbox").addEventListener("change", function(event) {
  const isChecked = event.target.checked;
  const weaponAttrRestrictionDisplay = document.getElementById("weapon_attr_restriction_display");
  const weaponAttrRestrictionCustomCheckbox = document.getElementById("weapon_attr_restrictionCustom_checkbox");
  const weaponAttrRestrictionCustomInput = document.getElementById("weapon_attr_restrictionCustom_input");

  if (isChecked) {
    weaponAttrRestrictionCustomCheckbox.checked = false;
    setDisplay(weaponAttrRestrictionCustomInput, "none");
    setDisplay(weaponAttrRestrictionDisplay, "block");
    setTextContent(weaponAttrRestrictionDisplay, "Halloween Restriction: Halloween / Full Moon")
  } else {
    if (!weaponAttrRestrictionCustomCheckbox.checked) {
      setDisplay(weaponAttrRestrictionDisplay, "none");
    }
  }
});

document.getElementById("weapon_attr_restrictionCustom_checkbox").addEventListener("change", function(event) {
  const isChecked = event.target.checked;
  const weaponAttrRestrictionDisplay = document.getElementById("weapon_attr_restriction_display");
  const weaponAttrRestrictionCustomInput = document.getElementById("weapon_attr_restrictionCustom_input");
  const weaponAttrRestrictionHalloweenCheckbox = document.getElementById("weapon_attr_restrictionHalloween_checkbox");

  if (isChecked) {
    weaponAttrRestrictionHalloweenCheckbox.checked = false;
    setDisplay(weaponAttrRestrictionDisplay, "inline");
    setDisplay(weaponAttrRestrictionCustomInput, "inline");
    setTextContent(weaponAttrRestrictionDisplay, weaponAttrRestrictionCustomInput.value)
  } else {
    setDisplay(weaponAttrRestrictionCustomInput, "none");
    if (weaponAttrRestrictionHalloweenCheckbox.checked) {
      setTextContent(weaponAttrRestrictionDisplay, "Halloween Restriction: Halloween / Full Moon")
    } else {
      setDisplay(weaponAttrRestrictionDisplay, "none");
    }
  }
});

document.getElementById("weapon_attr_restrictionCustom_input").addEventListener("input", function(event) {
  setTextContent(document.getElementById("weapon_attr_restriction_display"), event.target.value)
});


// --- Strange Parts ---
document.getElementById("addStrangePartButton").addEventListener("click", function() {
  const container = document.getElementById("weapon_attributes_strange_container");
  
  function createStrangeAttribute() {
    const strangeAttribute = document.createElement("div");
    strangeAttribute.className = "strange_attribute";
    strangeAttribute.innerHTML = `
      <div class="handle"><i class="fa-solid fa-bars"></i></div>
      <input type="text" placeholder="Strange Name" autocomplete="off" class="strange_name_input">
      <input type="number" placeholder="1984" autocomplete="off" class="strange_number_input">
      <button class="removeStrangePartButton"><i class="icon">&#xe922</i></button>
    `;
    return strangeAttribute;
  }

  const strangeAttribute = createStrangeAttribute();
  container.appendChild(strangeAttribute);

  const nameInput = strangeAttribute.querySelector(".strange_name_input");
  const numberInput = strangeAttribute.querySelector(".strange_number_input");
  const removeButton = strangeAttribute.querySelector(".removeStrangePartButton");

  nameInput.addEventListener("input", updateStrangeDisplay);
  numberInput.addEventListener("input", updateStrangeDisplay);
  removeButton.addEventListener("click", function() {
    container.removeChild(strangeAttribute);
    updateStrangeDisplay();
  });
});

function updateStrangeDisplay() {
  const strangeParts = document.querySelectorAll(".strange_attribute");
  const strangeDisplay = document.getElementById("weapon_attr_strange_display");
  strangeDisplay.innerHTML = "";

  if (strangeParts.length === 0) {
    setDisplay(strangeDisplay, "none")
  } else {
    setDisplay(strangeDisplay, "block")
    strangeParts.forEach(part => {
      const name = part.querySelector(".strange_name_input").value;
      const number = part.querySelector(".strange_number_input").value;
      if (name || number) {
        strangeDisplay.innerHTML += `<div>${name}: ${number}</div>`;
      }
    });
  }
}

new Sortable(document.getElementById("weapon_attributes_strange_container"), {
  handle: ".handle",
  animation: 150,
  onEnd: function() {
    updateStrangeDisplay();
  }
});

// --- Halloween Icon ---
document.getElementById("weapon_attr_halloween_icon").addEventListener("change", function(event) {
  const isChecked = event.target.checked;
  const halloweenIcon = document.getElementById("halloween_icon");

  setDisplay(halloweenIcon, isChecked ? "inline" : "none");
});

// --- Strange Icon ---
document.getElementById("weapon_attr_strange_icon").addEventListener("change", function(event) {
  const isChecked = event.target.checked;
  const strangeIcon = document.getElementById("strange_icon");

  setDisplay(strangeIcon, isChecked ? "inline" : "none");
});

// --- Pyrovision Icon ---
document.getElementById("weapon_attr_pyroland_icon").addEventListener("change", function(event) {
  const isChecked = event.target.checked;
  const pyrolandIcon = document.getElementById("pyroland_icon");

  setDisplay(pyrolandIcon, isChecked ? "inline" : "none");
});

// --- Festivized ---
document.getElementById("weapon_attr_festivized_checkbox").addEventListener("change", function(event) {
  const isChecked = event.target.checked;
  const festivizedDisplay = document.getElementById("weapon_attr_festivized_display");

  setDisplay(festivizedDisplay, isChecked ? "inline" : "none");
});

// --- Unusual ---
document.getElementById("weapon_attr_unusual_checkbox").addEventListener("change", function(event) {
  const isChecked = event.target.checked;
  const unusualLabel = document.getElementById("unusulaLabel");
  const unusualInput = document.getElementById("weapon_attr_unusual_input");
  const unusualEffectDisplay = document.getElementById("weapon_attr_unusualEffect_display");

  setDisplay(unusualLabel, isChecked ? "inline" : "none");
  setDisplay(unusualInput, isChecked ? "inline" : "none");
  setDisplay(unusualEffectDisplay, isChecked ? "block" : "none");
});

document.getElementById("weapon_attr_unusual_input").addEventListener("input", function(event) {
  setTextContent(document.getElementById("weapon_attr_unusualEffect_display"), `★ Unusual Effect: ${event.target.value}`)
});

// --- Unusual Icon ---
document.getElementById("weapon_attr_unusual_icon").addEventListener("change", function(event) {
  const isChecked = event.target.checked;
  const unusualIcon = document.getElementById("unusual_icon");

  setDisplay(unusualIcon, isChecked ? "inline" : "none");
});

// --- Custom Attributes ---
document.getElementById("addCustomWeaponStatButton").addEventListener("click", function() {
  const container = document.getElementById("weapon_attributes_stat_container");

  function createCustomStat() {
    const customStat = document.createElement("div");
    customStat.className = "custom_stat";
    customStat.innerHTML = `
      <div class="handle" style="cursor: move;"><i class="fa-solid fa-bars"></i></div>
      <input type="text" placeholder="Stat Name" autocomplete="off" class="custom_stat_name_input">
      <select class="custom_stat_select">
        <option value="positive">Positive</option>
        <option value="negative">Negative</option>
        <option value="neutral">Neutral</option>
      </select>
      <button class="removeCustomStatButton"><i class="icon">&#xe922</i></button>
    `;
    return customStat;
  }

  const customStat = createCustomStat();
  container.appendChild(customStat);

  const nameInput = customStat.querySelector(".custom_stat_name_input");
  const typeSelect = customStat.querySelector(".custom_stat_select");
  const removeButton = customStat.querySelector(".removeCustomStatButton");

  nameInput.addEventListener("input", updateCustomStatDisplay);
  typeSelect.addEventListener("change", updateCustomStatDisplay);
  removeButton.addEventListener("click", function() {
    container.removeChild(customStat);
    updateCustomStatDisplay();
  });

  updateCustomStatDisplay();
});

function updateCustomStatDisplay() {
  const customStats = document.querySelectorAll(".custom_stat");
  const customStatDisplay = document.getElementById("weapon_attr_customStat_display");
  customStatDisplay.innerHTML = "";

  if (customStats.length === 0) {
    setDisplay(customStatDisplay, "none")
  } else {
    setDisplay(customStatDisplay, "block")
    customStats.forEach(stat => {
      const name = stat.querySelector(".custom_stat_name_input").value;
      const type = stat.querySelector(".custom_stat_select").value;
      if (name) {
        const statDiv = document.createElement("div");
        setTextContent(statDiv, name)
        statDiv.className = type;
        customStatDisplay.appendChild(statDiv);
      }
    });
  }
}

new Sortable(document.getElementById("weapon_attributes_stat_container"), {
  handle: ".handle",
  animation: 150,
  onEnd: function() {
    updateCustomStatDisplay();
  }
});

// --- Item Set ---
document.getElementById("weapon_attr_itemSetName_checkbox").addEventListener("change", function(event) {
  const isChecked = event.target.checked;
  const itemSetNameInput = document.getElementById("weapon_attr_itemSetName_input");
  const itemSetNameLabel = document.getElementById("itemSetNameLabel");
  const itemSetNameDisplay = document.getElementById("weapon_attr_itemSetName_display");

  setDisplay(itemSetNameInput, isChecked ? "inline" : "none");
  setDisplay(itemSetNameLabel, isChecked ? "block" : "none");
  setDisplay(itemSetNameDisplay, isChecked ? "block" : "none");
});

document.getElementById("weapon_attr_itemSetName_input").addEventListener("input", function(event) {
  setTextContent(document.getElementById("weapon_attr_itemSetName_display"), event.target.value)
});

document.getElementById("itemSetMemberButton").addEventListener("click", function() {
  const container = document.getElementById("weapon_attributes_setMember_container");

  function createItemSetMember() {
    const itemSetMember = document.createElement("div");
    itemSetMember.className = "item_set_member";
    itemSetMember.innerHTML = `
      <div class="handle"><i class="fa-solid fa-bars"></i></div>
      <input type="text" placeholder="Stat Name" autocomplete="off" class="item_set_member_input">
      <label class="custom-checkbox">
        <input type="checkbox" class="weapon_attr_itemSetMember_checkbox" autocomplete="off"/>
        <span class="checkmark"></span> Equipped
      </label>
      <button class="removeItemSetMember"><i class="icon">&#xe922</i></button>
    `;
    return itemSetMember;
  }

  const itemSetMember = createItemSetMember();
  container.appendChild(itemSetMember);

  const nameInput = itemSetMember.querySelector(".item_set_member_input");
  const checkbox = itemSetMember.querySelector(".weapon_attr_itemSetMember_checkbox");
  const removeButton = itemSetMember.querySelector(".removeItemSetMember");

  nameInput.addEventListener("input", updateItemMemberDisplay);
  checkbox.addEventListener("change", updateItemMemberDisplay);
  removeButton.addEventListener("click", function() {
    container.removeChild(itemSetMember);
    updateItemMemberDisplay();
  });
});

function updateItemMemberDisplay() {
  const itemSetMembers = document.querySelectorAll(".item_set_member");
  const itemSetMembersDisplay = document.getElementById("weapon_attr_itemSetMembers_display");
  itemSetMembersDisplay.innerHTML = "";

  if (itemSetMembers.length === 0) {
    setDisplay(itemSetMembersDisplay, "none");
  } else {
    setDisplay(itemSetMembersDisplay, "block");
    itemSetMembers.forEach(stat => {
      const name = stat.querySelector(".item_set_member_input").value;
      const isChecked = stat.querySelector(".weapon_attr_itemSetMember_checkbox").checked;

      if (name) {
        const statDiv = document.createElement("div");
        setTextContent(statDiv, name)
        if (isChecked) {
          statDiv.classList.add("itemSetCompleted");
        } else {
          statDiv.classList.remove("itemSetCompleted");
        }
        itemSetMembersDisplay.appendChild(statDiv);
      }
    });
  }
}

new Sortable(document.getElementById("weapon_attributes_setMember_container"), {
  handle: ".handle",
  animation: 150,
  onEnd: function() {
    updateItemMemberDisplay();
  }
});

document.getElementById("weapon_attr_itemSetBonus_checkbox").addEventListener("change", function(event) {
  const isChecked = event.target.checked;
  const itemSetBonusInput = document.getElementById("weapon_attr_itemSetBonus_input");
  const itemSetBonusLabel = document.getElementById("itemSetBonusLabel");
  const itemSetBonusDisplay = document.getElementById("weapon_attr_itemSetBonus_display");
  const itemSetBonusTextDisplay = document.getElementById("weapon_attr_itemSetBonusText_display");

  setDisplay(itemSetBonusInput, isChecked ? "inline" : "none");
  setDisplay(itemSetBonusLabel, isChecked ? "block" : "none");
  setDisplay(itemSetBonusDisplay, isChecked ? "block" : "none");
  setDisplay(itemSetBonusTextDisplay, isChecked ? "block" : "none");
});

document.getElementById("weapon_attr_itemSetBonus_input").addEventListener("input", function(event) {
  const itemSetBonusDisplay = document.getElementById("weapon_attr_itemSetBonus_display");
  const itemSetBonusTextDisplay = document.getElementById("weapon_attr_itemSetBonusText_display");

  if (event.target.value !== "") {
    setDisplay(itemSetBonusDisplay, "block");
    setTextContent(itemSetBonusDisplay, "Item Set Bonus:")
    setTextContent(itemSetBonusTextDisplay, event.target.value)
  } else {
    setDisplay(itemSetBonusDisplay, "none");
    setDisplay(itemSetBonusTextDisplay, "none");
    setTextContent(itemSetBonusTextDisplay, "")
  }
});

document.getElementById("weapon_attr_itemSetBonusText_checkbox").addEventListener("change", function(event) {
  const isChecked = event.target.checked;
  const itemSetBonusTextDisplay = document.getElementById("weapon_attr_itemSetBonusText_display");

  if (isChecked) {
    itemSetBonusTextDisplay.classList.add("itemSetBonusCompleted");
  } else {
    itemSetBonusTextDisplay.classList.remove("itemSetBonusCompleted");
  }
});

// --- Consumable Item ---
document.getElementById("weapon_attr_limitedUseConsumableItem_checkbox").addEventListener("change", function(event) {
  const isChecked = event.target.checked;
  const limitedUseDisplay = document.getElementById("weapon_attr_limitedUseConsumableItem_display");
  const limitedUseCount = document.getElementById("limitedUseCount");
  const limitedUseInput = document.getElementById("weapon_attr_limitedUseConsumableItem_input");
  const consumable_group = document.getElementById("consumable_group");

  setDisplay(consumable_group, isChecked ? "flex" : "none");
  setDisplay(limitedUseDisplay, isChecked ? "inline" : "none");
  setTextContent(limitedUseCount, isChecked ? limitedUseInput.value : "")
});

document.getElementById("weapon_attr_limitedUseConsumableItem_input").addEventListener("input", function(event) {
  const limitedUseCount = document.getElementById("limitedUseCount");
  const value = event.target.value;
  setTextContent(limitedUseCount, value && value != 0 ? `Uses: ${value}` : "")
});

// --- Gifted Item ---
document.getElementById("weapon_attr_gifted_checkbox").addEventListener("change", function(event) {
  const isChecked = event.target.checked;
  const giftedFromLabel = document.getElementById("giftedFromLabel");
  const giftedFromInput = document.getElementById("weapon_attr_gifted_input");
  const giftedDateGroup = document.getElementById("weapon_attr_giftedDate_group");
  const giftedItemDisplay = document.getElementById("weapon_attr_gifted_display");
  const giftedItemDateDisplay = document.getElementById("weapon_attr_giftedDate_display");

  setDisplay(giftedFromLabel, isChecked ? "inline" : "none");
  setDisplay(giftedFromInput, isChecked ? "inline" : "none");
  setDisplay(giftedItemDisplay, isChecked ? "inline" : "none");
  setDisplay(giftedItemDateDisplay, isChecked ? "inline" : "none");
  setDisplay(giftedDateGroup, isChecked ? "flex" : "none");

  if (isChecked) {
    updateGiftedItemDisplay();
  }
});

document.getElementById("weapon_attr_gifted_input").addEventListener("input", updateGiftedItemDisplay);
document.getElementById("weapon_attr_giftedDate_input").addEventListener("input", updateGiftedItemDisplay);

function updateGiftedItemDisplay() {
  const giftedFromInput = document.getElementById("weapon_attr_gifted_input").value;
  const giftedDateInput = document.getElementById("weapon_attr_giftedDate_input").value;
  const giftedItemDisplay = document.getElementById("weapon_attr_gifted_display");
  const giftedItemDateDisplay = document.getElementById("weapon_attr_giftedDate_display");

  setTextContent(giftedItemDisplay, `Gift from: ${giftedFromInput}`)
  setTextContent(giftedItemDateDisplay, giftedDateInput ? `Date Received: ${giftedDateInput}` : "")
}

// --- Inventory Restrictions And Reason ---
document.getElementById("weapon_attr_restriction_checkbox").addEventListener("change", function(event) {
  const isChecked = event.target.checked;
  const restrictionGroup = document.getElementById("weapon_attr_restriction_group");
  const inventoryRestrictionsDisplay = document.getElementById("weapon_attr_inventoryRestriction_display");

  setDisplay(restrictionGroup, isChecked ? "flex" : "none");
  setDisplay(inventoryRestrictionsDisplay, isChecked ? "inline" : "none");

  if (isChecked) {
    updateInventoryRestrictionsDisplay();
  }
});

document.getElementById("weapon_attr_restriction_input").addEventListener("input", updateInventoryRestrictionsDisplay);

function updateInventoryRestrictionsDisplay() {
  const restrictionsInput = document.getElementById("weapon_attr_restriction_input").value;
  const inventoryRestrictionsDisplay = document.getElementById("weapon_attr_inventoryRestriction_display");

  setTextContent(inventoryRestrictionsDisplay, restrictionsInput ? `(${restrictionsInput})` : "")
}

// --- weapon filters ---
const weaponSelectButton = document.getElementById("weapon_select_button");
const weaponSelectOverlay = document.getElementById("weapon_select_overlay");
const weaponSelectButtonReturn = document.getElementById("weapon_select_button_return");

weaponSelectButton.addEventListener("click", function() {
  setDisplay(weaponSelectOverlay, "flex");
});

weaponSelectButtonReturn.addEventListener("click", function() {
  setDisplay(weaponSelectOverlay, "none");
});

const classSpecificCheckbox = document.getElementById("class_specific_checkbox");
const classOptionsDiv = document.getElementById("class_options");
const teamOptionsDiv = document.getElementById("team_options");
const classCheckboxes = document.querySelectorAll(".class-checkbox");
const viewModeRadios = document.querySelectorAll("input[name='class_icons']");
const teamRadios = document.querySelectorAll("input[name='team_icons']");
const classImagesDiv = document.getElementById("class_images");

let imageSets = {};

fetch("json/icons_class_sets.json")
.then(response => response.json())
.then(data => {
  imageSets = data;
  updateClassImages();
});

function updateClassImages() {
  const selectedViewMode = document.querySelector("input[name='class_icons']:checked").value;
  const selectedTeam = document.querySelector("input[name='team_icons']:checked").value;
  classImagesDiv.innerHTML = "";

  classCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const img = document.createElement("img");
      if (selectedViewMode === "emblems") {
        img.src = `${imageSets[selectedViewMode][checkbox.value]}_${selectedTeam}.png`;
        console.log(`${imageSets[selectedViewMode][checkbox.value]}_${selectedTeam}.png`)
      } else {
        img.src = imageSets[selectedViewMode][checkbox.value];
      }
      classImagesDiv.appendChild(img);
    }
  });
}

function toggleClassOptions() {
  setDisplay(classOptionsDiv, classSpecificCheckbox.checked ? "block" : "none");
  setDisplay(classImagesDiv, classSpecificCheckbox.checked ? "flex" : "none");
  if (classSpecificCheckbox.checked) {
    updateClassImages();
  } else {
    classImagesDiv.innerHTML = "";
  }
}

function toggleTeamOptions() {
  const selectedViewMode = document.querySelector("input[name='class_icons']:checked").value;
  setDisplay(teamOptionsDiv, selectedViewMode === "emblems" ? "flex" : "none");
  updateClassImages();
}

classCheckboxes.forEach(checkbox => {
  checkbox.addEventListener("change", updateClassImages);
});

viewModeRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    toggleTeamOptions();
    updateClassImages();
  });
});

teamRadios.forEach(radio => {
  radio.addEventListener("change", updateClassImages);
});

classSpecificCheckbox.addEventListener("change", toggleClassOptions);

toggleClassOptions();
toggleTeamOptions();
updateClassImages();

/* --- import weapon data --- */
document.addEventListener("DOMContentLoaded", () => {
  const weaponSearch = document.getElementById("weapon-search");
  const weaponClassFilter = document.getElementById("weapon-class-filter");
  const weaponSlotFilter = document.getElementById("weapon-slot-filter");
  const weaponList = document.getElementById("weapon-list");
  const weaponStats = document.getElementById("weapon-stats");
  const weaponAttributes = document.getElementById("weapon-attributes");
  const weaponAttributesContainer = document.getElementById("weapon_attributes_stat_container");
  const itemSetContainer = document.getElementById("weapon_attributes_setMember_container");

  let weapons = [];
  let attributes = [];

  fetch("json/weapons.json")
      .then(response => response.json())
      .then(data => {
          weapons = data.weapons;
          populateFilters(weapons);
          displayWeaponList();
      });

  fetch("json/attribute_list.json")
      .then(response => response.json())
      .then(data => {
          attributes = [...data.attributes, ...data.attributes_hidden, ...data.attributes_unused];
      });

    function populateFilters(weapons) {
      const classes = new Set();
      const slots = new Set();

      weapons.forEach(weapon => {
          weapon.class.forEach(cls => classes.add(cls));
          slots.add(weapon.slot);
      });

      weaponClassFilter.innerHTML = "<option value=''>All Classes</option>";
      classes.forEach(cls => {
          const option = document.createElement("option");
          option.value = cls;
          setTextContent(option, cls.charAt(0).toUpperCase() + cls.slice(1))
          weaponClassFilter.appendChild(option);
      });

      weaponSlotFilter.innerHTML = "<option value=''>All Slots</option>";
      slots.forEach(slot => {
          const option = document.createElement("option");
          option.value = slot;
          setTextContent(option, slot.charAt(0).toUpperCase() + slot.slice(1))
          weaponSlotFilter.appendChild(option);
      });
    }

  // Display the list of weapons based on search and filters
  function displayWeaponList() {
      weaponList.innerHTML = "";
      const searchQuery = weaponSearch.value.toLowerCase();
      const classFilter = weaponClassFilter.value;
      const slotFilter = weaponSlotFilter.value;

      const filteredWeapons = weapons.filter(weapon => {
          const matchesSearch = weapon.name.toLowerCase().includes(searchQuery);
          const matchesClass = classFilter ? weapon.class.includes(classFilter) : true;
          const matchesSlot = slotFilter ? weapon.slot === slotFilter : true;
          return matchesSearch && matchesClass && matchesSlot;
      });

      filteredWeapons.forEach(weapon => {
          const weaponItem = document.createElement("div");
          weaponItem.className = "weapon-item";
          setTextContent(weaponItem, weapon.name)
          weaponItem.addEventListener("click", () => displayWeaponStats(weapon));
          weaponList.appendChild(weaponItem);
      });
  }

  weaponSearch.addEventListener("input", displayWeaponList);
  weaponClassFilter.addEventListener("change", displayWeaponList);
  weaponSlotFilter.addEventListener("change", displayWeaponList);

  // Display weapon stats
  function displayWeaponStats(weapon) {
      setDisplay(document.getElementById("weapon_card_image"), "flex")
      document.getElementById("weapon_card_image").src = weapon.image;

      setInputValue("weapon_attr_name_input", weapon.name);
      setInputValue("weapon_attr_quality_select", "unique");
      setInputValue("weapon_attr_level_input", weapon.level);
      setInputValue("weapon_attr_weaponType_input", weapon.type);

      toggleCheckbox("weapon_attr_itemSetName_checkbox", weapon.item_set_name, "weapon_attr_itemSetName_input");
      toggleCheckbox("weapon_attr_itemSetBonus_checkbox", weapon.item_set_bonus, "weapon_attr_itemSetBonus_input");

      limitedCheckbox.checked = weapon.limited;
      limitedCheckbox.dispatchEvent(new Event("change"));

      if (weapon.description && !weapon.weapon_stats.some(stat => stat.id === null && stat.value === weapon.description)) {
        weapon.weapon_stats.push({ id: null, value: weapon.description });
      }

      displayWeaponAttributes(weapon.weapon_stats);
      displayItemSetMembers(weapon.item_set_members);
      updateLevelTypeDisplay();
    }

    function displayWeaponAttributes(weaponStats) {
      weaponAttributesContainer.innerHTML = "";

      weaponStats.forEach(stat => {
        if (stat.id === null) {
          const attributeElement = createCustomStatElement(stat.value, "neutral");
          weaponAttributesContainer.appendChild(attributeElement);
        } else {
          const attribute = attributes.find(attr => attr.id === stat.id);
          if (attribute) {
            const descriptionParts = (stat.value !== null
              ? attribute.description.replace("%s1", stat.value)
              : attribute.description).split("\n");

            descriptionParts.forEach(part => {
              const attributeElement = createCustomStatElement(part.trim(), attribute.status);
              weaponAttributesContainer.appendChild(attributeElement);
            });
          }
        }
      });
      updateCustomStatDisplay();
    }

    function createCustomStatElement(value, status) {
      const attributeElement = document.createElement("div");
      attributeElement.className = "custom_stat";
      attributeElement.innerHTML = `
        <div class="handle" style="cursor: move;"><i class="fa-solid fa-bars"></i></div>
        <input type="text" value="${value}" autocomplete="off" class="custom_stat_name_input">
        <select class="custom_stat_select">
          <option value="positive" ${status === "positive" ? "selected" : ""}>Positive</option>
          <option value="negative" ${status === "negative" ? "selected" : ""}>Negative</option>
          <option value="neutral" ${status === "neutral" ? "selected" : ""}>Neutral</option>
        </select>
        <button class="removeCustomStatButton"><i class="icon">&#xe922</i></button>
      `;
      attributeElement.querySelector(".custom_stat_name_input").addEventListener("input", updateCustomStatDisplay);
      attributeElement.querySelector(".custom_stat_select").addEventListener("change", updateCustomStatDisplay);
      attributeElement.querySelector(".removeCustomStatButton").addEventListener("click", function () {
        weaponAttributesContainer.removeChild(attributeElement);
        updateCustomStatDisplay();
      });
      return attributeElement;
    }

    function displayItemSetMembers(itemSetMembers) {
      itemSetContainer.innerHTML = "";

      itemSetMembers.forEach(member => {
          const itemSetMember = document.createElement("div");
          itemSetMember.className = "item_set_member";
          itemSetMember.innerHTML = `
              <div class="handle"><i class="fa-solid fa-bars"></i></div>
              <input type="text" value="${member}" autocomplete="off" class="item_set_member_input">
              <label class="custom-checkbox">
                  <input type="checkbox" class="weapon_attr_itemSetMember_checkbox" autocomplete="off">
                  <span class="checkmark"></span> Equipped
              </label>
              <button class="removeItemSetMember"><i class="icon">&#xe922</i></button>
          `;
          itemSetContainer.appendChild(itemSetMember);
          itemSetMember.querySelector(".item_set_member_input").addEventListener("input", updateItemMemberDisplay);
          itemSetMember.querySelector(".weapon_attr_itemSetMember_checkbox").addEventListener("change", updateItemMemberDisplay);
          itemSetMember.querySelector(".removeItemSetMember").addEventListener("click", function() {
              itemSetContainer.removeChild(itemSetMember);
              updateItemMemberDisplay();
          });
      });
      updateItemMemberDisplay();
    }
});
