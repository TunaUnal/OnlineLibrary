import { Router } from "express";
import { dashboard } from "../controller/mainController.js";
import { authenticate } from "../middleware/auth.js";
const router = Router();
router.get("/", authenticate, dashboard);

export default router;
