import { Router } from "express";
import {
  getCategory,
  getAllCategories,
} from "../controller/categoryController.js";

import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/:id", authenticate, getCategory);
router.get("/", authenticate, getAllCategories);

router.put("/star/:id", (req, res) => {
  res.send("Kategori yıldızla");
});

router.delete("/star/:id", (req, res) => {
  res.send("Kategori sil");
});

export default router;
