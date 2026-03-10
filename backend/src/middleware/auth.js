import jwt from "jsonwebtoken";

const readBearerToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

export const authMiddleware = (req, res, next) => {
  const token = readBearerToken(req);

  if (!token) {
    return res.status(401).json({ message: "Nao autorizado." });
  }

  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ message: "Token invalido." });
  }
};

export const adminAuthMiddleware = (req, res, next) => {
  const token = readBearerToken(req);

  if (!token) {
    return res.status(401).json({ message: "Nao autorizado." });
  }

  try {
    const payload = verifyToken(token);
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Acesso restrito ao admin." });
    }
    req.auth = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Token invalido." });
  }
};

export const clientAuthMiddleware = (req, res, next) => {
  const token = readBearerToken(req);

  if (!token) {
    return res.status(401).json({ message: "Nao autorizado." });
  }

  try {
    const payload = verifyToken(token);
    if (payload.role !== "client" || !payload.clientUserId) {
      return res.status(403).json({ message: "Acesso restrito ao cliente." });
    }
    req.auth = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Token invalido." });
  }
};
