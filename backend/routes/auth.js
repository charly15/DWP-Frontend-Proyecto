const express = require("express");
const bcrypt = require("bcryptjs");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

const router = express.Router();
const db = admin.firestore();

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) return res.status(400).json({ msg: "Todos los campos son obligatorios" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("USERS").add({ email, username, password: hashedPassword });

    res.status(201).json({ msg: "Usuario registrado con éxito" });
  } catch (err) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("Datos recibidos en /login:", req.body); 

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const usersRef = db.collection("USERS");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    let user;
    snapshot.forEach((doc) => (user = { id: doc.id, ...doc.data() }));

    console.log("Usuario encontrado:", user);

    if (!user || !user.password) {
      return res.status(400).json({ msg: "Error al recuperar usuario" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Resultado de bcrypt.compare:", isMatch); 

    if (!isMatch) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "10m" }
    );

    res.json({ token, userId: user.id, msg: "Inicio de sesión exitoso" });

  } catch (err) {
    console.error("Error en /login:", err.message); 
    res.status(500).json({ msg: "Error en el servidor", error: err.message });
  }
});




module.exports = router; 
