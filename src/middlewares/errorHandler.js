export default function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  // Common Mongoose errors
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: "validation_error", details: err.errors });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: "invalid_id" });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || "internal_server_error" });
}