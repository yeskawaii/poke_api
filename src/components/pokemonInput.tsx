import React, { useState } from "react";

interface PokemonInputProps {
  onSubmit: (pokemonName: string) => void;
}

const PokemonInput: React.FC<PokemonInputProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputValue.trim() !== "") {
      onSubmit(inputValue);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Ingresa el nombre de un Pokémon"
      />
      <button type="submit">Buscar</button>
    </form>
  );
};

export default PokemonInput;
