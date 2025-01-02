import React, { useState, useEffect } from "react";
import axios from "axios";

interface PokemonInputProps {
  onSubmit: (pokemonName: string) => void;
}

interface PokemonSuggestion {
  name: string;
  url: string;
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
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1025"); // Obtén hasta 1025 Pokémon
        setAllPokemons(response.data.results);
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
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
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
    setInputValue(name);
    onSubmit(name); // Actualizar los detalles del Pokémon
    setSuggestions([]); // Limpiar las sugerencias
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Ingresa el nombre de un Pokémon"
        />
        <button type="submit">Buscar</button>
      </form>
      {isLoading && <p>Cargando sugerencias...</p>}
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.name}
              onClick={() => handleSuggestionClick(suggestion.name)}
              style={{
                cursor: "pointer",
                padding: "5px",
                borderBottom: "1px solid #ccc",
              }}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PokemonInput;
