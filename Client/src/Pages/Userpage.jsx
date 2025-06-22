import {
  Avatar,
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";

function Userpage() {
  const { id: userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/user/userDetails/${userId}`
        );
        setUserDetails(response.data.data);
      } catch (error) {
        toast.error("Error! No User found");
        console.log(error);
      }
    }
    fetchUser();
  }, [userId]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/post/getUserPost/${
            userDetails._id
          }`
        );
        setPosts(response.data.posts);
      } catch (error) {
        toast.error("No posts found for this user");
        console.log(error);
      }
    }

    if (userDetails) fetchPosts();
  }, [userDetails]);

  if (!userDetails) return null;

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        User Panel
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
            {userDetails.name.slice(0, 2).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6">{userDetails.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Employee ID: {userDetails.employeeId}
            </Typography>
            <Chip
              label={`Role: ${userDetails.role}`}
              size="small"
              color="info"
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary">
          Joined: {new Date(userDetails.createdAt).toLocaleString()}
        </Typography>
      </Paper>

      <Typography variant="h5" gutterBottom>
        My Activities
      </Typography>

      {posts.length === 0 ? (
        <Typography color="text.secondary">No posts found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item xs={12} md={6} key={post._id}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography
                  variant="h6"
                  component={Link}
                  to={`/post/${post._id}`}
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                >
                  {post.description}
                </Typography>

                <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                  <Chip
                    label={`Status: ${post.status}`}
                    color="warning"
                    size="small"
                  />
                  <Chip
                    label={`Category: ${post.category}`}
                    color="primary"
                    size="small"
                  />
                  <Chip label={`Votes: ${post.votes}`} size="small" />
                  <Chip
                    label={`Dept: ${post.department}`}
                    size="small"
                    color="default"
                  />
                  {post.hashtags?.map((tag, idx) => (
                    <Chip
                      key={idx}
                      label={`#${tag}`}
                      variant="outlined"
                      size="small"
                      color="secondary"
                    />
                  ))}
                </Box>

                <Typography variant="caption" display="block" mt={2}>
                  Created: {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Userpage;
