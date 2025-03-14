const movieService = require("../services/movieService");

//Lista todos os filmes
const getAllMovies = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const result = await movieService.getAllMovies(parseInt(page), parseInt(limit));
    res.json(result);
  } catch (error) {
    console.error("Erro ao buscar todos os filmes:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Buscar filmes por título
const getMoviesByTitle = async (req, res) => {
  const { title, year, genre } = req.query;

  if (!title) {
    return res.status(400).json({ error: "O parâmetro 'title' é obrigatório" });
  }

  try {
    const movies = await movieService.getMoviesByTitle(title, year, genre);
    res.json(movies);
  } catch (error) {
    console.error("Erro ao buscar filmes por título:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};


// Lista filmes por gênero
const getMoviesByGenre = async (req, res) => {
  const { genre, limit, page } = req.query;

  if (!genre) {
    return res.status(400).json({ error: "O parâmetro 'genre' é obrigatório" });
  }

  try {
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    const pageNumber = page ? parseInt(page, 10) : 1;

    const movies = await movieService.getMoviesByGenre(genre, limitNumber, pageNumber);
    res.json(movies);
  } catch (error) {
    console.error("Erro ao buscar filmes por gênero:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Buscar filmes por ano e gênero
const getMoviesByYearAndGenre = async (req, res) => {
  const { year, genre } = req.query;

  if (!year || !genre) {
    return res.status(400).json({ error: "Ano e gênero são obrigatórios" });
  }

  try {
    const movies = await movieService.getMoviesByYearAndGenre(year, genre);
    res.json(movies);
  } catch (error) {
    console.error("Erro ao buscar filmes por ano e gênero:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Listar os K filmes mais bem avaliados
const getTopRatedMovies = async (req, res) => {
  const { limit } = req.query;

  try {
    const movies = await movieService.getTopRatedMovies(limit);
    res.json(movies);
  } catch (error) {
    console.error("Erro ao buscar os filmes mais bem avaliados:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Filtrar filmes por popularidade
const getPopularMovies = async (req, res) => {
  const { limit } = req.query;

  try {
    const movies = await movieService.getPopularMovies(limit);
    res.json(movies);
  } catch (error) {
    console.error("Erro ao buscar filmes populares:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};


module.exports = {
  getAllMovies,
  getMoviesByTitle,
  getMoviesByYearAndGenre,
  getTopRatedMovies,
  getPopularMovies,
  getMoviesByGenre
};
