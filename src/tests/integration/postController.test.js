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

  describe("GET /posts", () => {
    it("should return all posts for admin", async () => {
      // Create admin user
      const adminRes = await request(app)
        .post("/auth/register")
        .send({ fullName: "Admin", email: "admin@example.com", password: "123456", adminCode: process.env.ADMIN_CODE });
      
      const token = adminRes.body.token;

      // Create a post
      await Post.create({ title: "Post 1", content: "Content", authorId: adminRes.body.user._id });

      const res = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").with.lengthOf(1);
    });

    it("should return only posts by user for non-admin", async () => {
      // Create user
      const userRes = await request(app)
        .post("/auth/register")
        .send({ fullName: "User", email: "user@example.com", password: "123456" });
      const token = userRes.body.token;

      // Create posts for another user
      const otherUser = await User.create({ fullName: "Other", email: "other@example.com", password: "123456" });
      await Post.create({ title: "Other Post", content: "Content", authorId: otherUser._id });

      const res = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").with.lengthOf(0); // should not see other user's post
    });
  });




  describe("POST /posts", () => {
    it("should create a new post", async () => {
      // First, register a user to be the author
      const userRes = await request(app)
        .post("/auth/register")
        .send({ fullName: "John Doe", email: "john@example.com", password: "123456" });

      // Log in to get the token
      const loginRes = await request(app)
        .post("/auth/login")
        .send({ email: "john@example.com", password: "123456" });

      const token = loginRes.body.token;

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