const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Post = require("./../models/PostModel");
dotenv.config();

const ConnectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/RSO-KNOWLEDGE-BASE", {
      serverSelectionTimeoutMS: 5000, // Timeout if MongoDB is unreachable
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("error while connecting", error);
  }
};
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB connection lost. Attempting to reconnect...");
  ConnectDb();
});

ConnectDb();

const data = JSON.parse(fs.readFileSync("./mock_posts.json", "utf-8"));

const updatedPosts = data.map((post) => ({
  ...post,
  private: Math.random() < 0.3, // ~30% posts are private
}));

async function addData() {
  try {
    await Post.insertMany(updatedPosts);
    console.log("success");
  } catch (error) {
    console.log(error);
  } finally {
    process.exit(1);
  }
}

addData();

module.exports = ConnectDb;
