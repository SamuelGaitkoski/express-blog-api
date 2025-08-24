import Post from "../models/post.model";

class PostService {
  async create(data) {
    const post = new Post(data);
    return await post.save();
  }

  async getAll() {
    return await Post.find();
  }

  async getById(id) {
    return await Post.findById(id).len;
  }

  async update(id, data) {
    return await Post.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Post.findByIdAndDelete(id);
  }
}

export default new PostService();