import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { getDB } from "../db/database.js";
import { validatePassword } from "../middlewares/validatePassword.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y contraseña requeridos" });
    }

    const validationError = validatePassword(password);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const db = getDB();
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
      username,
      email,
      hashedPassword,
    ]);

    res.json({ message: "Usuario registrado con éxito" });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint")) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }
    console.error("Error en register:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos" });
    }

    const db = getDB();
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Token de Google requerido" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: "Payload de Google inválido" });
    }

    const db = getDB();
    let user = await db.get("SELECT * FROM users WHERE email = ?", [payload.email]);
    if (!user) {
      await db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
        payload.name,
        payload.email,
        null,
      ]);
    }

    const jwtToken = jwt.sign(
      { email: payload.email, name: payload.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token: jwtToken });
  } catch (err) {
    console.error("Error en googleLogin:", err);
    return res.status(400).json({ error: "Token de Google inválido" });
  }
};