const statsService = require("../services/statsService");

// Estatísticas gerais
const getGeneralStats = async (req, res) => {
  try {
    const stats = await statsService.getGeneralStats();
    res.json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas gerais:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Gêneros mais populares
const getPopularGenres = async (req, res) => {
  try {
    const genres = await statsService.getPopularGenres();
    res.json(genres);


  } catch (error) {
    console.error("Erro ao buscar gêneros populares:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Média de avaliações por filme
const getAverageRatings = async (req, res) => {
  try {
    const ratings = await statsService.getAverageRatings();
    res.json(ratings);
  } catch (error) {
    console.error("Erro ao buscar média de avaliações:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  getGeneralStats,
  getPopularGenres,
  getAverageRatings,
};
