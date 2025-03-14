const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MovieLens API",
      version: "1.0.0",
      description: "API para gerenciamento de filmes e avaliações",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Movie: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            title: {
              type: "string",
            },
            year: {
              type: "integer",
            },
            genres: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },
        Stats: {
          type: "object",
          properties: {
            totalMovies: {
              type: "integer",
            },
            totalRatings: {
              type: "integer",
            },
            averageRating: {
              type: "number",
              format: "float",
            },
          },
        },
        GenreStats: {
          type: "object",
          properties: {
            genre: {
              type: "string",
            },
            count: {
              type: "integer",
            },
          },
        },
        MovieRatingStats: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            averageRating: {
              type: "number",
              format: "float",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
