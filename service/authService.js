import dotenv from "dotenv/config.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
const login = async (username, password) => {
  if (!username || !password) {
    const error = new Error("Kullanıcı adı ve şifre gereklidir.");
    error.status = 400;
    throw error;
  }
  const user = await User.findOne({ where: { username, password } });

  if (!user) {
    const error = new Error("Geçersiz kullanıcı adı veya şifre.");
    error.status = 401;
    throw error;
  }
  console.log(`${username} giriş yaptı.`);

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.user_ns,
    avatar: user.avatar,
    token: token,
  };

  return payload;
};
const logout = (username) => {
  console.log(`${username} çıkış yaptı.`);
  return true;
};

export default { login, logout };
