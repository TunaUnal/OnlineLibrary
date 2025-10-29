import authService from "../service/authService.js";
import { logEvent } from "../middleware/log.js";
export const loginUser = async (req, res) => {
  // Giriş için kullanıcı adı ve şifre kontrolü

  if (!req.body?.username || !req.body?.password) {
    return res
      .status(400)
      .json({ message: "Kullanıcı adı ve şifre gereklidir" });
  }

  const { username, password } = req.body;

  try {
    const user = await authService.login(username, password);
    if (user) {
      await logEvent({
        req,
        action: "login",
        detail: `User logged in: ${username}`,
      });
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
  if (authService.logout(username)) {
    res.status(200).json({ message: "Logout successful" });
  } else {
    res.status(400).json({ message: "Logout failed" });
  }
};
