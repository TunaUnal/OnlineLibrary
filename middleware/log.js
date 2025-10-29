// utils/logger.js
import fs from "fs";
import path from "path";
import Log from "../models/LogModel.js";

const LOG_DIR = path.resolve("logs");
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

export const logEvent = async (options = {}) => {
  try {
    let { req, action, detail, status = "info", user_id } = options;

    const ip =
      req?.headers["x-forwarded-for"]?.split(",")[0] ||
      req?.socket?.remoteAddress ||
      null;

    const userId = req?.user?.id || user_id || null;

    // --- 1️⃣ Veritabanına yaz ---
    await Log.create({
      user_id: userId,
      ip,
      action,
      detail,
    });

    // --- 2️⃣ Dosyaya da yaz ---
    const filePath = path.join(
      LOG_DIR,
      `${new Date().toISOString().slice(0, 10)}.log`
    );

    const line = `[${new Date().toISOString()}] [${status.toUpperCase()}] [user:${
      userId ?? "anon"
    }] [ip:${ip ?? "?"}] ${action} - ${detail || ""}\n`;

    fs.appendFileSync(filePath, line, "utf8");
  } catch (err) {
    console.error("❌ Log kaydedilemedi:", err.message);
  }
};
