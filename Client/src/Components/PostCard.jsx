import { useEffect, useState } from "react";
import {
  Paper,
  Button,
  Typography,
  TextField,
  Chip,
  Divider,
  Box,
  Avatar,
  Link,
} from "@mui/material";
import {
  BiUpvote,
  BiSolidUpvote,
  BiSolidDownvote,
  BiDownvote,
} from "react-icons/bi";
import { useOutletContext, Link as RouterLink } from "react-router-dom";
import axios from "axios";

function PostCard({ post }) {
  const user = useOutletContext();
  const [upVoted, setUpVoted] = useState(false);
  const [downVoted, setDownVoted] = useState(false);
  const [votes, setVotes] = useState(post.votes || 0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const postId = post._id;

  useEffect(() => {
    async function getComments() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/post/getAllComment/${postId}`
        );
        setComments(response.data.comments);
      } catch (error) {
        console.log(error);
      }
    }
    getComments();
  }, [postId]);
  

  async function handleVote(type) {
    try {
      if (type === "upVote" && !upVoted) {
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/post/upVote/${postId}`,
          {},
          { withCredentials: true }
        );
        setUpVoted(true);
        setDownVoted(false);
        setVotes((v) => v + 1);
      } else if (type === "downVote" && !downVoted) {
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/post/downVote/${postId}`,
          {},
          { withCredentials: true }
        );
        setDownVoted(true);
        setUpVoted(false);
        setVotes((v) => Math.max(v - 1, 0));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleAddComment() {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/post/comment/${postId}`,
        { content: newComment },
        { withCredentials: true }
      );
      setComments((prev) => [
        ...prev,
        { content: newComment.trim(), author: user },
      ]);
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Paper sx={{ p: 3, mb: 3, border: "1px solid #ccc", borderRadius: 2 }}>
      <Box display="flex" flexDirection="column">
        <Typography
          variant="h6"
          component={RouterLink}
          to={`/post/${post._id}`}
          sx={{
            textAlign: "left",
            textDecoration: "none",
            color: "black",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {post.title}
        </Typography>

        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
          <Chip label={`Status: ${post.status}`} size="small" color="warning" />
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

      <Box textAlign="left">
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
              <Link href={`/u/${comment.author.employeeId}`} underline="none">
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
