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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE
      )
    `)
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

// CREATE Task
app.post("/tasks", async (req, res) => {
  const { user_id, title } = req.body;
  try {
    await pool.query(
      "INSERT INTO tasks(user_id, title) VALUES($1, $2)",
      [user_id, title]
    );
    res.send("Görev eklendi ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send("Hata oluştu ❌");
  }
});

// READ Tasks (tüm veya user bazlı)
app.get("/tasks", async (req, res) => {
  const { user_id } = req.query; // isteğe bağlı filtre
  try {
    let result;
    if (user_id) {
      result = await pool.query("SELECT * FROM tasks WHERE user_id=$1", [user_id]);
    } else {
      result = await pool.query("SELECT * FROM tasks");
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Hata oluştu ❌");
  }
});

// UPDATE Task
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    await pool.query(
      "UPDATE tasks SET title=$1, completed=$2 WHERE id=$3",
      [title, completed, id]
    );
    res.send("Görev güncellendi 🔄");
  } catch (err) {
    console.error(err);
    res.status(500).send("Hata oluştu ❌");
  }
});

// DELETE Task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
    res.send("Görev silindi ❌");
  } catch (err) {
    console.error(err);
    res.status(500).send("Hata oluştu ❌");
  }
});


app.get("/", (req, res) => res.send("CRUD API çalışıyor 🚀"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API port ${port}
