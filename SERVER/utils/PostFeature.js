const Comment = require("./../models/commentModel");
const Solution = require("./../models/solutionModal");
class PostFeature {
  constructor(query) {
    this.query = query;
  }

  populateAuthor(...fields) {
    const t = fields.join(" ") || "name employeeId";
    this.query = this.query.populate("author", t);
    return this;
  }

  async populateComments(posts, limit = 5, sort = "-createdAt", ...fields) {
    const fieldStr = fields.join(" ") || "";
    const Detailedposts = await Promise.all(
      posts.map(async (post) => {
        const comments = await Comment.find({ post: post._id })
          .sort(sort)
          .limit(limit)
          .populate("author", "name employeeId")
          .select("-__v");

        return { ...post, comments };
      })
    );

    return Detailedposts;
  }

  async populateSolution(posts, limit = 1, sort = "createdAt", ...fields) {
    const fieldStr = fields.join(" ") || "";
    const detailedPosts = await Promise.all(
      posts.map(async (post) => {
        const solutions = await Solution.find({ post: post._id })
          .sort(sort)
          .limit(limit)
          .populate("author", "name employeeId");

        return { ...post, solutions };
      })
    );

    return detailedPosts;
  }
}

module.exports = PostFeature;
