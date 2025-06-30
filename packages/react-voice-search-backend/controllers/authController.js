import { authenticateUser, registerUser } from "../services/authService.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authenticateUser(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    next({
      statusCode: err.statusCode || 500,
      message: err.message || "Internal server error",
    });
  }
};

export const register = async (req, res, next) => {
  try {
    const { user, token } = await registerUser(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Registered and logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        country: user.country,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    next({
      statusCode: err.statusCode || 500,
      message: err.message || "Internal server error",
    });
  }
};
