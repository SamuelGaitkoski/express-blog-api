import { expect } from "chai";
import sinon from "sinon";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import authService from "../../services/auth.service.js";
import User from "../../models/user.model.js";

describe("AuthService", () => {
  let sandbox;

  beforeEach(() => {
    // Create fresh sandbox for each test to avoid side-effects
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    // Restore everything to original state
    sandbox.restore();
  });

  describe("register", () => {
    it("should throw error if user already exists", async () => {
      // Stub User.findOne to simulate existing user
      sandbox.stub(User, "findOne").resolves({ email: "test@test.com" });

      try {
        await authService.register("John Doe", "test@test.com", "123456");
        throw new Error("Test failed - error not thrown");
      } catch (err) {
        expect(err.message).to.equal("User already exists");
      }
    });

    it("should register a user successfully", async () => {
      // Arrange
      sandbox.stub(User, "findOne").resolves(null); // no user exists

      const userData = { fullName: "John Doe", email: "john@test.com", password: "123456" };
      const fakeUser = { ...userData, _id: "123", save: sandbox.stub().resolvesThis() };

      // Stub bcrypt to return a fake hash instead of actually hashing
      sandbox.stub(bcrypt, "hash").resolves("hashedPassword");

      // Stub User constructor to return our fakeUser instead of real Mongoose document
      const userStub = sandbox.stub(User.prototype, "save").resolves(fakeUser);

      // Act
      const result = await authService.register(userData);

      // Assert
      expect(userStub.calledOnce).to.be.true;
      expect(result.fullName).to.equal(userData.fullName);
      expect(result.email).to.equal(userData.email);
      expect(result.password).to.equal("hashedPassword");
      expect(result).to.have.property("role"); // role assigned
    });
  });

  describe("login", () => {
    it("should throw error if user not found", async () => { 
      
    });

    it("should throw error if password does not match", async () => { 

    });

    it("should return token and user if credentials are valid", async () => {

    });
  });
});