import { useEffect, useState } from 'react';

function SummaryPage({ order, user }) {
  const [lastOrder, setLastOrder] = useState(order);

  useEffect(() => {
    if (!order) {
      const stored = localStorage.getItem('lastOrder');
      if (stored) setLastOrder(JSON.parse(stored));
    }
  }, [order]);

  if (!lastOrder) {
    return (
      <div className="page">
        <h2>Resumen no disponible</h2>
        <p>Realiza una compra para ver el resumen aquí.</p>
      </div>
    );
  }

  const shipping = lastOrder.shipping || {};
  const payment = lastOrder.payment || {};

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Resumen de compra</h2>
          <p className="small-text">Gracias por tu compra, {user?.name || 'cliente'}. Este es el detalle de la orden simulada.</p>
        </div>
      </div>

      <div className="summary-grid">
        <div className="card">
          <h3>Información del pedido</h3>
          <p><strong>Pedido:</strong> {lastOrder.orderId}</p>
          <p><strong>Fecha:</strong> {new Date(lastOrder.createdAt).toLocaleString()}</p>
          <p><strong>Total:</strong> ${lastOrder.total.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Envío</h3>
          <p>{shipping.address}</p>
          <p>{shipping.city} · {shipping.postalCode}</p>
          {shipping.notes && <p className="small-text">Nota: {shipping.notes}</p>}
        </div>
        <div className="card">
          <h3>Pago</h3>
          <p>{payment.method}</p>
          {payment.cardLast4 && <p>Tarjeta terminada en •••• {payment.cardLast4}</p>}
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3>Productos en tu orden</h3>
        <table className="cart-table receipt-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {lastOrder.items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SummaryPage;
