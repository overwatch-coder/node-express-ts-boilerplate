const swaggerAutogen = require("swagger-autogen");

const doc = {
  name: "Node Express TS Boilerplate",
  info: {
    title: "Node Express TS Boilerplate",
    description: "API documentation for the Node Express TS Boilerplate API",
  },
  host:
    process.env.NODE_ENV !== "production"
      ? "localhost:8000"
      : "your-production-url",
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 8000}`,
      description: "Development server",
    },
    {
      url: `your-production-url`,
      description: "Production server",
    },
  ],
  tags: [
    {
      name: "Users",
      description: "User related routes",
    },
  ],
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  components: {
    securitySchemes: {
      apiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "Enter JWT token",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const outputFile = "./src/docs/docs.json";
const routes = ["./src/index.ts"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);
