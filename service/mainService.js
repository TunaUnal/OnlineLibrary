import User from "../models/UserModel.js";
import File from "../models/FileModel.js";

const getDashboardData = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");
    const fileCount = await File.count();
    const userCount = await User.count();
    const userFileCount = await File.count({ where: { user_id: userId } });
    // Örnek veri
    const data = {
      filesUploaded: userFileCount,
      totalUsers: userCount,
      totalFiles: fileCount,
    };
    return data;
  } catch (error) {
    throw new Error("Dashboard verileri alınamadı: " + error.message);
  }
};

export const mainService = {
  getDashboardData,
};
