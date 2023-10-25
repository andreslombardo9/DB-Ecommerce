import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
export const authRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Guarda el usuario dentro de req.user para su posterior uso en tus rutas
    req.user = user;

    // Llama a next() después de guardar el usuario
    next();
  });
};




export const checkUserRole = (requiredRole) => {
  return (req, res, next) => {
    // Obtener el token del encabezado de la solicitud
    let token = req.header('Authorization');
    token = token.split(' ');
    token = token[token.length - 1]

    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }

    try {
      // Verificar y descodificar el token
      const decoded = jwt.verify(token, TOKEN_SECRET); // Reemplaza 'tu_secreto' con tu clave secreta real

      // Comprobar si el rol del usuario coincide con el rol requerido
      if (decoded.rol !== requiredRole) {
        return res.status(403).json({ message: 'Permiso denegado' });
      }

      // El usuario tiene el rol necesario, permite continuar
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token no válido' });
    }
  };
};
