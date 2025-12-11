const apiUrl = "https://pokeapi.co/api/v2/pokemon"
let page = 0;
let loadPause = false;


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
    page++;
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


// Search for pokemon
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



// Generate modal on card click
const generateModal = (pokemonId) => {

  if ($("#pokemon-information").length) {
    $("#pokemon-information").empty()
  } else {
    const modal = `<section id="pokemon-information"></section>`
    $("main").append(modal)
  }
  $.get(`${apiUrl}/${pokemonId}`, function(pokemon, status) {
    $.get(`${pokemon.species.url}`, function(species, status) {
      console.log(pokemon)
      console.log(species)

      const modalStructure = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name} sprite" class="modal-sprite">

      <article>
        <div id="poke-info">
          <p class="poke-number">N°${pokemon.id}</p>
          <h1 class="pokemon-name">${pokemon.name}</h1>
          <p class="description">${species.flavor_text_entries[0].flavor_text}</p>
        </div>

        <hr>

        <div id="stats">
          <h2>Stats</h2>
          <div class="stats-container">
          </div>
          <div class="type-container">
          </div>
          <div class="ability-container">
          </div>
        </div>

        <hr>

        <div id="evolutions">
          <h2>Evolutions</h2>
          <div class="evolution-container">
          </div>
        </div>

        <button id="add-to-team">Add to Team</button>

      </article>
      `
      $("#pokemon-information").html(modalStructure)

      // Stats
      pokemon.stats.forEach((stat, index) => {
        const statElem = `
          <div class="stat" id="${stat.stat.name}">
            <p class="stat-name">${stat.stat.name.replace("-", " ")}</p>
            <p class="stat-value">${stat.base_stat}</p>
            <div class="stat-graph-container">
              <div class="stat-graph-active"></div>
              <div class="stat-graph-inactive"></div>
            </div>
          </div>
        `
        $(".stats-container").append(statElem)
        // Set the bargraph widths based on the base_stat value as a percentage of 150pts
        const statPercentage = (stat.base_stat / 150) * 100
        $(`#${stat.stat.name} .stat-graph-active`).css("width", `${statPercentage}`)
        $(`#${stat.stat.name} .stat-graph-inactive`).css("width", `${100 - statPercentage}`)
      })
      
      // Types
      pokemon.types.forEach((type, index) => {
        const typeElem = `<p class="${type.type.name}">${type.type.name}</p>`
        $("#pokemon-information .type-container").append(typeElem)
      })

      // Abiltiies
      pokemon.abilities.forEach((ability, index) => {
        const abilityElem = `<p class="ability">${ability.ability.name}</p>`
        $("#pokemon-information .ability-container").append(abilityElem)
      })

      // Evolution Tree
      $.get(`${species.evolution_chain.url}`, function(chain, status) {
        const chainUrls = []

        const getNextChain = (currPoke) => {
          chainUrls.push(currPoke.species.name)
          if (currPoke.evolves_to.length > 0) {
            getNextChain(currPoke.evolves_to[0])
          }
        }
        getNextChain(chain.chain)

        // Placeholder Img
        chainUrls.forEach((url, index) => {
          const imgElem = `<img src="" alt="" class="evolution evo-${index}">`
          $(".evolution-container").append(imgElem)
        })
        
        // Ordered placement
        chainUrls.forEach(async(url, index) => {
          $.get(`${apiUrl}/${url}`, function(pokemon, status) {
            console.log(pokemon)
            $(`.evo-${index}`).attr("src", `${pokemon.sprites.front_default}`)
            $(`.evo-${index}`).attr("alt", `${pokemon.name}`)
          })
        })
        
      })
      

      
    })
  })
}



$(function() {

  // Init Load
  $("#pokedex-collection").on("load", fetchManyPokemon())

  // Search Submit
  $(".search").submit(function(event) {
    event.preventDefault()
    queryPokemon($("#search-input").val())
  })

  // Infinite Scroll
  $(document).scroll(function() {
    const scrollRemaining = $(document).height() - ($(window).scrollTop() + $(window).height());
    if (scrollRemaining < 100 && !loadPause) {
      loadPause = !loadPause
      fetchManyPokemon()
      setTimeout(() => {
        loadPause = !loadPause;
      }, 1000);
    }
  })
})

$(document).on("click", ".pokedex-card", function() {
  const pokeId = $(this).attr("id")
  generateModal(pokeId)
})

$(document).on("click", "#add-to-team", function() {
  console.log("Add to team clicked")
})