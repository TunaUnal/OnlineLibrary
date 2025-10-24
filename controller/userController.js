import { printUserName, getAllUserAPI } from "../service/userService.js";

export const getUser = async (req, res) => {
  const response = await printUserName(req.params.id);
  res.json(response);
};

export const getAllUser = async (req, res) => {
  try {
    const users = await getAllUserAPI();
    res
      .status(200)
      .json({ message: "Kullanıcılar başarıyla alındı", data: users });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
