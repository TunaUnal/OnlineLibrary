import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res
      .status(401)
      .json({ message: "Bu işlem için giriş yapmalısınız!" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>" kısmından sadece token
  if (!token)
    return res
      .status(401)
      .json({ message: "Bu işlem için giriş yapmalısınız" });

  jwt.verify(token, "SECRET_KEY", (err) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Bu işlem için giriş yapmalısınız" });
    next();
  });
};

export { authenticate };
