import { Router } from "express";
import { getUser, getAllUser } from "../controller/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";
const router = Router();
router.get("/:id", authenticate, authorize("admin"), getUser);
router.get("/", authenticate, authorize("admin"), getAllUser);

export default router;
