class APIFeatures {
  constructor(query) {
    this.query = query;
  }

  paginate(page = 1, limit = 10) {
    const skipped = (page - 1) * limit;
    this.query = this.query.skip(skipped).limit(limit);
    return this;
  }

  sort(param = "-createdAt") {
    const sortQ = param.split(",").join(" ");
    this.query = this.query.sort(sortQ);
    return this;
  }

  limitFields(...fields) {
    const fieldQ = fields.join(" ") || "";
    this.query = this.query.select(fields);
    return this;
  }
}

module.exports = APIFeatures;
