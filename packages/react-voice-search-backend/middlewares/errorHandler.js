export const errorHandler = (err, _req, res) => {
  console.error("ErrorHandler:", err);
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized";
  } else if (err.code === 11000) {
    statusCode = 409; // Duplicate key in MongoDB (e.g., email already registered)
    message = "Duplicate entry";
  } else if (err.statusCode && err.message) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({ message });
};
