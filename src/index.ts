import express, { Request, Response } from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// init express
const app = express();

// use middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World!",
    status: 200,
    timestamp: new Date().toISOString(),
  });
});

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
