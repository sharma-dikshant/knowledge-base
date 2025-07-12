import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import axios from "axios";
import {
  Paper,
  Button,
  Typography,
  TextField,
  Chip,
  Divider,
  Box,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  BiUpvote,
  BiSolidUpvote,
  BiSolidDownvote,
  BiDownvote,
  BiLock,
  BiSolidLockOpen,
} from "react-icons/bi";
import toast from "react-hot-toast";
import API_ROUTES from "../services/api";
import { MdCancel, MdOutlineVerified } from "react-icons/md";

function PostCard({ post }) {
  const user = useOutletContext();
  const [upVoted, setUpVoted] = useState(false);
  const [downVoted, setDownVoted] = useState(false);
  const [votes, setVotes] = useState(post.votes || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("comments");
  const postId = post._id;

  useEffect(() => {
    if (post.upVotes?.includes(user?._id)) {
      setUpVoted(true);
    }
    if (post.downVotes?.includes(user?._id)) {
      setDownVoted(true);
    }
  }, [post, user]);

  async function handleVote(type) {
    try {
      if (type === "upVote" && !upVoted) {
        try {
          await axios.post(
            `${API_ROUTES.posts.vote.up(postId)}`,
            {},
            { withCredentials: true }
          );
          setUpVoted(true);
          setDownVoted(false);
          setVotes((v) => v + 1);
        } catch (error) {
          toast.error("failed to upvote!");
        }
      } else if (type === "downVote" && !downVoted) {
        try {
          await axios.post(
            `${API_ROUTES.posts.vote.down(postId)}`,
            {},
            { withCredentials: true }
          );
          setDownVoted(true);
          setUpVoted(false);
          setVotes((v) => Math.max(v - 1, 0));
        } catch (error) {
          toast.error("failed to downvote!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleAddComment() {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `${API_ROUTES.posts.comments.add(postId)}`,
        { content: newComment },
        { withCredentials: true }
      );
      setComments((prev) => [...prev, { content: newComment, author: user }]);
      setNewComment("");
    } catch (error) {
      toast.error("failed to add comment!");
      console.log(error);
    }
  }

  return (
    <Paper sx={{ p: 3, mb: 3, border: "1px solid #ccc", borderRadius: 2 }}>
      <Box display="flex" flexDirection="column">
        {/* Title and Privacy Icon */}
        <Box display="flex" alignItems="center" gap={1}>
          {post.private ? (
            <Chip
              icon={<BiLock />}
              label="Private"
              size="small"
              color="warning"
            />
          ) : (
            <Chip
              icon={<BiSolidLockOpen />}
              label="Public"
              size="small"
              color="success"
            />
          )}

          <Typography
            variant="h6"
            sx={{
              textAlign: "left",
              textDecoration: "none",
              color: "black",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <Link to={`/post/${post._id}`}>{post.title}</Link>
          </Typography>
        </Box>

        <Box
          mt={1}
          display="flex"
          flexWrap="wrap"
          gap={1}
          sx={{ alignItems: "center" }}
        >
          <Chip
            label={`Category: ${post.category}`}
            size="small"
            color="primary"
          />
          <Chip label={`Dept: ${post.department.toUpperCase()}`} size="small" />
          <Chip
            label={`By: ${
              post.author
                ? post.author.name.toUpperCase().split(" ")[0]
                : "GUEST"
            }`}
            size="small"
          />
          {post.statusChangedBy && (
            <Chip
              label={post.statusChangedBy?.user?.name.toUpperCase()}
              size="small"
              icon={
                post.statusChangedBy.action === 2 ? (
                  <MdOutlineVerified />
                ) : (
                  <MdCancel />
                )
              }
              color={post.statusChangedBy.action === 2 ? "success" : "error"}
              variant="outlined"
            />
          )}
          {user && (user.role === "admin" || user.role === "moderator") && (
            <a href={`/post/${postId}`}>Add Solution</a>
          )}
        </Box>
      </Box>

      <Typography
        variant="body1"
        gutterBottom
        sx={{ mt: 2, textAlign: "left", whiteSpace: "pre-wrap" }}
      >
        {post.description}
      </Typography>

      {post.hashtags?.length > 0 && (
        <Box mt={1} mb={2} display="flex" gap={1} flexWrap="wrap">
          {post.hashtags.map((tag, idx) => (
            <Chip
              key={idx}
              label={`#${tag}`}
              variant="outlined"
              color="secondary"
              size="small"
            />
          ))}
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Toggle Section */}
      <ToggleButtonGroup
        value={activeTab}
        exclusive
        onChange={(_, newValue) => {
          if (newValue !== null) setActiveTab(newValue);
        }}
        aria-label="toggle comments/solutions"
        size="small"
      >
        <ToggleButton value="comments">Comments</ToggleButton>
        <ToggleButton value="solutions">Solutions</ToggleButton>
      </ToggleButtonGroup>

      {/* Comments or Solutions */}
      {activeTab === "comments" ? (
        <Box textAlign="left" mt={2}>
          <Typography variant="subtitle1" gutterBottom>
            Comments
          </Typography>
          {comments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No comments yet.
            </Typography>
          ) : (
            comments.map((comment, idx) => (
              <Box key={idx} display="flex" alignItems="center" gap={1} mb={1}>
                <Link to={`/u/${comment.author?.employeeId}`} underline="none">
                  <Avatar
                    sx={{
                      bgcolor: "#1976d2",
                      width: 32,
                      height: 32,
                      fontSize: 14,
                    }}
                  >
                    {comment.author?.name?.slice(0, 2).toUpperCase() || "??"}
                  </Avatar>
                </Link>
                <Typography variant="body2">{comment.content}</Typography>
              </Box>
            ))
          )}

          <Box display="flex" gap={1} mt={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddComment}>
              Comment
            </Button>
          </Box>
        </Box>
      ) : (
        <Box textAlign="left" mt={2}>
          <Typography variant="subtitle1" gutterBottom>
            Solutions
          </Typography>
          {post.solutions?.length > 0 ? (
            post.solutions.map((solution, idx) => (
              <Paper
                key={idx}
                variant="outlined"
                sx={{ p: 2, mb: 1, backgroundColor: "#f9f9f9" }}
              >
                <Typography fontWeight="bold">
                  Solution {idx + 1} by {solution.author?.name || "Anonymous"}
                </Typography>
                <Typography>{solution.description}</Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No solutions yet.
            </Typography>
          )}
        </Box>
      )}

      {/* Votes */}
      <Box display="flex" alignItems="center" gap={1} mt={2}>
        <Button onClick={() => handleVote("upVote")}>
          {upVoted ? <BiSolidUpvote size={20} /> : <BiUpvote size={20} />}
        </Button>
        <Typography>{votes}</Typography>
        <Button onClick={() => handleVote("downVote")}>
          {downVoted ? <BiSolidDownvote size={20} /> : <BiDownvote size={20} />}
        </Button>
      </Box>
    </Paper>
  );
}

export default PostCard;
