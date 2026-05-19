const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./shop.db');

const defaultPassword = bcrypt.hashSync('password', 10);

const products = [
  {
    name: 'Zapatillas Runner X',
    shortDescription: 'Cómodas y ligeras para deporte.',
    description: 'Zapatillas deportivas con amortiguación, diseño moderno y suela antideslizante.',
    price: 79.9,
    category: 'Deportes',
    image: 'https://placehold.co/800x600/2563eb/ffffff?text=Zapatillas+Runner+X'
  },
  {
    name: 'Camiseta Fitness',
    shortDescription: 'Tela transpirable y suave.',
    description: 'Camiseta deportiva de secado rápido, ideal para entrenamientos y uso diario.',
    price: 29.5,
    category: 'Moda',
    image: 'https://placehold.co/800x600/0ea5e9/ffffff?text=Camiseta+Fitness'
  },
  {
    name: 'Mochila Urbana',
    shortDescription: 'Perfecta para oficina y viaje.',
    description: 'Mochila resistente con múltiples compartimentos, bolsillo para laptop y carga USB.',
    price: 49.9,
    category: 'Accesorios',
    image: 'https://placehold.co/800x600/7c3aed/ffffff?text=Mochila+Urbana'
  },
  {
    name: 'Auriculares Wireless Pro',
    shortDescription: 'Sonido envolvente y cancelación de ruido.',
    description: 'Auriculares inalámbricos con batería de larga duración y diseño ergonómico.',
    price: 119.9,
    category: 'Tecnología',
    image: 'https://placehold.co/800x600/0f766e/ffffff?text=Auriculares+Wireless+Pro'
  },
  {
    name: 'Lámpara de Mesa LED',
    shortDescription: 'Iluminación ajustable para tu escritorio.',
    description: 'Lámpara con brillo regulable y puerto USB para recargar dispositivos.',
    price: 34.9,
    category: 'Hogar',
    image: 'https://placehold.co/800x600/f97316/ffffff?text=Lámpara+Mesa+LED'
  },
  {
    name: 'Set de Tazas Minimal',
    shortDescription: 'Juego de 4 tazas modernas.',
    description: 'Complementa tu cocina con estilo y un diseño elegante.',
    price: 24.5,
    category: 'Hogar',
    image: 'https://placehold.co/800x600/ea580c/ffffff?text=Set+de+Tazas'
  },
  {
    name: 'Chaqueta Softshell',
    shortDescription: 'Abrigo ligero y resistente al viento.',
    description: 'Chaqueta ideal para actividad al aire libre con cierre antiolor.',
    price: 89.9,
    category: 'Moda',
    image: 'https://placehold.co/800x600/8b5cf6/ffffff?text=Chaqueta+Softshell'
  },
  {
    name: 'Bolso de Mano',
    shortDescription: 'Elegante y espacioso para el día a día.',
    description: 'Bolso con múltiples bolsillos interiores y correa ajustable.',
    price: 59.9,
    category: 'Accesorios',
    image: 'https://placehold.co/800x600/7c3aed/ffffff?text=Bolso+de+Mano'
  },
  {
    name: 'Smartwatch Active',
    shortDescription: 'Monitoriza tu salud y actividad.',
    description: 'Reloj inteligente con seguimiento de pasos, frecuencia cardíaca y notificaciones.',
    price: 149.0,
    category: 'Tecnología',
    image: 'https://placehold.co/800x600/0ea5e9/ffffff?text=Smartwatch+Active'
  },
  {
    name: 'Alfombra Deco',
    shortDescription: 'Toque cálido para tu sala.',
    description: 'Alfombra suave y fácil de limpiar con estilo contemporáneo.',
    price: 69.0,
    category: 'Hogar',
    image: 'https://placehold.co/800x600/22c55e/ffffff?text=Alfombra+Deco'
  },
  {
    name: 'Zapatillas Training',
    shortDescription: 'Agilidad y soporte en cada paso.',
    description: 'Calzado para entrenamientos de alto rendimiento con buena tracción.',
    price: 65.5,
    category: 'Deportes',
    image: 'https://placehold.co/800x600/14b8a6/ffffff?text=Zapatillas+Training'
  },
  {
    name: 'Pantalones Jogger',
    shortDescription: 'Cómodos y con estilo urbano.',
    description: 'Jogger de tejido suave con cintura elástica y puños ajustados.',
    price: 39.9,
    category: 'Moda',
    image: 'https://placehold.co/800x600/f43f5e/ffffff?text=Pantalones+Jogger'
  },
  {
    name: 'Mochila Trekking',
    shortDescription: 'Listo para cualquier aventura.',
    description: 'Mochila con soporte lumbar, resistente al agua y varios compartimentos.',
    price: 84.0,
    category: 'Deportes',
    image: 'https://placehold.co/800x600/0f766e/ffffff?text=Mochila+Trekking'
  },
  {
    name: 'Auriculares Gaming',
    shortDescription: 'Audio preciso para videojuegos.',
    description: 'Auriculares con micrófono abatible y sonido surround.',
    price: 79.9,
    category: 'Tecnología',
    image: 'https://placehold.co/800x600/0ea5e9/ffffff?text=Auriculares+Gaming'
  },
  {
    name: 'Cafetera Espresso',
    shortDescription: 'Café de calidad profesional.',
    description: 'Cafetera compacta con presión alta y función de espuma.',
    price: 129.9,
    category: 'Hogar',
    image: 'https://placehold.co/800x600/f97316/ffffff?text=Cafetera+Espresso'
  },
  {
    name: 'Set de Utensilios',
    shortDescription: 'Cocina con estilo y eficiencia.',
    description: 'Set multiusos antiadherente con soporte elegante.',
    price: 45.0,
    category: 'Hogar',
    image: 'https://placehold.co/800x600/ea580c/ffffff?text=Set+de+Utensilios'
  },
  {
    name: 'Gafas de Sol Urban',
    shortDescription: 'Protección UV y diseño moderno.',
    description: 'Gafas ligeras con lentes polarizadas y montura resistente.',
    price: 34.9,
    category: 'Accesorios',
    image: 'https://placehold.co/800x600/8b5cf6/ffffff?text=Gafas+de+Sol+Urban'
  },
  {
    name: 'Camiseta Casual',
    shortDescription: 'Diseño urbano de algodón suave.',
    description: 'Camiseta básica con corte cómodo y colores atemporales.',
    price: 22.0,
    category: 'Moda',
    image: 'https://placehold.co/800x600/2563eb/ffffff?text=Camiseta+Casual'
  },
  {
    name: 'Botella Térmica',
    shortDescription: 'Mantiene tus bebidas frías o calientes.',
    description: 'Botella de acero inoxidable con tapa hermética y diseño elegante.',
    price: 19.9,
    category: 'Accesorios',
    image: 'https://placehold.co/800x600/22c55e/ffffff?text=Botella+Térmica'
  },
  {
    name: 'Protector Solar',
    shortDescription: 'Cuidado diario para tu piel.',
    description: 'Protector con SPF50, textura ligera y acabado transparente.',
    price: 15.9,
    category: 'Belleza',
    image: 'https://placehold.co/800x600/f43f5e/ffffff?text=Protector+Solar'
  },
  {
    name: 'Set de Yoga',
    shortDescription: 'Todo para tu práctica diaria.',
    description: 'Incluye bloque, banda elástica y toalla antideslizante.',
    price: 54.5,
    category: 'Deportes',
    image: 'https://placehold.co/800x600/0f766e/ffffff?text=Set+de+Yoga'
  },
  {
    name: 'Almohada Memory Foam',
    shortDescription: 'Descanso ergonómico para la noche.',
    description: 'Almohada con soporte cervical de espuma viscoelástica.',
    price: 39.0,
    category: 'Hogar',
    image: 'https://placehold.co/800x600/8b5cf6/ffffff?text=Almohada+Memory+Foam'
  },
  {
    name: 'Cargador Rápido USB-C',
    shortDescription: 'Carga veloz para tus dispositivos.',
    description: 'Adaptador de carga con cable incluido y protección inteligente.',
    price: 18.9,
    category: 'Tecnología',
    image: 'https://placehold.co/800x600/0ea5e9/ffffff?text=Cargador+USB-C'
  }
];

const init = () => {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        shortDescription TEXT,
        description TEXT,
        price REAL NOT NULL,
        image TEXT,
        category TEXT
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total REAL NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
      )`
    );

    db.all('PRAGMA table_info(products)', [], (err, columns) => {
      if (err) return console.error(err);
      if (!columns.some((column) => column.name === 'category')) {
        db.run('ALTER TABLE products ADD COLUMN category TEXT', (alterErr) => {
          if (alterErr) console.error(alterErr);
        });
      }
    });

    db.get('SELECT id FROM users WHERE email = ?', ['admin@example.com'], (err, row) => {
      if (err) return console.error(err);
      if (!row) {
        db.run(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          ['Administrador', 'admin@example.com', defaultPassword]
        );
      }
    });

    db.all('SELECT id, name FROM products', [], (err, rows) => {
      if (err) return console.error(err);
      if (!rows || rows.length === 0) {
        const stmt = db.prepare(
          'INSERT INTO products (name, shortDescription, description, price, image, category) VALUES (?, ?, ?, ?, ?, ?)'
        );
        products.forEach((product) => {
          stmt.run(product.name, product.shortDescription, product.description, product.price, product.image, product.category);
        });
        stmt.finalize();
      } else {
        const existingByName = rows.reduce((map, rowData) => {
          map[rowData.name] = rowData.id;
          return map;
        }, {});

        const insertStmt = db.prepare(
          'INSERT INTO products (name, shortDescription, description, price, image, category) VALUES (?, ?, ?, ?, ?, ?)'
        );

        products.forEach((product) => {
          const existingId = existingByName[product.name];
          if (existingId) {
            db.run(
              'UPDATE products SET shortDescription = ?, description = ?, price = ?, image = ?, category = ? WHERE id = ?',
              [product.shortDescription, product.description, product.price, product.image, product.category, existingId]
            );
          } else {
            insertStmt.run(product.name, product.shortDescription, product.description, product.price, product.image, product.category);
          }
        });

        insertStmt.finalize();
      }
    });
  });
};

init();

module.exports = { db };
