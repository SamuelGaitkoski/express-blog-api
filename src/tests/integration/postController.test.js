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
      const userRes = await request(app)
        .post("/auth/register")
        .send({ fullName: "John Doe", email: "john@example.com", password: "123456" });

      const token = userRes.body.token;

      const postData = { title: "Test Post", content: "Hello World" };

      const res = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send(postData);

      expect(res.status).to.equal(201);
      expect(res.body.title).to.equal(postData.title);
      expect(res.body.content).to.equal(postData.content);
      expect(res.body.authorId.fullName).to.equal("John Doe");
    });
  });
});