import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function ProductDetailPage({ onAdd, token }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><h2>Cargando producto...</h2></div>;
  if (!product) return <div className="page"><h2>Producto no encontrado</h2></div>;

  return (
    <div className="page">
      <Link to="/dashboard" className="back-link">← Volver a la lista</Link>
      <div className="grid" style={{ gridTemplateColumns: '1.3fr 0.9fr', gap: '2rem' }}>
        <div className="card">
          <img
            src={product.image}
            alt={product.name}
            onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = 'https://images.unsplash.com/photo-1513708924521-6b3b8d9e94ee?auto=format&fit=crop&w=800&q=80'; }}
          />
          <div className="card-header">
            <div>
              <h2>{product.name}</h2>
              <span className="tag">{product.category}</span>
            </div>
            <span className="price-tag">${product.price.toFixed(2)}</span>
          </div>
          <p>{product.description}</p>
        </div>

        <div className="card">
          <h3>Detalles</h3>
          <p>{product.shortDescription}</p>
          <div className="product-meta">
            <span>Precio</span>
            <strong>${product.price.toFixed(2)}</strong>
          </div>
          <div className="product-actions">
            <button
              disabled={!token}
              onClick={() => onAdd(product)}
              title={!token ? 'Inicia sesión para añadir productos' : 'Agregar al carrito'}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
