import PokemonDetailsPage from "./pages/PokemonDetails";
import './styles/App.css'

const App: React.FC = () => {
  return (
    <div>
      <h1>Pokédex</h1>
      <PokemonDetailsPage pokemonName="pikachu" />
    </div>
  );
};

export default App
