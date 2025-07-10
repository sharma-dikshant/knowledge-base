import { useEffect, useState } from "react";
import {
  useLoaderData,
  useNavigation,
  useOutletContext,
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";
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
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
  Skeleton,
  Tabs,
  Tab,
} from "@mui/material";
import ModalWindow from "../ui/ModalWindow";
import toast from "react-hot-toast";
import CreateSolutionForm from "../Components/CreateSolutionForm";
import { MdCancel, MdDeleteOutline, MdEdit, MdOutlineVerified } from "react-icons/md";
import API_ROUTES from "../services/api";

function PostPage() {
  const data = useLoaderData();
  const user = useOutletContext();
  const navigation = useNavigation();
  const { postId } = useParams();
  const navigate = useNavigate();

  const [tabIndex, setTabIndex] = useState(0);
  const [commentLimit, setCommentLimit] = useState(10);
  const [solutionLimit, setSolutionLimit] = useState(10);

  const [openEditPostDialog, setEditPostDialog] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(data?.comments || []);
  const [solutions, setSolutions] = useState(data?.solutions || []);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    if (data?.post) {
      setEditedTitle(data.post.title);
      setEditedDescription(data.post.description);
    }
  }, [data]);

  const handleTabChange = (_, newIndex) => {
    setTabIndex(newIndex);
  };

  async function loadMoreData(
    newCommentLimit = commentLimit,
    newSolutionLimit = solutionLimit
  ) {
    try {
      const res = await axios.get(
        `${API_ROUTES.posts.getDetails(
          postId
        )}?comments=${newCommentLimit}&solutions=${newSolutionLimit}`,
        { withCredentials: true }
      );
      if (res.data.comments) setComments(res.data.comments);
      if (res.data.solutions) setSolutions(res.data.solutions);
    } catch (err) {
      console.error("Failed to load more", err);
    }
  }

  async function handleAddComment() {
    if (!newComment.trim()) return;
    setIsCommenting(true);
    try {
      const response = await axios.post(
        API_ROUTES.posts.comments.add(postId),
        { content: newComment },
        { withCredentials: true }
      );
      toast.success("Comment added");
      const newCommentData = response.data.data;
      setComments((prev) => [
        ...prev,
        {
          ...newCommentData,
          author: { name: user.name, employeeId: user.employeeId },
        },
      ]);
      setNewComment("");
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    } finally {
      setIsCommenting(false);
    }
  }

  async function handleSaveEdit() {
    if (!editedTitle.trim() || !editedDescription.trim()) {
      toast.error("Title and description cannot be empty");
      return;
    }

    try {
      const payload = {
        title: editedTitle,
        description: editedDescription,
        private: isPrivate,
      };
      await axios.patch(API_ROUTES.posts.update(postId), payload, {
        withCredentials: true,
      });

      data.post.title = payload.title;
      data.post.description = payload.description;

      toast.success("Post updated successfully");
      setEditPostDialog(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update post");
    }
  }

  async function handleDeletePost() {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      await axios.delete(API_ROUTES.posts.delete(postId), {
        withCredentials: true,
      });
      toast.success("Post deleted successfully");
      navigate("/home");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post");
    }
  }

  if (navigation.state === "loading") {
    return (
      <Box p={2}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="rectangular" height={200} />
      </Box>
    );
  }

  if (!data || !data.post) {
    return <Typography>Something Went Wrong</Typography>;
  }

  return (
    <Box p={2} maxWidth="1000px" mx="auto" mt={4}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Post Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Link to={`/u/${data.post?.author?.employeeId}`}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                {data.post?.author?.name?.slice(0, 1).toUpperCase() ?? "?"}
              </Avatar>
            </Link>
            <Box>
              <Typography variant="h5">{data.post.title}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                by {data.post?.author?.name}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1}>
            <ModalWindow text="Add Solution">
              <CreateSolutionForm post={data.post} />
            </ModalWindow>
            {user?._id === data?.post?.author?._id && (
              <>
                <IconButton
                  color="primary"
                  onClick={() => setEditPostDialog(true)}
                >
                  <MdEdit />
                </IconButton>
                <IconButton color="error" onClick={handleDeletePost}>
                  <MdDeleteOutline />
                </IconButton>
              </>
            )}
          </Stack>
        </Box>

        {/* Post Tags */}
        <Box mt={3} display="flex" flexWrap="wrap" gap={1}>
          <Chip label={`Status: ${data.post.status}`} color="warning" />
          <Chip label={`Category: ${data.post.category}`} color="primary" />
          <Chip label={`Department: ${data.post.department.toUpperCase()}`} />
          {data.post.statusChangedBy && (
            <Chip
              label={data.post.statusChangedBy.user.name.toUpperCase()}
              icon={
                data.post.statusChangedBy.action === 2 ? (
                  <MdOutlineVerified />
                ) : (
                  <MdCancel />
                )
              }
              color={data.post.statusChangedBy.action === 2 ? "success" : "error"}
              variant="outlined"
            />
          )}
          {data.post.hashtags?.map((tag) => (
            <Chip
              key={tag}
              label={`#${tag}`}
              variant="outlined"
              color="secondary"
            />
          ))}
        </Box>

        {/* Post Description */}
        <Typography variant="body1" sx={{ mt: 3, whiteSpace: "pre-wrap" }}>
          {data.post.description}
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* Tabs */}
        <Box mt={4}>
          <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label={`Comments (${comments.length})`} />
            <Tab label={`Solutions (${solutions.length})`} />
          </Tabs>

          {/* Comments Tab */}
          {tabIndex === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Comments ({comments.length})
              </Typography>

              {comments.length === 0 ? (
                <Typography color="text.secondary">No comments yet.</Typography>
              ) : (
                <Stack spacing={1} mt={1}>
                  {comments.map((comment) => (
                    <Box
                      key={comment._id}
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Link to={`/u/${comment?.author?.employeeId}`}>
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 32,
                            height: 32,
                            fontSize: 14,
                          }}
                        >
                          {comment?.author?.name
                            ? comment.author.name.slice(0, 2).toUpperCase()
                            : "??"}
                        </Avatar>
                      </Link>
                      <Typography variant="body2">
                        {comment?.content}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}

              {user && (
                <Box display="flex" gap={1} mt={2}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddComment}
                    disabled={isCommenting}
                  >
                    {isCommenting ? "Posting..." : "Comment"}
                  </Button>
                </Box>
              )}

              <Button
                variant="text"
                sx={{ mt: 2 }}
                onClick={() => {
                  const next = commentLimit + 5;
                  setCommentLimit(next);
                  loadMoreData(next, solutionLimit);
                }}
              >
                Show More Comments
              </Button>
            </Box>
          )}

          {/* Solutions Tab */}
          {tabIndex === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Solutions ({solutions.length})
              </Typography>

              {solutions.length === 0 ? (
                <Typography color="text.secondary">
                  No solutions submitted yet.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {solutions.map((sol) => (
                    <Paper key={sol._id} sx={{ p: 2 }}>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        mb={1}
                      >
                        <Avatar
                          src={sol.author.avatar}
                          alt={sol.author.name}
                          sx={{ width: 32, height: 32 }}
                        >
                          {sol.author.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Link
                          to={`/u/${sol.author.employeeId}`}
                          underline="hover"
                          variant="body2"
                        >
                          {sol.author.name}
                        </Link>
                      </Stack>

                      <Typography variant="body2" gutterBottom>
                        {sol.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Submitted on {new Date(sol.createdAt).toLocaleString()}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              )}

              <Button
                variant="text"
                sx={{ mt: 2 }}
                onClick={() => {
                  const next = solutionLimit + 5;
                  setSolutionLimit(next);
                  loadMoreData(commentLimit, next);
                }}
              >
                Show More Solutions
              </Button>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Edit Post Dialog */}
        <Dialog
          open={openEditPostDialog}
          onClose={() => setEditPostDialog(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit Post</DialogTitle>
          <DialogContent>
            <TextField
              required
              label="Title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              required
              label="Description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
              }
              label="Make Private"
            />
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveEdit}
              >
                Save Changes
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Paper>
    </Box>
  );
}

export default PostPage;
