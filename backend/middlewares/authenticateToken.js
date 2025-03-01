const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];  // Obtener el token de la cabecera

  if (!token) {
    return res.status(401).json({ msg: "Acceso denegado. No se proporcionó token" });
  }

  // Verificar el token JWT
  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ msg: "Token inválido" });
    }
    req.user = user;  // Agregar el usuario al objeto req
    next();  // Continuar al siguiente middleware o ruta
  });
}

module.exports = authenticateToken;
