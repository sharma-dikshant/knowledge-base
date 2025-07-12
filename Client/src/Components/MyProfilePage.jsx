import {
  Avatar,
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
  Grid,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Link,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import API_ROUTES from "../services/api";
import { BiLock, BiSolidLockOpen } from "react-icons/bi";
import { MdCancel, MdOutlineVerified } from "react-icons/md";

function MyProfilePage() {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("1");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("-createdAt");

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    employeeId: "",
    email: "",
    grade: "",
    mobile: "",
    department: "",
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(API_ROUTES.users.getDetails(userId), {
          withCredentials: true,
        });
        const data = res.data.data;
        setUserDetails(data);
        setEditedProfile({
          name: data.name || "",
          employeeId: data.employeeId || "",
          email: data.email || "",
          grade: data.grade || "",
          mobile: data.mobile || "",
          department: data.department || "",
        });
      } catch (err) {
        toast.error("Error! No User found");
      }
    }

    fetchUser();
  }, [userId]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const urlParams = new URLSearchParams(searchParams.toString());
        const res = await axios.get(
          `${API_ROUTES.posts.getByUser(userDetails._id)}?${urlParams}`,
          { withCredentials: true }
        );
        setPosts(res.data.data);
      } catch (err) {
        toast.error("No posts found for this user");
      }
    }

    if (userDetails) fetchPosts();
  }, [searchParams, userDetails]);

  useEffect(() => {
    setPage(parseInt(searchParams.get("page")) || 1);
    setStatus(searchParams.get("status") || "1");
    setSort(searchParams.get("sort") || "-createdAt");
  }, [searchParams]);

  const handleProfileEditSubmit = async () => {
    try {
      await axios.patch(
        API_ROUTES.users.update(userDetails._id),
        editedProfile,
        { withCredentials: true }
      );
      toast.success("Profile updated successfully!");
      setUserDetails((prev) => ({ ...prev, ...editedProfile }));
      setEditProfileOpen(false);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  function handleParamsChange(newParams) {
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, ...newParams });
  }

  if (!userDetails) return <Typography>No User Found!</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        My Dashboard
      </Typography>

      {/* Profile Info */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
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
          <Button onClick={() => setEditProfileOpen(true)} variant="outlined">
            Edit Profile
          </Button>
        </Box>
      </Paper>

      {/* Activities */}
      <Typography variant="h6" mb={2}>
        My Activities
      </Typography>

      <Tabs
        value={status}
        onChange={(e, newValue) =>
          handleParamsChange({ status: parseInt(newValue) })
        }
        sx={{ mb: 3 }}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Pending" value="1" />
        <Tab label="Approved" value="2" />
        <Tab label="Rejected" value="3" />
      </Tabs>

      {/* Posts */}
      {posts.length === 0 ? (
        <Typography color="text.secondary">No posts found.</Typography>
      ) : (
        <Grid container spacing={2} direction="column">
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
                  {post.statusChangedBy && (
                    <Chip
                      label={post.statusChangedBy.user.name?.toUpperCase()}
                      size="small"
                      icon={
                        post.statusChangedBy.action === 2 ? (
                          <MdOutlineVerified />
                        ) : (
                          <MdCancel />
                        )
                      }
                      color={
                        post.statusChangedBy.action === 2 ? "success" : "error"
                      }
                      variant="outlined"
                    />
                  )}
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
                  Created: {new Date(post.createdAt).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editedProfile.name}
            onChange={(e) =>
              setEditedProfile((prev) => ({ ...prev, name: e.target.value }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Employee ID"
            value={editedProfile.employeeId}
            disabled
            fullWidth
            margin="normal"
          />
          <TextField
            label="Department"
            value={editedProfile.department}
            disabled
            fullWidth
            margin="normal"
          />
          <TextField
            label="Grade"
            value={editedProfile.grade}
            onChange={(e) =>
              setEditedProfile((prev) => ({ ...prev, grade: e.target.value }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            type="email"
            value={editedProfile.email}
            onChange={(e) =>
              setEditedProfile((prev) => ({ ...prev, email: e.target.value }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mobile"
            value={editedProfile.mobile}
            onChange={(e) =>
              setEditedProfile((prev) => ({ ...prev, mobile: e.target.value }))
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProfileOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleProfileEditSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pagination */}
      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={10} // replace with total pages from backend
          shape="rounded"
          page={page}
          onChange={(e, val) => handleParamsChange({ page: val })}
        />
      </Box>
    </Box>
  );
}

export default MyProfilePage;
