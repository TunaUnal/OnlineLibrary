import {
  getFileById,
  getFileByFilter,
  uploadFile,
  updateFile,
  changeFileStatus,
  getMyFiles,
} from "../controller/fileController.js";
import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();
router.post("/upload", authenticate, uploadFile);
router.get("/", authenticate, getFileByFilter);
router.get("/me", authenticate, getMyFiles);
router.get("/:id", authenticate, getFileById);
router.put("/:id", authenticate, authorize("admin"), updateFile);
router.patch("/:id/status", authenticate, authorize("admin"), changeFileStatus);
export default router;
