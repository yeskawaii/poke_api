import React, { useState, useEffect } from "react";
import { getPokemons, getPokemonDetails } from "../api/pokeApi"; // Importar las funciones de la API

interface PokemonInputProps {
  onSubmit: (pokemonName: string) => void;
}

interface PokemonSuggestion {
  name: string;
  image: string;
}

const PokemonInput: React.FC<PokemonInputProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<PokemonSuggestion[]>([]);
  const [allPokemons, setAllPokemons] = useState<PokemonSuggestion[]>([]);

  // gel all pokemon to charge the component
  useEffect(() => {
    const fetchAllPokemons = async () => {
      try {
        const response = await getPokemons(1025); // get 1025 pokemons
        const pokemonData = response;

        //get image from pokemon
        const pokemonWithImages = await Promise.all(
          pokemonData.map(async (pokemon: { name: string; image: string }) => {
            const pokemonDetails = await getPokemonDetails(pokemon.name);
            return {
              name: pokemon.name,
              image: pokemonDetails.sprites.front_default,
            };
          })
        );

        setAllPokemons(pokemonWithImages);
      } catch (error) {
        console.error("Error al obtener la lista de Pokémon:", error);
      } 
    };

    fetchAllPokemons();
  }, []);

  // filter for the input
  useEffect(() => {
    if (inputValue.length >= 2) {
      const filteredSuggestions = allPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(inputValue.toLowerCase())
      );

      // show the suggestions
      if (!filteredSuggestions.some(suggestion => suggestion.name === inputValue.toLowerCase())) {
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]); // show this if at least 2 letters or not a white space
    }
  }, [inputValue, allPokemons]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputValue.trim() !== "") {
      onSubmit(inputValue);
      setSuggestions([]); 
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSuggestionClick = (name: string) => {
    setSuggestions([]); // clean the suggestion
    setInputValue(name);
    onSubmit(name); // Update pokemon
  };

  return (
    <div className="pokemon-input-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Busca un Pokémon..."
          className="pokemon-input"
        />
        <button type="submit" className="pokemon-input-btn">
          Buscar
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.name}
              onClick={() => handleSuggestionClick(suggestion.name)}
              className="suggestion-item"
            >
              <img
                src={suggestion.image}
                alt={suggestion.name}
                className="suggestion-icon"
              />
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PokemonInput;
