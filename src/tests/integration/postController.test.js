import request from "supertest";
import { expect } from "chai";

import app from "../../src/app.js"; // Your Express app
import User from "../../models/user.model.js";
import Post from "../../models/post.model.js";
import { connectDB, disconnectDB } from "./setup.js";

describe("Post Routes (Integration)", () => {
  before(async () => {
    await connectDB();
  });

  after(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    // Clean DB before each test
    await Post.deleteMany({});
    await User.deleteMany({});
  });

  describe("POST /posts", () => {
    it("should create a new post", async () => {
      // First, create a user to be the author
    });
  });
});