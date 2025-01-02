import React, { useEffect, useState } from "react";
import { getPokemonDetails, PokemonDetails } from "../api/pokeApi";
import PokemonInput from "../components/pokemonInput";

const PokemonDetailsPage: React.FC = () => {
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pokemonName, setPokemonName] = useState<string>("pikachu"); // Pokémon por defecto

  const fetchPokemon = async (name: string) => {
    try {
      const data = await getPokemonDetails(name);
      setPokemon(data);
      setError(null); // Reseteamos el error en caso de que hubiera uno
    } catch (err) {
      setError("No se pudo obtener los detalles del Pokémon.");
      setPokemon(null);
      console.error(err);
    }
  };

  // Cargar Pokémon al cambiar el nombre
  useEffect(() => {
    fetchPokemon(pokemonName);
  }, [pokemonName]);

  return (
    <div>
      <h1>Pokédex</h1>
      <PokemonInput onSubmit={setPokemonName} />
      
      {error && <div style={{ color: "red" }}>{error}</div>}
      {pokemon ? (
        <div>
          <h2>{pokemon.name}</h2>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p>Altura: {pokemon.height}</p>
          <p>Peso: {pokemon.weight}</p>
        </div>
      ) : (
        <div>Cargando...</div>
      )}
    </div>
  );
};

export default PokemonDetailsPage;
