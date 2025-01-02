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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Obtener la lista completa de Pokémon solo una vez al cargar el componente
  useEffect(() => {
    const fetchAllPokemons = async () => {
      setIsLoading(true);
      try {
        const response = await getPokemons(1025); // Obtener hasta 1000 Pokémon
        const pokemonData = response.results;

        // Obtener la imagen de cada Pokémon
        const pokemonWithImages = await Promise.all(
          pokemonData.map(async (pokemon: { name: string; url: string }) => {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPokemons();
  }, []);

  // Filtrar las sugerencias según el texto del input
  useEffect(() => {
    if (inputValue.length >= 2) {
      const filteredSuggestions = allPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(inputValue.toLowerCase())
      );

      // Mostrar sugerencias solo si el input no coincide con ninguna sugerencia
      if (!filteredSuggestions.some(suggestion => suggestion.name === inputValue.toLowerCase())) {
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);  // Si el input coincide con el nombre de un Pokémon, ocultar sugerencias
      }
    } else {
      setSuggestions([]); // Ocultar sugerencias si el input está vacío o tiene menos de 2 caracteres
    }
  }, [inputValue, allPokemons]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputValue.trim() !== "") {
      onSubmit(inputValue);
      setSuggestions([]); // Limpiar las sugerencias después de enviar
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSuggestionClick = (name: string) => {
    setSuggestions([]); // Limpiar las sugerencias
    setInputValue(name);
    onSubmit(name); // Actualizar los detalles del Pokémon
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

      {isLoading && <p>Cargando sugerencias...</p>}

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
