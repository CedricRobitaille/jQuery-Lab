let page = 0;

const fetchPokedex = () => {
  $.get(`https://pokeapi.co/api/v2/pokemon?offset=${page}`, function (data, status) {
    for (rootPokemon of data.results) {

      $.get(`${rootPokemon.url}`, function (pokemon, status) {
        console.log(pokemon)
        const pokedexCard = `
          <li class="pokedex-card" id="${pokemon.id}">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name} sprite" class="pokedex-sprite">
            <p class="text-small">N°${pokemon.id}</p>
            <h3>${pokemon.name}</h3>
            <div class="type-container">
            </div>
          </li>
        `;
        $("#pokedex-collection").append(pokedexCard)
        pokemon.types.forEach(type => {
          const name = type.type.name
          const typeElem = `<p class="${name}">${name}</p>`;
          $(`#${pokemon.id} .type-container`).append(typeElem)
        }) 
      })
    }
  })
}










$(function() {

  $("#pokedex-collection").on("load", fetchPokedex())
  

})