const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Lista todos os filmes com paginação
 *     tags: [Filmes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número da página (padrão 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número de filmes por página (padrão 10)
 *     responses:
 *       200:
 *         description: Lista de filmes paginada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       description: Página atual
 *                     totalPages:
 *                       type: integer
 *                       description: Total de páginas
 *                     totalMovies:
 *                       type: integer
 *                       description: Total de filmes
 *                     nextPage:
 *                       type: integer
 *                       nullable: true
 *                       description: Próxima página (null se não houver)
 *                     previousPage:
 *                       type: integer
 *                       nullable: true
 *                       description: Página anterior (null se não houver)
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", movieController.getAllMovies);

/**
 * @swagger
 * /movies/search:
 *   get:
 *     summary: Busca filmes por título, ano e/ou gênero
 *     tags: [Filmes]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: Título ou parte do título do filme
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: false
 *         description: Ano de lançamento do filme (opcional)
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         required: false
 *         description: Gênero do filme (opcional)
 *     responses:
 *       200:
 *         description: Lista de filmes encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       400:
 *         description: O parâmetro 'title' é obrigatório
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/search", movieController.getMoviesByTitle);

/**
 * @swagger
 * /movies/filter:
 *   get:
 *     summary: Busca filmes por ano e gênero
 *     tags: [Filmes]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ano de lançamento do filme
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do gênero
 *     responses:
 *       200:
 *         description: Lista de filmes encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Ano ou gênero não fornecidos
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/filter", movieController.getMoviesByYearAndGenre);

/**
 * @swagger
 * /movies/top:
 *   get:
 *     summary: Lista os K filmes mais bem avaliados
 *     tags: [Filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número de filmes a serem retornados (padrão 10)
 *     responses:
 *       200:
 *         description: Lista dos filmes mais bem avaliados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       401:
 *         description: Token JWT inválido ou ausente
 */
router.get(
  "/top",
  movieController.getTopRatedMovies
);

/**
 * @swagger
 * /movies/popular:
 *   get:
 *     summary: Filtra filmes por popularidade
 *     tags: [Filmes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de filmes filtrados por popularidade
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       401:
 *         description: Token JWT inválido ou ausente
 */
router.get(
  "/popular",
  movieController.getPopularMovies
);


/**
 * @swagger
 * /movies/genres:
 *   get:
 *     summary: Busca filmes por gênero
 *     tags: [Filmes]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número máximo de filmes por página (padrão 10)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número da página (padrão 1)
 *     responses:
 *       200:
 *         description: Lista de filmes encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalMovies:
 *                       type: integer
 *                     nextPage:
 *                       type: integer
 *                       nullable: true
 *                     previousPage:
 *                       type: integer
 *                       nullable: true
 *       400:
 *         description: O parâmetro 'genre' é obrigatório
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/genres",
  movieController.getMoviesByGenre
);

module.exports = router;