import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const VALID_USERNAME = "aarathi";
  const VALID_PASSWORD = "password123";

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }
};

