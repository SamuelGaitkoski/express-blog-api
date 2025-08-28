import { expect } from "chai";
import sinon from "sinon";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AuthService } from "../../services/auth.service.js";
import User from "../../models/user.model.js";

describe("AuthService", () => {
  let sandbox;
  let authService;

  beforeEach(() => {
    // Create fresh sandbox for each test to avoid side-effects
    sandbox = sinon.createSandbox();
    authService = new AuthService();
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
      sandbox.stub(User, "findOne").resolves(null);

      try {
        await authService.login("wrong@test.com", "123456");
        throw new Error("Test failed - error not thrown");
      } catch (err) {
        expect(err.message).to.equal("Invalid credentials");
      }
    });

    it("should throw error if password does not match", async () => { 
      const fakeUser = { email: "john@test.com", password: "hashed" };
      sandbox.stub(User, "findOne").resolves(fakeUser);
      sandbox.stub(bcrypt, "compare").resolves(false);

      try {
        await authService.login("john@test.com", "wrongpass");
        throw new Error("Test failed - error not thrown");
      } catch (err) {
        expect(err.message).to.equal("Invalid credentials");
      }
    });

    it("should return token and user if credentials are valid", async () => {
      const fakeUser = { _id: "1", email: "john@test.com", password: "hashed", fullName: "John Doe", role: "USER" };
      const fakeToken = "fakeToken";
      sandbox.stub(User, "findOne").resolves(fakeUser);
      sandbox.stub(bcrypt, "compare").resolves(true);
      sandbox.stub(jwt, "sign").returns(fakeToken);

      const result = await authService.login("john@test.com", "123456");

      expect(result.token).to.equal(fakeToken);
      expect(result.user.fullName).to.equal(fakeUser.fullName);
      expect(result.user.email).to.equal(fakeUser.email);
      expect(result.user.role).to.equal(fakeUser.role);
    });
  });
});