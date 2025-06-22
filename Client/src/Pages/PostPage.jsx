import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "@mui/material";
import toast from "react-hot-toast";

function PostPage() {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchPostDetails() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/post/detail/${id}`
        );
        setPostData(res.data.post);
        setComments(res.data.comments);
      } catch (err) {
        toast.error("Failed to load post");
        console.error(err);
      }
    }
    fetchPostDetails();
  }, [id]);

  async function handleAddComment() {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/post/comment/${id}`,
        { content: newComment },
        { withCredentials: true }
      );
      setComments((prev) => [...prev, { content: newComment }]);
      setNewComment("");
    } catch (error) {
      toast.error("Failed to add comment");
      console.log(error);
    }
  }

  if (!postData) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        {postData.title}
      </Typography>

      <Box mb={2} display="flex" flexWrap="wrap" gap={1}>
        <Chip label={`Status: ${postData.status}`} color="warning" />
        <Chip label={`Category: ${postData.category}`} color="primary" />
        <Chip label={`Department: ${postData.department.toUpperCase()}`} />
        <Chip label={`By: ${postData.author?.name}`} />
      </Box>

      <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
        {postData.description}
      </Typography>

      {postData.hashtags?.length > 0 && (
        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          {postData.hashtags.map((tag, idx) => (
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

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">Comments</Typography>
      {comments.length === 0 ? (
        <Typography color="text.secondary">No comments yet.</Typography>
      ) : (
        comments.map((comment, idx) => (
          <Box key={idx} display="flex" alignItems="center" gap={1} my={1}>
            <Avatar sx={{ bgcolor: "#1976d2", width: 32, height: 32, fontSize: 14 }}>
              {comment.author?.name?.slice(0, 2).toUpperCase() || "??"}
            </Avatar>
            <Typography variant="body2">{comment.content}</Typography>
          </Box>
        ))
      )}

      <Box mt={2} display="flex" gap={1}>
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
    </Paper>
  );
}

export default PostPage;
