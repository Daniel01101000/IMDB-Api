import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/authRoutes.js"; // 👈 ojo al nombre, que sea igual al archivo real
import { initDB } from "./db/database.js"; // 👈 conexión a SQLite

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// 🔹 Rutas de autenticación
app.use("/auth", authRoutes);

// 🔹 Ruta protegida de ejemplo
app.get("/protected", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    res.json({ message: "Accediste a la ruta protegida 🎉", user: decoded });
  });
});

const PORT = process.env.PORT || 5000;

// 🔹 Iniciar DB y luego el servidor
(async () => {
  try {
    await initDB();
    app.listen(PORT, () =>
      console.log(`✅ Backend corriendo en http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Error al inicializar la base de datos:", err);
    process.exit(1); // detener el servidor si la DB no carga
  }
})();