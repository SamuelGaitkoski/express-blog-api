import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.util.js";
import PostControllerClass from "../controllers/post.controller.js";

const router = Router();

const PostController = new PostControllerClass();

router.get("/", asyncHandler(PostController.getAll.bind(PostController)));
router.get("/:id", asyncHandler(PostController.getById.bind(PostController)));
router.post("/", asyncHandler(PostController.create.bind(PostController)));
router.put("/:id", asyncHandler(PostController.update.bind(PostController)));
router.delete("/:id", asyncHandler(PostController.delete.bind(PostController)));

export default router;