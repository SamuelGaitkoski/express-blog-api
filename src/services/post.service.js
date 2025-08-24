import Post from "../models/post.model";

class PostService {
  async getAll() {
    return await Post.find().sort({ createdAt: -1 }).lean();
  }

  async getById(id) {
    return await Post.findById(id).lean();
  }

  async create(data) {
    const post = new Post(data);
    return await post.save();
  }

  async update(id, data) {
    return await Post.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Post.findByIdAndDelete(id);
  }
}

export default new PostService();