import {
  getFileById,
  getFileByFilter,
  uploadFile,
  updateFile,
  changeFileStatus,
  getMyFiles,
  getPendingFiles,
  downloadFile,
} from "../controller/fileController.js";
import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
const router = express.Router();

//! Dosyaları filtreleyerek getirme
router.get("/", authenticate, getFileByFilter);

//! Kendi dosyalarını getirme
router.get("/me", authenticate, getMyFiles);

//! Beklemede olan dosyaları getirme (admin)
router.get("/pending", authenticate, authorize("admin"), getPendingFiles);

//! Belirli bir dosyayı ID ile getirme
router.get("/:id", authenticate, getFileById);

//! Dosya güncelleme
router.put("/:id", authenticate, authorize("admin"), updateFile);

//! Dosya durumunu değiştirme (admin)
router.put("/:id/status", authenticate, authorize("admin"), changeFileStatus);

router.get("/download/:id", authenticate, downloadFile);
router.post("/upload", upload.single("file"), authenticate, uploadFile);

export default router;
