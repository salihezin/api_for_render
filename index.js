import express from "express";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API çalışıyor 🚀");
});

app.post("/echo", (req, res) => {
  res.json({ received: req.body });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Sunucu çalışıyor: ${port}`));
