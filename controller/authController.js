import { login, logout } from "../service/authService.js";

export const loginUser = async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  try {
    const user = await login(username, password);
    if (user) {
      res.status(200).json({ message: "Giriş Başarılı", data: user });
    } else {
      res.status(401).json({ message: "Geçersiz kimlik bilgileri" });
    }
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const logoutUser = (req, res) => {
  const { username } = req.body;
  if (logout(username)) {
    res.status(200).json({ message: "Logout successful" });
  } else {
    res.status(400).json({ message: "Logout failed" });
  }
};
