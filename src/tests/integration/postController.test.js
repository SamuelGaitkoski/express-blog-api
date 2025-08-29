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
    let adminToken;
    let userToken;
    let userId;

    before(async () => {
      // Create admin
      await request(app)
        .post("/auth/register")
        .send({
          fullName: "Admin User",
          email: "admin@example.com",
          password: "123456",
          role: "admin"
        });

      // Create normal user
      const userRes = await request(app)
        .post("/auth/register")
        .send({
          fullName: "Normal User",
          email: "user@example.com",
          password: "123456",
          role: "user"
        });

      userId = userRes.body._id;

      // Login admin
      const loginAdmin = await request(app)
        .post("/auth/login")
        .send({
          email: "admin@example.com",
          password: "123456"
        });

      adminToken = loginAdmin.body.token;

      // Login user
      const loginUser = await request(app)
        .post("/auth/login")
        .send({
          email: "user@example.com",
          password: "123456"
        });

      userToken = loginUser.body.token;

       // Create posts
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Admin Post", content: "Post by admin" });

      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ title: "User Post", content: "Post by user" });
    });
 
    it("should return all posts for admin", async () => {
      const res = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.at.least(2);
    });

    it("should return only posts created by the user for non-admin", async () => {
      const res = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").with.lengthOf(1);
      expect(res.body[0].title).to.equal("User Post");
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