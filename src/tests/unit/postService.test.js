import { expect } from "chai";
import sinon from "sinon";

import Post from "../../models/Post.js";
import postService from "../../services/post.service.js";

describe("PostService", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("getAll", () => {
    it("should return all posts for admin", async () => {
      const fakePosts = [{ title: "Post1" }, { title: "Post2" }];
      const findStub = sandbox.stub(Post, "find").returns({
        sort: sandbox.stub().returns({
          populate: sandbox.stub().returns({ lean: () => fakePosts })
        })
      });

      const result = await postService.getAll("ADMIN", "anyId");

      expect(result).to.equal(fakePosts);
    });

    it("should return posts only by userId for non-admin", async () => {
      
    });
  });

  describe("getById", () => {
    it("should return a post by id", async () => {
      
    });
  });

  describe("create", () => {
    it("should save and return a post", async () => {

    });
  });

  
});