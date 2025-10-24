import { Router } from "express";
import { getUser, getAllUser } from "../controller/userController.js";
import { authenticate } from "../middleware/auth.js";
const router = Router();
router.get("/:id", getUser);
router.get("/", authenticate, getAllUser);

export default router;
