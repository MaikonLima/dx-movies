const prisma = require("../config/db");

const getGeneralStats = async () => {
  const totalMovies = await prisma.movie.count();
  const totalRatings = await prisma.rating.count();
  const avgRating = await prisma.rating.aggregate({
    _avg: {
      rating: true,
    },
  });

  return {
    totalMovies,
    totalRatings,
    averageRating: avgRating._avg.rating,
  };
};

// Retorna os gêneros mais populares
const getPopularGenres = async () => {
  const genres = await prisma.genre.findMany();
  const genreCount = {};

  console.log(genres, "movies");


  genres.forEach((genre) => {
    if (genreCount[genre.name]) {
      genreCount[genre.name]++;
    } else {
      genreCount[genre.name] = 1;
    }
  });

  const popularGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .map(([genre, count]) => ({ genre, count }));


  return popularGenres;
};

// Retorna a média de avaliações por filme
const getAverageRatings = async () => {
  const ratings = await prisma.rating.groupBy({
    by: ["movieId"],
    _avg: {
      rating: true,
    },
  });

  const moviesWithRatings = await Promise.all(
    ratings.map(async (rating) => {
      const movie = await prisma.movie.findUnique({
        where: { id: rating.movieId },
      });
      return {
        title: movie.title,
        averageRating: rating._avg.rating,
      };
    })
  );

  return moviesWithRatings;
};

module.exports = {
  getGeneralStats,
  getPopularGenres,
  getAverageRatings,
};
