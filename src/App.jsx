import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Details from './pages/Details';

function App() {
  return (
    <Router>
      <div className="pokedex-container">
        {/* Luzes clássicas no topo da Pokédex */}
        <div className="pokedex-header-lights">
          <div className="big-blue-light"></div>
          <div className="small-lights">
            <span className="light red"></span>
            <span className="light yellow"></span>
            <span className="light green"></span>
          </div>
        </div>

        {/* Ecrã central */}
        <div className="pokedex-screen">
          <div className="screen-inner">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/item/:id" element={<Details />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;