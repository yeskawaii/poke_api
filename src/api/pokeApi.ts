import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

export interface PokemonDetails {
  name: string;
  sprites: {
    front_default: string;
    front_female: string;
    front_shiny: string;
    front_shiny_female: string;
    back_default: string;
    back_female: string;
    back_shiny: string;
    back_shiny_female: string;
  };
}

export interface PokemonSuggestion {
  name: string;
  image: string;
}

// fuinction to get all pokemons
export const getPokemons = async (limit = 20, offset = 0): Promise<PokemonSuggestion[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    return response.data.results;
  } catch (error) {
    console.error("Error al obtener los Pokémon:", error);
    throw new Error("No se pudieron obtener los Pokémon.");
  }
};


// fucntion to get specific pokemon
export const getPokemonDetails = async (name: string): Promise<PokemonDetails> => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon/${name}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener detalles del Pokémon:", error);
    throw new Error("No se pudo obtener los detalles del Pokémon.");
  }
};