import { expect } from "chai";
import sinon from "sinon";

import Post from "../../models/post.model.js";
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
      const fakePosts = [{ title: "User Post" }];
      const findStub = sandbox.stub(Post, "find").returns({
        sort: sandbox.stub().returns({
          populate: sandbox.stub().returns({ lean: () => fakePosts })
        })
      });

      const result = await postService.getAll("USER", "user123");

      expect(result).to.equal(fakePosts);
    });
  });

  describe("getById", () => {
    it("should return a post by id", async () => {
      const fakePost = { title: "My Post", authorId: { fullName: "John Doe" } };
      const findByIdStub = sandbox.stub(Post, "findById").returns({
        populate: sandbox.stub().returns({ lean: () => fakePost })
      });

      const result = await postService.getById("post123");

      expect(result).to.equal(fakePost);
    });
  });

  describe("create", () => {
    it("should save and return a post", async () => {
      const data = { title: "Test Post", content: "Content", authorId: "123" };
      const saveStub = sandbox.stub(Post.prototype, "save").resolves(data);

      const result = await postService.create(data);

      expect(saveStub.calledOnce).to.be.true;
      expect(result.title).to.equal(data.title);
      expect(result.content).to.equal(data.content);
      expect(result.authorId).to.equal(data.authorId);
    });
  });

  describe("update", () => {
    it("should update and return the post", async () => {
      const id = "123";
      const data = { title: "Updated Post" };
      const updatedPost = { _id: id, title: "Updated Post", content: "Content", authorId: "123" };
      const updateStub = sandbox
        .stub(Post, "findByIdAndUpdate")
        .resolves(updatedPost);

      const result = await postService.update(id, data);

      expect(updateStub.calledOnceWith(id, data, { new: true, runValidators: true })).to.be.true;
      expect(result).to.deep.equal(updatedPost);
    });
  });
});