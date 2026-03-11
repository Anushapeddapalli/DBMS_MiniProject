const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Connect to SQLite database
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Database connected successfully ✅");
  }
});

// Create tables and seed data
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS restaurants (
      restaurant_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      location TEXT,
      rating REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS menu_items (
      menu_id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER,
      name TEXT,
      price REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      restaurant_id INTEGER,
      total REAL,
      created_at TEXT
    )
  `);

  console.log("Tables ready ✅");

  // Insert restaurants (only if empty)
  db.get("SELECT COUNT(*) as count FROM restaurants", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare(
        "INSERT INTO restaurants (name, location, rating) VALUES (?, ?, ?)"
      );

      const restaurants = [
        ["Spice Hub", "Bhimavaram", 4.5],
        ["Delta Delights", "Bhimavaram", 4.2],
        ["Godavari Bites", "Bhimavaram", 4.1],

        ["Vizag Biryani House", "Visakhapatnam", 4.5],
        ["Coastal Spice", "Visakhapatnam", 4.2],
        ["Sea View Diner", "Visakhapatnam", 4.0],

        ["Vijayawada Flavours", "Vijayawada", 4.4],
        ["Krishna Kitchen", "Vijayawada", 4.1],
        ["Andhra Ruchulu", "Vijayawada", 4.3],

        ["Guntur Spice Hub", "Guntur", 4.6],
        ["Chilli Point", "Guntur", 4.2],
        ["Mirchi Magic", "Guntur", 4.1],

        ["Tirupati Tiffins", "Tirupati", 4.3],
        ["Balaji Meals", "Tirupati", 4.2],

        ["Kurnool Biryani", "Kurnool", 4.5],
        ["Deccan Dine", "Kurnool", 4.0],

        ["Kakinada Kaja Cafe", "Kakinada", 4.3],
        ["Coastal Bites", "Kakinada", 4.0],

        ["Godavari Ruchulu", "Rajahmundry", 4.4],
        ["River Side Dine", "Rajahmundry", 4.1],

        ["Nellore Fish Fry", "Nellore", 4.4],
        ["Coastal Treats", "Nellore", 4.1]
      ];

      restaurants.forEach(r => stmt.run(r[0], r[1], r[2]));
      stmt.finalize(() => {
        console.log("Many AP restaurants inserted ✅");
      });
    }
  });

  // Insert menu items (only if empty)
  db.get("SELECT COUNT(*) as count FROM menu_items", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare(
        "INSERT INTO menu_items (restaurant_id, name, price) VALUES (?, ?, ?)"
      );

      const menus = {
        "Spice Hub": [
          { name: "Chicken Biryani", price: 180 },
          { name: "Veg Biryani", price: 140 },
          { name: "Butter Naan", price: 40 }
        ],
        "Delta Delights": [
          { name: "Paneer Curry", price: 160 },
          { name: "Roti", price: 20 },
          { name: "Jeera Rice", price: 120 }
        ],
        "Vizag Biryani House": [
          { name: "Mutton Biryani", price: 240 },
          { name: "Chicken Biryani", price: 190 },
          { name: "Raita", price: 30 }
        ],
        "Vijayawada Flavours": [
          { name: "Gongura Chicken", price: 210 },
          { name: "Steam Rice", price: 80 },
          { name: "Curd", price: 40 }
        ],
        "Guntur Spice Hub": [
          { name: "Spicy Chicken Curry", price: 220 },
          { name: "Ragi Sangati", price: 90 },
          { name: "Country Chicken Fry", price: 260 }
        ],
        "Tirupati Tiffins": [
          { name: "Idli", price: 40 },
          { name: "Dosa", price: 60 },
          { name: "Vada", price: 50 }
        ],
        "Kurnool Biryani": [
          { name: "Special Biryani", price: 230 },
          { name: "Chicken 65", price: 180 },
          { name: "Rumali Roti", price: 30 }
        ],
        "Kakinada Kaja Cafe": [
          { name: "Kaja Sweet", price: 50 },
          { name: "Poori Curry", price: 70 },
          { name: "Upma", price: 40 }
        ],
        "Godavari Ruchulu": [
          { name: "Fish Curry", price: 200 },
          { name: "Prawn Fry", price: 260 },
          { name: "Rice", price: 80 }
        ],
        "Nellore Fish Fry": [
          { name: "Fish Fry", price: 220 },
          { name: "Crab Curry", price: 280 },
          { name: "Rice", price: 80 }
        ]
      };

      const restaurantNames = Object.keys(menus);
      let pending = restaurantNames.length;

      restaurantNames.forEach(name => {
        db.get(
          "SELECT restaurant_id FROM restaurants WHERE name = ?",
          [name],
          (err, row) => {
            if (row) {
              menus[name].forEach(item => {
                stmt.run(row.restaurant_id, item.name, item.price);
              });
            }

            pending--;
            if (pending === 0) {
              stmt.finalize(() => {
                console.log("Menus for many restaurants inserted ✅");
              });
            }
          }
        );
      });
    }
  });
});

// APIs

app.get("/restaurants", (req, res) => {
  db.all("SELECT * FROM restaurants", (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.get("/menu/:id", (req, res) => {
  const restaurantId = req.params.id;
  db.all(
    "SELECT * FROM menu_items WHERE restaurant_id = ?",
    [restaurantId],
    (err, rows) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(rows);
    }
  );
});

// Search food items
app.get("/search-food", (req, res) => {
  const q = req.query.q || "";

  const sql = `
    SELECT 
      menu_items.menu_id,
      menu_items.name AS food_name,
      menu_items.price,
      restaurants.restaurant_id,
      restaurants.name AS restaurant_name,
      restaurants.location
    FROM menu_items
    JOIN restaurants ON menu_items.restaurant_id = restaurants.restaurant_id
    WHERE menu_items.name LIKE ?
  `;

  db.all(sql, [`%${q}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Auth

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.get(query, [email, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: "Invalid email or password" });
    res.json({ message: "Login successful ✅", user: row });
  });
});

// Register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (row) return res.json({ error: "Email already exists" });

    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.run(query, [name, email, password], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User registered successfully ✅", user_id: this.lastID });
    });
  });
});

// Place order
app.post("/place-order", (req, res) => {
  const { user_id, restaurant_id, total } = req.body;

  if (!user_id || !restaurant_id || !total) {
    return res.status(400).json({ error: "Missing order data" });
  }

  const query = `
    INSERT INTO orders (user_id, restaurant_id, total, created_at)
    VALUES (?, ?, ?, datetime('now'))
  `;

  db.run(query, [user_id, restaurant_id, total], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Order placed successfully 🚚", order_id: this.lastID });
  });
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
  console.log("====================================");
  console.log("🚀 Server started successfully!");
  console.log(`👉 Open this in your browser: http://localhost:${PORT}`);
  console.log("====================================");
});