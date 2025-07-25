// Gather HTML input elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");

// Gather HTML output elements
const creatureName = document.getElementById("creature-name");
const creatureID = document.getElementById("creature-id");
const creatureSpecial = document.getElementById("creature-special");
const creatureSpecialDesc = document.getElementById(
  "creature-special-description"
);
const creatureWeight = document.getElementById("weight");
const creatureHeight = document.getElementById("height");
const creatureTypes = document.getElementById("types");
const creatureHP = document.getElementById("hp");
const creatureAttack = document.getElementById("attack");
const creatureDefense = document.getElementById("defense");
const creatureSpecialAttack = document.getElementById("special-attack");
const creatureSpecialDefense = document.getElementById("special-defense");
const creatureSpeed = document.getElementById("speed");

// Fetch the creature data from the freeCodeCamp RPG Creature Search API
const fetchCreature = async (query) => {
  try {
    const url = `https://rpg-creature-api.freecodecamp.rocks/api/creature/${query}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Creature not found");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    alert(error.message);
    return null;
  }
};

// Display the creature stats
function displayCreatureInfo(data) {
  // Clear previous types
  creatureTypes.innerHTML = "";

  // Update name, id, height, weight
  creatureName.textContent = data.name.toUpperCase();
  creatureID.textContent = `#${data.id}`;
  creatureWeight.textContent = data.weight;
  creatureHeight.textContent = data.height;

  // Special ability
  creatureSpecial.textContent = `Special: ${data.special.name}`;
  creatureSpecialDesc.textContent = data.special.description;

  // Update types
  data.types.forEach((typeObj) => {
    const span = document.createElement("span");
    span.textContent = typeObj.name.toUpperCase();
    creatureTypes.appendChild(span);
  });

  // Reset all stat elements just in case
  creatureHP.textContent = "";
  creatureAttack.textContent = "";
  creatureDefense.textContent = "";
  creatureSpecialAttack.textContent = "";
  creatureSpecialDefense.textContent = "";
  creatureSpeed.textContent = "";

  // Update stats
  data.stats.forEach((statObj) => {
    const statName = statObj.name;
    const statValue = statObj.base_stat;

    switch (statName) {
      case "hp":
        creatureHP.textContent = statValue;
        break;
      case "attack":
        creatureAttack.textContent = statValue;
        break;
      case "defense":
        creatureDefense.textContent = statValue;
        break;
      case "special-attack":
        creatureSpecialAttack.textContent = statValue;
        break;
      case "special-defense":
        creatureSpecialDefense.textContent = statValue;
        break;
      case "speed":
        creatureSpeed.textContent = statValue;
        break;
    }
  });
}

searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  const creatureData = await fetchCreature(query);
  if (creatureData) {
    displayCreatureInfo(creatureData);
  }
});
