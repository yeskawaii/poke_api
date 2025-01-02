import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners"; // Importamos el spinner
import { getPokemonDetails, PokemonDetails } from "../api/pokeApi";
import PokemonInput from "../components/pokemonInput";

const PokemonDetailsPage: React.FC = () => {
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pokemonName, setPokemonName] = useState<string>("pikachu");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPokemonDetails = async (name: string) => {
    try {
      setIsLoading(true); // Inicia el loading
      const data = await getPokemonDetails(name);
      setPokemon(data);
      setError(null);
    } catch (error) {
      setError("No se pudo obtener los detalles del Pokémon.");
      setPokemon(null);
      console.error(error);
    } finally {
      setIsLoading(false); // Finaliza el loading
    }
  };

  useEffect(() => {
    fetchPokemonDetails(pokemonName); // Carga el Pokémon por defecto (pikachu)
  }, [pokemonName]); // Solo se ejecuta una vez al cargar

  return (
    <div>
      <h1>Pokédex</h1>
      <PokemonInput onSubmit={setPokemonName} />

      {error && <div style={{ color: "red" }}>{error}</div>}

      {isLoading ? (
        // Mostrar el spinner cuando isLoading es true
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <ClipLoader size={50} color="#3498db" loading={isLoading} />
        </div>
      ) : pokemon ? (
        <div>
          <h2>{pokemon.name}</h2>
          <div className="sprites">
            {/* Sección de imágenes de Pokémon Macho */}
            <div>
              <h3>Macho</h3>
              <img src={pokemon.sprites.front_default} alt={`${pokemon.name} front`} />
              <img src={pokemon.sprites.back_default} alt={`${pokemon.name} back`} />
              {pokemon.sprites.front_shiny && (
                <img src={pokemon.sprites.front_shiny} alt={`${pokemon.name} front shiny`} />
              )}
              {pokemon.sprites.back_shiny && (
                <img src={pokemon.sprites.back_shiny} alt={`${pokemon.name} back shiny`} />
              )}
            </div>

            {/* Sección de imágenes de Pokémon Hembra */}
            {pokemon.sprites.front_female || pokemon.sprites.front_shiny_female ? (
              <div className="female-images">
                <h3>Hembra</h3>
                {pokemon.sprites.front_female && (
                  <img src={pokemon.sprites.front_female} alt={`${pokemon.name} front female`} />
                )}
                {pokemon.sprites.back_female && (
                  <img src={pokemon.sprites.back_female} alt={`${pokemon.name} back female`} />
                )}
                {pokemon.sprites.front_shiny_female && (
                  <img src={pokemon.sprites.front_shiny_female} alt={`${pokemon.name} front shiny female`} />
                )}
                {pokemon.sprites.back_shiny_female && (
                  <img src={pokemon.sprites.back_shiny_female} alt={`${pokemon.name} back shiny female`} />
                )}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div>No se pudo encontrar el Pokémon.</div>
      )}
    </div>
  );
};

export default PokemonDetailsPage;
