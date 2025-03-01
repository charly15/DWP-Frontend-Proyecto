const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const db = require('firebase-admin').firestore();
const router = express.Router();

// Ruta para obtener el perfil del usuario
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Obtiene el ID del usuario desde el token
    const userRef = db.collection('USERS').doc(userId); // Accede al documento del usuario
    const userDoc = await userRef.get(); // Obtiene el documento del usuario

    if (!userDoc.exists) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Devuelve los datos del usuario
    res.json(userDoc.data());
  } catch (err) {
    console.error('Error al obtener el perfil:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

module.exports = router;
