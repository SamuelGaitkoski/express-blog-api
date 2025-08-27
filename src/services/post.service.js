import { UserRole } from "../enums/user-role.enum";
import Post from "../models/post.model";

class PostService {
  async getAll(userRole) {
    let posts;

    if (userRole === UserRole.ADMIN) {
      posts = await Post.find().sort({ createdAt: -1 }).lean();
    } else {
      posts = await Post.find({ authorId: req.user.id }).sort({ createdAt: -1 }).lean();
    }
    return posts;
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