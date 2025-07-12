import {
  Avatar,
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
  Grid,
  Pagination,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams, useSearchParams } from "react-router-dom";
import API_ROUTES from "../services/api";
import { BiLock, BiSolidLockOpen } from "react-icons/bi";

function UserProfilePage() {
  const { id: userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(
          `${API_ROUTES.users.getDetails(userId)}`,
          { withCredentials: true }
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
          `${API_ROUTES.posts.getByUser(userDetails._id)}`
        );
        setPosts(response.data.data);
      } catch (error) {
        toast.error("No posts found for this user");
        console.log(error);
      }
    }

    if (userDetails) fetchPosts();
  }, [userDetails]);

  if (!userDetails) return null;

  function handleParamsChange(newParams) {
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, ...newParams });
  }

  return (
    <div>
      <Box p={3}>
        <Typography variant="h4" mb={2}>
          User Panel
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
              {userDetails?.name?.slice(0, 2)?.toUpperCase() ?? "??"}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {userDetails?.name?.toUpperCase() ?? "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Employee ID: {userDetails?.employeeId ?? "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Department: {userDetails?.department ?? "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {userDetails?.email ?? "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mobile: {userDetails?.mobile ?? "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Grade: {userDetails?.grade?.toUpperCase() ?? "N/A"}
              </Typography>
              <Chip
                label={`Role: ${userDetails?.role ?? "N/A"}`}
                size="small"
                color="info"
                sx={{ mt: 1 }}
              />
              <Typography variant="body2" color="text.secondary" mt={1}>
                Joined:{" "}
                {userDetails?.createdAt
                  ? new Date(userDetails.createdAt).toLocaleString()
                  : "N/A"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            Joined: {new Date(userDetails.createdAt).toLocaleString()}
          </Typography>
        </Paper>

        <Typography variant="h5" gutterBottom>
          Activities
        </Typography>

        {posts.length === 0 ? (
          <Typography color="text.secondary">No posts found.</Typography>
        ) : (
          <Grid container direction="column" spacing={2}>
            {posts.map((post) => (
              <Grid item key={post._id}>
                <Paper elevation={2} sx={{ p: 2 }}>
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
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                  >
                    {post.description}
                  </Typography>

                  <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                    <Chip
                      label={`Category: ${post.category}`}
                      color="primary"
                      size="small"
                    />
                    <Chip label={`Votes: ${post.votes}`} size="small" />
                    <Chip label={`Dept: ${post.department}`} size="small" />
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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={10} // Ideally should come from backend
          shape="rounded"
          page={page}
          onChange={(event, value) => handleParamsChange({ page: value })}
        />
      </div>
    </div>
  );
}

export default UserProfilePage;
