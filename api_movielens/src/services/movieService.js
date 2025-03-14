const prisma = require("../config/db");

//Lista todos os filmes
const getAllMovies = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const movies = await prisma.movie.findMany({
    skip: offset,
    take: limit,
    include: {
      genres: true,
      links: true,
    },
  });

  const totalMovies = await prisma.movie.count();

  const totalPages = Math.ceil(totalMovies / limit);

  return {
    movies,
    pagination: {
      currentPage: page,
      totalPages,
      totalMovies,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    },
  };
};

// Busca filmes por título
const getMoviesByTitle = async (title, year, genre) => {
  return await prisma.movie.findMany({
    where: {
      title: {
        contains: title,
      },
      year: parseInt(year) ? parseInt(year) : undefined,
      genres: genre ? {
        some: {
          name: {
            contains: genre,
          },
        },
      } : undefined,
    },
    include: {
      genres: true,
      links: true,
    },
  });
};

// Busca filmes por ano e gênero
const getMoviesByYearAndGenre = async (year, genre) => {
  return await prisma.movie.findMany({
    where: {
      year: parseInt(year),
      genres: {
        some: {
          name: genre,
        },
      },
    },
    include: {
      genres: true,
      links: true,
    },
  });
};

const getMoviesByGenre = async (genre, limit = 10, page = 1) => {
  const offset = (page - 1) * limit;

  const movies = await prisma.movie.findMany({
    where: {
      genres: {
        some: {
          name: genre,
        },
      },
    },
    skip: offset,
    take: limit,
    include: {
      genres: true,
      links: true,
    },
  });

  const totalMovies = await prisma.movie.count({
    where: {
      genres: {
        some: {
          name: genre,
        },
      },
    },
  });

  const totalPages = Math.ceil(totalMovies / limit);

  return {
    movies,
    pagination: {
      currentPage: page,
      totalPages,
      totalMovies,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    },
  };
};

// Lista os K filmes mais bem avaliados
const getTopRatedMovies = async (limit) => {
  const topMovies = await prisma.rating.groupBy({
    by: ["movieId"],
    _avg: {
      rating: true,
    },
    orderBy: {
      _avg: {
        rating: "desc",
      },
    },
    take: parseInt(limit) || 10,
  });

  const movies = await Promise.all(
    topMovies.map(async (movie) => {
      const movieDetails = await prisma.movie.findUnique({
        where: { id: movie.movieId },
        include: {
          genres: true,
          links: true,
        },
      });
      return {
        ...movieDetails,
        averageRating: movie._avg.rating,
      };
    })
  );
  return movies;
};

// Filtra filmes por popularidade
const getPopularMovies = async (limit) => {
  const popularMovies = await prisma.rating.groupBy({
    by: ["movieId"],
    _count: {
      rating: true,
    },
    _avg: {
      rating: true,
    },
    orderBy: {
      _count: {
        rating: "desc",
      },
    },
    take: parseInt(limit) || 10,
  });

  const movies = await Promise.all(
    popularMovies.map(async (movie) => {
      const movieDetails = await prisma.movie.findUnique({
        where: { id: movie.movieId },
        include: {
          genres: true,
          links: true,
        },
      });
      return {
        ...movieDetails,
        ratingCount: movie._count.rating,
        averageRating: movie._avg.rating,
      };
    })
  );

  return movies;
};

module.exports = {
  getAllMovies,
  getMoviesByTitle,
  getMoviesByYearAndGenre,
  getTopRatedMovies,
  getPopularMovies,
  getMoviesByGenre
};
