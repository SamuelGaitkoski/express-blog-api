import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.util.js";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", asyncHandler(AuthController.register));
router.post("/login", asyncHandler(AuthController.login));

export default router;