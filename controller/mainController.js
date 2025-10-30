import { mainService } from "../service/mainService.js";

export const dashboard = async (req, res) => {
  try {
    const data = await mainService.getDashboardData(req.user.id);
    res.status(200).json({ message: "Welcome to the Dashboard!", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
