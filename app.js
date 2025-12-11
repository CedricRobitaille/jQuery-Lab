const apiUrl = "https://pokeapi.co/api/v2/pokemon"
let page = 0;


// Placeholder card to order fetched pokemon data
const generatePlaceholders = (id) => {
  const placeholderCard = `<li class="pokedex-card" id="${id}"></li`
  $("#pokedex-collection").append(placeholderCard)
}


// Using fetched data, inserting data into placeholder pokedex card
const constructPokemonCard = (pokemon) => {
  const pokedexCard = `
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name} sprite" class="pokedex-sprite">
          <p class="text-small">N°${pokemon.id}</p>
          <h3>${pokemon.name}</h3>
          <div class="type-container">
          </div>
        `;
  $(`#${pokemon.id}`).html(pokedexCard)
  pokemon.types.forEach(type => {
    const name = type.type.name
    const typeElem = `<p class="${name}">${name}</p>`;
    $(`#${pokemon.id} .type-container`).append(typeElem)
  })
}

// Generate 20 pokedex cards for pokedex page
const generateManyPokedexEntries = (data) => {
  // Generate placeholders
  data.results.forEach(pokemon => {
    const id = pokemon.url.replace("https://pokeapi.co/api/v2/pokemon/", "").replace("/", "")
    generatePlaceholders(id)
  })

  // Populate placeholders
  data.results.forEach(async (rootPokemon) => {
    $.get(`${rootPokemon.url}`, function (pokemon, status) {
      constructPokemonCard(pokemon)
    })
  })
}


// Fetches several pokedex entries
const fetchManyPokemon = () => {
  $.get(`${apiUrl}?offset=${page}`, function (data, status) {
    generateManyPokedexEntries(data)
  })
}



const queryPokemon = (searchInput) => {
  $.get(`${apiUrl}/${searchInput}`, function(data, status) {
    $("#pokedex-collection").empty()
    page = 0;

    if ("results" in data) { // 'pokemon/' queried
      generateManyPokedexEntries(data)
    } else {  // 'pokemon/valid-entry' queried
      generatePlaceholders(data.id)
      constructPokemonCard(data)
    }
  })
}





$(function() {

  $("#pokedex-collection").on("load", fetchManyPokemon())
  $("#search-button").click(function () {
    queryPokemon($("#search-input").val())
  })
})