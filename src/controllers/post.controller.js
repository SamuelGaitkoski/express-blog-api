import mongoose from "mongoose";
import PostService from "../services/post.service.js";

class PostController {
  async getAll(req, res) {
    const posts = await PostService.getAll();
    res.json(posts);
  }

  async getById(req, res) {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid Post id" });
    }

    const post = await PostService.getById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  }

  async create(req, res) {
    const { title, content, author } = req.body;
    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    const post = await PostService.create({ title, content, author });
    res.status(201).json(post);
  }

  async update(req, res) {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "invalid Post id" });
    }

    const post = await PostService.update(id, req.body);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    res.json(post);
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "invalid Post id" });
    }

    const post = await PostService.delete(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(204).end();
  }
}

export default PostController;