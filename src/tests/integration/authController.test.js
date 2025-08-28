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

    });

    it("should return 400 if user already exists", async () => {

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
      
    });

    it("should return 400 if credentials are invalid", async () => {
      
    });
  });
});

