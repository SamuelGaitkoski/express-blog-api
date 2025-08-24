import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import PostControllerClass from "../controllers/post.controller.js";

const router = Router();

const PostController = new PostControllerClass();

router.get("/", asyncHandler(PostController.getAll));
router.get("/:id", asyncHandler(PostController.getById));
router.post("/", asyncHandler(PostController.create));
router.put("/:id", asyncHandler(PostController.update));
router.delete("/:id", asyncHandler(PostController.delete));

export default router;