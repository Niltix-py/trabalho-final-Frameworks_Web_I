import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function Details() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadItemDetails() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`pokemon/${id}`);
        setItem(response.data);
      } catch (err) {
        setError('Não foi possível carregar os detalhes do item.');
      } finally {
        setLoading(false);
      }
    }
    loadItemDetails();
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center' }}>Carregando detalhes...</p>;
  if (error) return <p style={{ color: '#ff4d4d', textAlign: 'center' }}>{error}</p>;

  return (
    <div>
      <Link to="/" className="btn-back">
        &lt; VOLTAR
      </Link>

      {item && (
        <div className="details-container">
          <h1 style={{ textTransform: 'uppercase' }}>
            #{item.id.toString().padStart(3, '0')} - {item.name}
          </h1>

          <img
            src={item.sprites?.front_default}
            alt={item.name}
            width="140"
            className="pokemon-sprite"
          />

          <div style={{ marginTop: '10px' }}>
            <p style={{ margin: '8px 0', fontSize: '1.2rem' }}>
              <strong>Altura:</strong> {item.height / 10} m
            </p>
            <p style={{ margin: '8px 0', fontSize: '1.2rem' }}>
              <strong>Peso:</strong> {item.weight / 10} kg
            </p>
            <p style={{ margin: '12px 0', fontSize: '1.2rem' }}>
              <strong>Tipos:</strong>
              <br />
              {item.types?.map((t) => (
                <span key={t.type.name} className="badge">
                  {t.type.name}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Details;