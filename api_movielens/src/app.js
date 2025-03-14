const express = require("express");
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const statsRoutes = require("./routes/statsRoutes");
const setupSwagger = require("./config/swagger");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/stats", statsRoutes);

setupSwagger(app);

app.get("/", (req, res) => {
  res.send("API MovieLens está funcionando!");
});

module.exports = app;
