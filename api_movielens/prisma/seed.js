const csv = require("csv-parser");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const createGenres = async (genres) => {
  const genreRecords = await Promise.all(
    genres.map(async (genre) => {
      return prisma.genre.upsert({
        where: { name: genre },
        update: {},
        create: { name: genre },
      });
    })
  );
  return genreRecords;
};

const createUser = async () => {
  const username = "userTest";
  const password = "test123";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { username },
    update: {},
    create: {
      username,
      password: hashedPassword,
    },
  });

  console.log(`Usuário de teste criado: ${user.username}`);
};

async function processMovies() {
  const extractYearFromTitle = (title) => {
    const match = title.match(/\((\d{4})\)/);
    return match ? parseInt(match[1], 10) : null;
  };

  const processRow = async (row) => {
    try {
      const year = extractYearFromTitle(row.title);

      if (!year) {
        console.error(`Ano não encontrado no título: ${row.title}`);
        return;
      }

      const genres = row.genres.split("|");
      const genreRecords = await createGenres(genres);

      await prisma.movie.create({
        data: {
          title: row.title,
          year: year,
          genres: {
            connect: genreRecords.map((genre) => ({ id: genre.id })),
          },
        },
      });
      console.log(`Filme adicionado: ${row.title}`);
    } catch (error) {
      console.error(`Erro ao adicionar filme: ${row.title}`, error);
    }
  };

  const stream = fs.createReadStream("./data/movies.csv").pipe(csv());
  for await (const row of stream) {
    await processRow(row);
  }
  console.log("Processamento de filmes concluído.");
}

async function processRatings() {
  const processRow = async (row) => {
    try {
      const movieExists = await prisma.movie.findUnique({
        where: { id: parseInt(row.movieId) },
      });

      if (!movieExists) {
        console.error(
          `Filme com ID ${row.movieId} não encontrado. Ignorando avaliação.`
        );
        return;
      }

      await prisma.rating.create({
        data: {
          userId: parseInt(row.userId),
          movieId: parseInt(row.movieId),
          rating: parseFloat(row.rating),
          timestamp: new Date(parseInt(row.timestamp) * 1000),
        },
      });
      console.log(`Avaliação adicionada para o filme ID: ${row.movieId}`);
    } catch (error) {
      console.error(`Erro ao adicionar avaliação: ${row.movieId}`, error);
    }
  };

  const stream = fs.createReadStream("./data/ratings.csv").pipe(csv());
  for await (const row of stream) {
    await processRow(row);
  }
  console.log("Processamento de avaliações concluído.");
}

async function processTags() {
  const processRow = async (row) => {
    try {
      const movieExists = await prisma.movie.findUnique({
        where: { id: parseInt(row.movieId) },
      });

      if (!movieExists) {
        console.error(
          `Filme com ID ${row.movieId} não encontrado. Ignorando tag.`
        );
        return;
      }

      await prisma.tag.create({
        data: {
          userId: parseInt(row.userId),
          movieId: parseInt(row.movieId),
          tag: row.tag,
          timestamp: new Date(parseInt(row.timestamp) * 1000),
        },
      });
      console.log(`Tag adicionada para o filme ID: ${row.movieId}`);
    } catch (error) {
      console.error(`Erro ao adicionar tag: ${row.movieId}`, error);
    }
  };

  const stream = fs.createReadStream("./data/tags.csv").pipe(csv());
  for await (const row of stream) {
    await processRow(row);
  }
  console.log("Processamento de tags concluído.");
}

async function processLinks() {
  const processRow = async (row) => {
    try {
      const movieExists = await prisma.movie.findUnique({
        where: { id: parseInt(row.movieId) },
      });

      if (!movieExists) {
        console.error(
          `Filme com ID ${row.movieId} não encontrado. Ignorando link.`
        );
        return;
      }

      await prisma.link.create({
        data: {
          movieId: parseInt(row.movieId),
          imdbId: row.imdbId,
          tmdbId: row.tmdbId ? parseInt(row.tmdbId) : null,
        },
      });
      console.log(`Link adicionado para o filme ID: ${row.movieId}`);
    } catch (error) {
      console.error(`Erro ao adicionar link: ${row.movieId}`, error);
    }
  };

  const stream = fs.createReadStream("./data/links.csv").pipe(csv());
  for await (const row of stream) {
    await processRow(row);
  }
  console.log("Processamento de links concluído.");
}

async function main() {
  await createUser();
  await processMovies();
  await processRatings();
  await processTags();
  await processLinks();
}

main()
  .catch((error) => {
    console.error("Erro durante o processamento dos dados:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });