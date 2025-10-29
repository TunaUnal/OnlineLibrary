import jwt from "jsonwebtoken";
import dotenv from "dotenv/config.js";
import User from "../models/userModel.js";
const authenticate = async (req, res, next) => {
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

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Bu işlem için giriş yapmalısınız" });

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user)
      return res
        .status(403)
        .json({ message: "Bu işlem için giriş yapmalısınız" });

    req.user = user;
    next();
  });
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    console.log("User Role:", req.user.role);
    console.log("Allowed Roles:", roles);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }
    next();
  };
};
export { authenticate, authorize };
