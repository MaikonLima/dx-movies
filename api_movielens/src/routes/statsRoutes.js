const express = require("express");
const statsController = require("../controllers/statsController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Retorna estatísticas gerais sobre os filmes e avaliações
 *     tags: [Estatísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas gerais
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMovies:
 *                   type: integer
 *                   description: Número total de filmes
 *                 totalRatings:
 *                   type: integer
 *                   description: Número total de avaliações
 *                 averageRating:
 *                   type: number
 *                   format: float
 *                   description: Média de avaliações por filme
 *       401:
 *         description: Token JWT inválido ou ausente
 */
router.get(
  "/",
  authMiddleware,
  statsController.getGeneralStats
);

/**
 * @swagger
 * /stats/genres:
 *   get:
 *     summary: Retorna os gêneros mais populares
 *     tags: [Estatísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de gêneros mais populares
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   genre:
 *                     type: string
 *                   count:
 *                     type: integer
 *       401:
 *         description: Token JWT inválido ou ausente
 */
router.get(
  "/genres",
  // authMiddleware,
  statsController.getPopularGenres
);

/**
 * @swagger
 * /stats/avg-ratings:
 *   get:
 *     summary: Retorna a média de avaliações por filme
 *     tags: [Estatísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de filmes com a média de avaliações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   averageRating:
 *                     type: number
 *                     format: float
 *       401:
 *         description: Token JWT inválido ou ausente
 */
router.get(
  "/avg-ratings",
  authMiddleware,
  statsController.getAverageRatings
);

module.exports = router;
