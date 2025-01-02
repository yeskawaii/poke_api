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

export const getPokemons = async (limit = 20, offset = 0) => {
  const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const getPokemonDetails = async (name: string): Promise<PokemonDetails> => {
  const response = await axios.get<PokemonDetails>(`${BASE_URL}/pokemon/${name}`);
  return response.data;
};
