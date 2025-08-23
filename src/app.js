import express from "express";
import postsRouter from "./routes/posts.js";
import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(logger);

// Routes
app.use("/posts", postsRouter);

// Error handler
app.use(errorHandler);

export default app;