import express from "express";
import cors from "cors";

const app = express();

// CORS middleware ekleyin
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:8082', 'exp://192.168.1.36:8081', 'exp://192.168.1.36:8082'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API çalışıyor 🚀");
});

app.post("/echo", (req, res) => {
  res.json({ received: req.body });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Sunucu çalışıyor: ${port}`));
