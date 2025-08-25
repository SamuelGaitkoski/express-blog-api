import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.util.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { UserRole } from "../enums/user-role.enum.js";
import PostControllerClass from "../controllers/post.controller.js";

const router = Router();

const PostController = new PostControllerClass();

router.get(
  "/",
  authenticateToken,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(PostController.getAll.bind(PostController))
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(PostController.getById.bind(PostController))
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles(UserRole.USER),
  asyncHandler(PostController.create.bind(PostController))
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(UserRole.USER),
  asyncHandler(PostController.update.bind(PostController))
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(UserRole.USER),
  asyncHandler(PostController.delete.bind(PostController))
);

export default router;