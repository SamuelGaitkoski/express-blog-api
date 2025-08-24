import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getAllPosts));
router.get("/:id", asyncHandler(getPost));
router.post("/", asyncHandler(createNewPost));
router.put("/:id", asyncHandler(updatePostController));
router.delete("/:id", asyncHandler(deletePostController));

export default router;