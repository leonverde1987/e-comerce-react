import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CartPage({ cart, onUpdate, onRemove, onClear, onCheckout, token }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta de crédito');
  const [cardNumber, setCardNumber] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!cart.length) return;
    setError(null);
    setLoading(true);

    if (!shippingAddress || !city || !postalCode) {
      setError('Completa la información de envío para continuar.');
      setLoading(false);
      return;
    }

    if (paymentMethod.includes('Tarjeta') && cardNumber.replace(/\s+/g, '').length < 12) {
      setError('Ingresa un número de tarjeta válido.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          total,
          shipping: { address: shippingAddress, city, postalCode, notes },
          payment: { method: paymentMethod, cardLast4: cardNumber.slice(-4) }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al procesar la compra');
      onCheckout(data);
      onClear();
      navigate('/summary');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Carrito de compras</h2>
      {!cart.length ? (
        <div className="alert">El carrito está vacío. Agrega productos para simular tu compra.</div>
      ) : (
        <>
          <div className="grid grid-3" style={{ alignItems: 'flex-start' }}>
            <div className="card">
              <h3>Resumen de productos</h3>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => onUpdate(item.id, Number(e.target.value))}
                        />
                      </td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button className="danger" onClick={() => onRemove(item.id)} title="Eliminar producto">
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="product-meta">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>

            <div className="card">
              <h3>Datos de envío</h3>
              <div className="form-grid">
                <label>
                  Dirección
                  <input value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Calle y número" />
                </label>
                <label>
                  Ciudad
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ciudad" />
                </label>
                <label>
                  Código postal
                  <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Ej. 28001" />
                </label>
                <label>
                  Notas de entrega
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ej. Dejar en recepción" rows="3" />
                </label>
              </div>
            </div>

            <div className="card">
              <h3>Pago simulado</h3>
              <div className="form-grid">
                <label>
                  Método de pago
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option>Tarjeta de crédito</option>
                    <option>Transferencia bancaria</option>
                    <option>Pago contra entrega</option>
                  </select>
                </label>
                {paymentMethod === 'Tarjeta de crédito' && (
                  <label>
                    Número de tarjeta
                    <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" />
                  </label>
                )}
                <div className="small-text">Este flujo es una simulación y no procesa pagos reales.</div>
              </div>
            </div>
          </div>

          <div className="cart-actions">
            <button onClick={handleCheckout} disabled={loading}>{loading ? 'Procesando...' : 'Finalizar compra simulada'}</button>
            <button className="secondary" onClick={onClear}>Vaciar carrito</button>
          </div>
          {error && <div className="alert">{error}</div>}
        </>
      )}
    </div>
  );
}

export default CartPage;
