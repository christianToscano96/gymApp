import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token, autorización denegada' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
}

export default authMiddleware;

// Middleware para control de roles
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    // El rol debe estar en req.user.role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
    }
    next();
  };
}
