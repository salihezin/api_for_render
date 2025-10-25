import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgres://finance_t87n_user:vSVGNJkwqRDMJYjMsdvxmeuZnQ0K9iJN@dpg-d3ulvere5dus739popng-a:5432/finance_t87n",
  ssl: { rejectUnauthorized: false }
});

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// TABLO OLUŞTUR (başlangıçta)
const createTableIfNotExists = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    console.log("Tablo hazır ✅");
  } catch (err) {
    console.error("Tablo oluşturulamadı ❌", err);
  }
};

// Başlangıçta tabloyu oluştur
createTableIfNotExists();

// CREATE
app.post("/users", async (req, res) => {
  const { name } = req.body;
  await pool.query("INSERT INTO users(name) VALUES($1)", [name]);
  res.send("Kullanıcı eklendi ✅");
});

// READ
app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

// UPDATE
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  await pool.query("UPDATE users SET name=$1 WHERE id=$2", [name, id]);
  res.send("Kullanıcı güncellendi 🔄");
});

// DELETE
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM users WHERE id=$1", [id]);
  res.send("Kullanıcı silindi ❌");
});

app.get("/", (req, res) => res.send("CRUD API çalışıyor 🚀"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API port ${port}
