import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import axios from "axios";
import { Paper, Typography, Chip, Box, Button, Stack } from "@mui/material";
import toast from "react-hot-toast";
import API_ROUTES from "../services/api";
import { BiLock, BiSolidLockOpen } from "react-icons/bi";
import { MdCancel, MdOutlineVerified } from "react-icons/md";

function PostVerificationCard({ post }) {
  const user = useOutletContext();
  const postId = post._id;

  const handleApprove = async () => {
    try {
      await axios.post(
        `${API_ROUTES.posts.approve(postId)}`,
        {},
        { withCredentials: true }
      );
      toast.success("Post approved successfully!");
      // Optionally trigger refresh
    } catch (error) {
      console.error("Approve Error:", error);
      toast.error("Failed to approve post.");
    }
  };

  const handleReject = async () => {
    try {
      await axios.post(
        `${API_ROUTES.posts.reject(postId)}`,
        {},
        { withCredentials: true }
      );
      toast.success("Post rejected.");
      // Optionally trigger refresh
    } catch (error) {
      console.error("Reject Error:", error);
      toast.error("Failed to reject post.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_ROUTES.posts.delete(postId)}`, {
        withCredentials: true,
      });
      toast.success("successfully deleted post!");
    } catch (error) {
      toast.error("Failed to Delete post!");
      console.log(error);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3, border: "1px solid #ccc", borderRadius: 2 }}>
      <Box display="flex" flexDirection="column">
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
              label={post.statusChangedBy.user.name.toUpperCase()}
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

      {/* Approve/Reject Buttons */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
        {post.status == 1 && (
          <Button variant="contained" color="success" onClick={handleApprove}>
            Approve
          </Button>
        )}
        {post.status == 1 && (
          <Button variant="outlined" color="error" onClick={handleReject}>
            Reject
          </Button>
        )}
        {(post.status == 2 || post.status == 3) && (
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </Stack>
    </Paper>
  );
}

export default PostVerificationCard;
