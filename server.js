const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { db } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = 'ecommerce-secret-key';

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token missing' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalid' });
    req.user = user;
    next();
  });
}

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });

  db.get('SELECT id FROM users WHERE email = ?', [email], (err, existing) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });
    if (existing) return res.status(409).json({ error: 'El email ya está registrado' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], function (insertErr) {
      if (insertErr) return res.status(500).json({ error: 'Error al crear usuario' });
      const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '8h' });
      res.json({ token, user: { id: this.lastID, name, email } });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  });
});

app.get('/api/products', (req, res) => {
  db.all('SELECT id, name, price, shortDescription, image, category FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al leer productos' });
    res.json(rows);
  });
});

app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) return res.status(500).json({ error: 'Error al leer producto' });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  });
});

app.post('/api/checkout', authenticate, (req, res) => {
  const { items, total, shipping, payment } = req.body;
  if (!items || !items.length) return res.status(400).json({ error: 'Carrito vacío' });
  if (!shipping || !shipping.address || !shipping.city || !shipping.postalCode) return res.status(400).json({ error: 'Datos de envío incompletos' });
  if (!payment || !payment.method) return res.status(400).json({ error: 'Datos de pago incompletos' });

  const createdAt = new Date().toISOString();
  db.run(
    'INSERT INTO orders (user_id, total, created_at) VALUES (?, ?, ?)',
    [req.user.id, total, createdAt],
    function (err) {
      if (err) return res.status(500).json({ error: 'Error al crear pedido' });
      const orderId = this.lastID;
      const insertItem = db.prepare(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)'
      );

      items.forEach((item) => {
        insertItem.run(orderId, item.id, item.quantity, item.price);
      });

      insertItem.finalize((insertErr) => {
        if (insertErr) return res.status(500).json({ error: 'Error al guardar items del pedido' });
        res.json({ orderId, items, total, createdAt, shipping, payment });
      });
    }
  );
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
