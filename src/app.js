import express from "express";
import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import postsRouter from "./routes/posts.js";

const app = express();

// Middlewares
// Built-in middleware to parse JSON request bodies
app.use(express.json());
// Our logger
app.use(logger);

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Routes
app.use("/posts", postsRouter);

// 404 for unknown routes
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// Error handler
app.use(errorHandler);

export default app;