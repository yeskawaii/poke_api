import React, { useEffect, useState } from "react";
import { getPokemonDetails, PokemonDetails } from "../api/pokeApi";

const PokemonDetailsPage: React.FC<{ pokemonName: string }> = ({ pokemonName }) => {
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const data = await getPokemonDetails(pokemonName);
        setPokemon(data);
      } catch (err) {
        setError("No se pudo obtener los detalles del Pokémon.");
        console.error(err);
      }
    };

    fetchPokemon();
  }, [pokemonName]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!pokemon) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>{pokemon.name}</h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <p>Altura: {pokemon.height}</p>
      <p>Peso: {pokemon.weight}</p>
    </div>
  );
};

export default PokemonDetailsPage;
