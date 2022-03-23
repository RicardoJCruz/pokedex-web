// Getting the tags from the HTML
const pokedex = document.getElementById("pokedex");
const pokeName = document.getElementById("pokeName");
const pokeId = document.getElementById("pokeId");
const pokeImgContainer = document.getElementById("pokeImgContainer");
const pokeImg = document.getElementById("pokeImg");
const pokeTypes = document.getElementById("pokeTypes");
const pokeStats = document.getElementById("pokeStats");
const pokeMoves = document.getElementById("pokeMoves");
const pokeDescription = document.getElementById("pokeDescription");

const typeColors = {
  electric: "#71672D",
  normal: "#685659",
  fire: "#AE443C",
  water: "#036E93",
  ice: "#4E6B74",
  rock: "#676667",
  flying: "#387060",
  grass: "#367160",
  psychic: "#7C5E68",
  ghost: "#561D25",
  bug: "#467047",
  poison: "#795663",
  ground: "#786340",
  dragon: "#A4485D",
  steel: "#16717D",
  fighting: "#2F2F2F",
  default: "#2A1A1F",
};

const statsNames = {
  hp: "PS",
  attack: "ATQ",
  defense: "DEF",
  "special-attack": "ATQ-ESP",
  "special-defense": "DEF-ESP",
  speed: "VEL",
};

function toggleH3s (toggle) {
  const headers = document.querySelectorAll("h3");
  headers.forEach(header => {
      header.hidden = toggle;
  });
}

toggleH3s (true);

// Function that gets the data of the pokemon
const searchPokemon = (event) => {
  event.preventDefault();
  // Saving the name for a pokemon in a variable
  const { value } = event.target.name;
  // Fetching the url with the given pokemon
  fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
    .then((res) => res.json())
    .then((data) => renderPokemonData(data))
   .catch((err) => renderError());
};

const renderPokemonData = (data) => {
  console.log(data);
  const { stats, types, moves } = data;

  // render pokemon name
  pokeName.textContent = data.name;
  // render pokemon id
  const idFormat = data.id.toLocaleString("en-US", {
    minimumIntegerDigits: 3,
    useGrouping: false,
  });
  pokeId.textContent = `No. ${idFormat}`;
  // render pokemon image
  pokeImg.src = data.sprites.other["official-artwork"].front_default;

  const primaryColor = data.types[0].type.name;

  renderPokemonTypes(types);
  renderPokemonStats(stats, primaryColor);
  renderPokemonMoves(moves, primaryColor);
  renderPokeDescription(data.id);
};

function renderPokeDescription(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
    .then((res) => res.json())
    .then((data) => {
      pokeDescription.innerHTML = "";
      for (let i = 0; i < Object.keys(data.flavor_text_entries).length; i++) {
        if (data.flavor_text_entries[i].language.name == "es") {
          pokeDescription.textContent = data.flavor_text_entries[i].flavor_text;
          break;
        }
      }
    });
}

function renderPokemonTypes(types) {
  pokeTypes.innerHTML = "";
  types.forEach((type) => {
    const typeTextElement = document.createElement("div");
    typeTextElement.style.color = typeColors[type.type.name];
    typeTextElement.style.border = `2px solid ${typeColors[type.type.name]}`;
    typeTextElement.textContent = type.type.name;
    pokeTypes.appendChild(typeTextElement);
  });
}

function renderPokemonStats(stats, primaryColor) {
  // Vaciar Stats
  pokeStats.innerHTML = "";
  // Agregar encabezado
  toggleH3s (false);
  // Agregar Stats
  stats.forEach((stat) => {
    const statElement = document.createElement("div");
    const statElementName = document.createElement("div");
    const statElementAmount = document.createElement("div");
    const statElementBarContainer = document.createElement("div");
    const statElementBar = document.createElement("div");
    statElement.classList.add("stat-element")
    statElementName.classList.add("stat-name");
    statElementAmount.classList.add("stat-amount");
    // Cambiar nombres de stats
    if (stat.stat.name in statsNames) {
      statElementName.textContent = statsNames[stat.stat.name];
    }
    statElementAmount.textContent = stat.base_stat;
    // Agregar barras
    statElementBarContainer.classList.add("stat-bar-container");
    statElementBar.classList.add("stat-bar");
    statElementBar.style.background = typeColors[primaryColor];
    statElementBar.style.width = stat.base_stat + "%";
    // Agregar a padre
    statElementBarContainer.appendChild(statElementBar);
    statElement.appendChild(statElementName);
    statElement.appendChild(statElementAmount);
    statElement.appendChild(statElementBarContainer);
    pokeStats.appendChild(statElement);
  });
}

function renderPokemonMoves(moves, primaryColor) {
  // Vaciar Moves
  pokeMoves.innerHTML = "";
  // Agregar encabezado
  document.querySelectorAll("h3").forEach(header => {
    header.hidden = false;
  });
  // Agregar Moves
  moves.forEach((move) => {
    const moveElement = document.createElement("div");
    moveElement.classList.add("movement");
    moveElement.style.background = typeColors[primaryColor];
    moveElement.textContent = move.move.name.replaceAll('-', ' ');
    pokeMoves.appendChild(moveElement);
  });
}

function renderError() {
  // pokeImg.src = "img/sad-pokemon.gif";
  pokeName.textContent = "No encontrado";
  pokeImg.setAttribute("src", "img/sad-pokemon.gif");
  pokeDescription.innerHTML = "";
  pokeTypes.innerHTML = "";
  pokeStats.innerHTML = "";
  pokeId.textContent = "";
  pokeMoves.innerHTML = "";
  toggleH3s (true);
}
