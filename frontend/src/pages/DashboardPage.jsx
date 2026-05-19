import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

function DashboardPage({ onAdd, token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const placeholderImage = 'https://images.unsplash.com/photo-1513708924521-6b3b8d9e94ee?auto=format&fit=crop&w=800&q=80';

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = [product.name, product.shortDescription, product.description, product.category]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      const matchesPrice = !maxPrice || product.price <= Number(maxPrice);
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, search, category, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, category, maxPrice, pageSize]);

  if (loading) return <div className="page"><h2>Cargando productos...</h2></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Productos</h2>
          <p className="small-text">Busca, filtra y elige productos para tu próxima compra.</p>
        </div>
        <div className="toolbar">
          <input
            type="search"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Precio máximo"
            value={maxPrice}
            min="0"
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
          </select>
        </div>
      </div>

      <div className="page-toolbar">
        <span>{filteredProducts.length} productos encontrados</span>
        <span>Página {currentPage} de {totalPages}</span>
      </div>

      {!token && <div className="alert">Inicia sesión para poder agregar productos al carrito.</div>}

      {filteredProducts.length === 0 ? (
        <div className="alert">No se encontraron productos con esos filtros.</div>
      ) : (
        <>
          <div className="grid grid-3">
            {paginatedProducts.map((product) => (
              <article className="card" key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = placeholderImage; }}
                />
                <div className="card-header">
                  <h3>{product.name}</h3>
                  <span className="tag">{product.category}</span>
                </div>
                <p>{product.shortDescription}</p>
                <div className="product-meta">
                  <span>${product.price.toFixed(2)}</span>
                  <div className="product-actions">
                    <Link to={`/product/${product.id}`} className="secondary">Ver</Link>
                    <button
                      disabled={!token}
                      onClick={() => onAdd(product)}
                      title={!token ? 'Inicia sesión para añadir productos' : 'Añadir'}
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="pagination">
            <button className="secondary" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? 'active' : 'secondary'}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button className="secondary" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
