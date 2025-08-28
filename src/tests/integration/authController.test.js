import request from "supertest";
import { expect } from "chai";

import app from "../../src/app.js"; // Your Express app
import User from "../../src/models/User.js";
import { connectDB, disconnectDB } from "./setup.js";

describe("Auth Routes (Integration)", () => {
  before(async () => {
    await connectDB();
  });

  after(async () => {
    await disconnectDB();
  });

  afterEach(async () => {
    // Clear users between tests
    await User.deleteMany({});
  });

  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const data = {
        fullName: "John Doe",
        email: "john@example.com",
        password: "123456"
      };

      const res = await request(app)
        .post("/auth/register")
        .send({
          fullName: data.fullName,
          email: data.email,
          password: data.password
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("token");
      expect(res.body.user.fullName).to.equal(data.fullName);
      expect(res.body.user.email).to.equal(data.email);
    });

    it("should return 400 if user already exists", async () => {
      const data = {
        fullName: "Existing User",
        email: "exist@example.com",
        password: "hashed"
      };

      const res = await request(app)
        .post("/auth/register")
        .send({
          fullName: data.fullName,
          email: data.email,
          password: data.password
        });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal("User already exists");
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({ email: "test@example.com", password: "123456" }); // missing fullName

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal("FullName, Email and Password are required");
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      // Register user to login
      await request(app)
        .post("/auth/register")
        .send({
          fullName: "John Doe",
          email: "john@example.com",
          password: "123456"
        });
    });

    it("should login with correct credentials", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({
          email: "john@example.com",
          password: "123456"
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("token");
      expect(res.body.user.fullName).to.equal("John Doe");
    });

    it("should return 400 if credentials are invalid", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({
          email: "john@example.com",
          password: "wrongpass"
        });
      
      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal("Invalid credentials");
    });
  });
});

