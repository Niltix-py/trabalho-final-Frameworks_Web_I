import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Home() {
  const [items, setItems] = useState([]); // Itens da página atual
  const [allItems, setAllItems] = useState([]); // Todos os Pokémons para busca global
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const limit = 20;

  // 1. Carrega TODOS os Pokémons uma única vez para a pesquisa global
  useEffect(() => {
    async function loadAllPokemons() {
      try {
        const response = await api.get('pokemon?limit=1025');
        setAllItems(response.data.results);
      } catch (err) {
        console.error('Erro ao carregar lista completa para busca:', err);
      }
    }
    loadAllPokemons();
  }, []);

  // 2. Carrega a lista paginada quando a página muda (usado se não houver busca)
  useEffect(() => {
    async function loadPagedData() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`pokemon?limit=${limit}&offset=${page * limit}`);
        setItems(response.data.results);
      } catch (err) {
        setError('Falha ao carregar os dados da API.');
      } finally {
        setLoading(false);
      }
    }

    // Só carrega a paginação se a barra de pesquisa estiver vazia
    if (search.trim() === '') {
      loadPagedData();
    } else {
      setLoading(false);
    }
  }, [page, search]);

  // Se houver texto na pesquisa, pesquisa em ALLITEMS. Se não, mostra os ITEMS da página.
  const isSearching = search.trim().length > 0;
  
  const displayedItems = isSearching
    ? allItems.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 40) // Limita a 40 resultados na pesquisa para não travar a ecrã
    : items;

  return (
    <div>
      <h1>POKÉDEX V1.0</h1>

      <input
        type="text"
        className="search-input"
        placeholder="> BUSCAR POKÉMON (GLOBAL)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p style={{ textAlign: 'center' }}>Carregando dados...</p>}
      {error && <p style={{ color: '#ff4d4d', textAlign: 'center' }}>{error}</p>}

      {!loading && !error && (
        <>
          <ul className="pokemon-grid">
            {displayedItems.map((item) => {
              const id = item.url.split('/').filter(Boolean).pop();
              return (
                <li key={id} className="pokemon-card">
                  <Link to={`/item/${id}`} className="pokemon-link">
                    #{id.padStart(3, '0')}
                    <br />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {displayedItems.length === 0 && (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              Nenhum Pokémon encontrado.
            </p>
          )}

          {/* Oculta os botões de paginação durante a pesquisa global */}
          {!isSearching && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <button
                className="btn-back"
                disabled={page === 0}
                onClick={() => setPage((prev) => prev - 1)}
                style={{ opacity: page === 0 ? 0.5 : 1, cursor: page === 0 ? 'not-allowed' : 'pointer' }}
              >
                &lt; ANTERIOR
              </button>
              <span style={{ fontWeight: 'bold' }}>PÁGINA {page + 1}</span>
              <button
                className="btn-back"
                onClick={() => setPage((prev) => prev + 1)}
                style={{ cursor: 'pointer' }}
              >
                PRÓXIMA &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;