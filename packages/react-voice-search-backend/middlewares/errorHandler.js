const errorHandler = (err, req, res) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;
