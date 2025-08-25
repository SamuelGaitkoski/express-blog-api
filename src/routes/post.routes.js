import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.util.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { UserRole } from "../enums/user-role.enum.js";
import PostControllerClass from "../controllers/post.controller.js";

const router = Router();

const PostController = new PostControllerClass();

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts
 */
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

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 */
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