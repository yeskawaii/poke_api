import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { getPokemonDetails, PokemonDetails } from "../api/pokeApi";
import PokemonInput from "../components/pokemonInput";

const PokemonDetailsPage: React.FC = () => {
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pokemonName, setPokemonName] = useState<string>("pikachu");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPokemonDetails = async (name: string) => {
    try {
      setIsLoading(true);
      const data = await getPokemonDetails(name);
      setPokemon(data);
      setError(null);
    } catch (error) {
      setError("No se pudo obtener los detalles del Pokémon.");
      setPokemon(null);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonDetails(pokemonName); 
  }, [pokemonName]); 

  return (
    <div className="pokedex">
  <div className="pokedex-header">
    <h1>Pokédex</h1>
  </div>
  <div className="pokedex-screen">
  <PokemonInput onSubmit={setPokemonName} />
    {isLoading ? (
      <div className="loading-screen">
        <ClipLoader size={50} color="#3498db" loading={isLoading} />
      </div>
    ) : pokemon ? (
      <div className="pokemon-details">
        <h2 className="pokemon-name">{pokemon.name}</h2>
        <div className="sprites sprites-section">
          <div className="male-sprites">
          <h3>Macho</h3>
            <div>
            <img src={pokemon.sprites.front_default} alt={`${pokemon.name} front`} />
            {pokemon.sprites.back_default && <img src={pokemon.sprites.back_default} alt={`${pokemon.name} back`} />}
            {pokemon.sprites.front_shiny && <img src={pokemon.sprites.front_shiny} alt={`${pokemon.name} front shiny`} />}
            {pokemon.sprites.back_shiny && <img src={pokemon.sprites.back_shiny} alt={`${pokemon.name} back shiny`} />}
            </div>
          </div>
          {pokemon.sprites.front_female || pokemon.sprites.front_shiny_female ? (
            <div className="female-sprites">
              <h3>Hembra</h3>
              <div>
              {pokemon.sprites.front_female && <img src={pokemon.sprites.front_female} alt={`${pokemon.name} front female`} />}
              {pokemon.sprites.back_female && <img src={pokemon.sprites.back_female} alt={`${pokemon.name} back female`} />}
              {pokemon.sprites.front_shiny_female && (
                <img src={pokemon.sprites.front_shiny_female} alt={`${pokemon.name} front shiny female`} />
              )}
              {pokemon.sprites.back_shiny_female && (
                <img src={pokemon.sprites.back_shiny_female} alt={`${pokemon.name} back shiny female`} />
              )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    ) : (
      <div className="error-message">{error || "No se pudo encontrar el Pokémon."}</div>
    )}
  </div>
</div>

  );
};

export default PokemonDetailsPage;
