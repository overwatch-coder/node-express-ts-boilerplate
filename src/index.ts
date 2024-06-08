// configure env in the entire application
import "dotenv/config";

// import this module only in production
if (process.env.NODE_ENV === "production") {
  require("module-alias/register");
}

// import modules
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fileUpload from "express-fileupload";

// import config
import connectToDB from "./config/db.config";

// import routes
import userRoutes from "./routes/user.route";

// Swagger Docs
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./docs/docs.json";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";

// import middleware
import { errorHandler, notFound } from "@/middleware/error.middleware";

// other imports such as logger, rateLimiter etc.
import { logger } from "@/lib/logger";

const runServer = async () => {
  // init express
  const app = express();

  // use middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(helmet());

  // setup cors
  app.use(
    cors({
      origin: [process.env.FRONTEND_URL!, "http://localhost:3000"],
      credentials: true,
    })
  );

  // setup file upload
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
      createParentPath: true,
    })
  );

  // setup logger
  if (process.env.NODE_ENV !== "production") {
    app.use(
      morgan("combined", {
        stream: {
          write: (message: string) => logger.log(logger.level, message),
        },
      })
    );
  }

  // routes
  app.use("/api/users", userRoutes);

  // setup docs
  const theme = new SwaggerTheme();
  const themeStyle = theme.getBuffer(SwaggerThemeNameEnum.DRACULA);
  const swaggerOptions = {
    explorer: true,
    customCss: themeStyle,
  };
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, swaggerOptions)
  );

  // catch-all route (redirect to api docs)
  app.use("*", (req, res) => {
    res.redirect("/api/docs");
  });

  // Error middleware
  app.use(notFound);
  app.use(errorHandler);

  // run database
  await connectToDB();

  // start server
  const port = process.env.PORT || 8000;
  const isProd = process.env.NODE_ENV === "production";

  app.listen(port, () => {
    if (isProd) {
      console.log(`Server running on port ${port}`);
    } else {
      console.log(`Server running on port http://localhost:${port}`);
    }
  });
};

// run server
runServer();
