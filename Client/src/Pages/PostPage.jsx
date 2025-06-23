import { useEffect, useState } from "react";
import { useLoaderData, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Avatar,
  TextField,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import ModalWindow from "./../ui/ModalWindow";
import toast from "react-hot-toast";
import CreateSolutionForm from "../Components/CreateSolutionForm";

function PostPage() {
  const data = useLoaderData();
  const user = useOutletContext();
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");

  async function handleAddComment() {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/post/comment/${id}`,
        { content: newComment },
        { withCredentials: true }
      );
      toast.success("Comment added");
      setNewComment("");
      location.reload(); // or re-fetch comments
    } catch (error) {
      toast.error("Failed to add comment");
      console.log(error);
    }
  }

  if (!data.post) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ p: 4, maxWidth: "1000px", mx: "auto", mt: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {data.post.author?.name?.slice(0, 1).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4">{data.post.title}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              by {data.post.author?.name}
            </Typography>
          </Box>
        </Box>
        <ModalWindow text="ADD SOLUTION">
          <CreateSolutionForm post={data.post} />
        </ModalWindow>
      </Box>

      <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
        <Chip label={`Status: ${data.post.status}`} color="warning" />
        <Chip label={`Category: ${data.post.category}`} color="primary" />
        <Chip label={`Department: ${data.post.department.toUpperCase()}`} />
        {data.post.hashtags?.map((tag, idx) => (
          <Chip
            key={idx}
            label={`#${tag}`}
            variant="outlined"
            color="secondary"
          />
        ))}
      </Box>

      <Typography variant="body1" sx={{ mt: 3, whiteSpace: "pre-wrap" }}>
        {data.post.description}
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* Comments Section */}
      <Box>
        <Typography variant="h6">Comments</Typography>
        {data.comments.length === 0 ? (
          <Typography color="text.secondary">No comments yet.</Typography>
        ) : (
          data.comments.map((comment, idx) => (
            <Box key={idx} display="flex" alignItems="center" gap={1} my={1}>
              <Avatar
                sx={{ bgcolor: "#1976d2", width: 32, height: 32, fontSize: 14 }}
              >
                {comment.author?.name?.slice(0, 2).toUpperCase() || "??"}
              </Avatar>
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

      <Divider sx={{ my: 4 }} />

      {/* Solutions Section */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Solutions
        </Typography>
        {data.solutions.length === 0 ? (
          <Typography color="text.secondary">
            No solutions submitted yet.
          </Typography>
        ) : (
          data.solutions.map((sol, idx) => (
            <Paper key={idx} sx={{ p: 2, mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                {sol.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Submitted on {new Date(sol.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          ))
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* AI Suggestions (Placeholder) */}
      <Box>
        <Typography variant="h6" gutterBottom>
          AI Suggestions (Coming Soon)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Our AI assistant will suggest possible improvements or existing
          similar solutions in this section.
        </Typography>
      </Box>
    </Paper>
  );
}

export default PostPage;
