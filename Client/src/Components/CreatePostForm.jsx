import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Chip,
  Stack,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

const defaultForm = {
  title: "",
  description: "",
  category: "",
  hashtags: [],
  department: "",
};

const categories = ["feature", "bug", "enhancement"];

export default function CreatePostForm() {
  const [form, setForm] = useState(defaultForm);
  const [tagInput, setTagInput] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddHashtag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !form.hashtags.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        hashtags: [...prev.hashtags, trimmed],
      }));
      setTagInput("");
    }
  };

  const handleDeleteHashtag = (tagToDelete) => {
    setForm((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((tag) => tag !== tagToDelete),
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/post/createPost`,
        form,
        { withCredentials: true }
      );
      setForm(defaultForm);
      toast.success("successfully created!");
    } catch (error) {
      console.log(error);
      toast.error("failed to create new Post!");
    }
  }

  return (
    <Paper elevation={4} sx={{ maxWidth: 600, mx: "auto", p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create New Post
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={4}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          select
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          margin="normal"
          required
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Department"
          name="department"
          value={form.department}
          onChange={handleChange}
          margin="normal"
          required
        />

        {/* Hashtag Input */}
        <Box mt={2}>
          <TextField
            fullWidth
            label="Add Hashtag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddHashtag();
              }
            }}
          />
          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
            {form.hashtags.map((tag, idx) => (
              <Chip
                key={idx}
                label={`#${tag}`}
                onDelete={() => handleDeleteHashtag(tag)}
                color="primary"
              />
            ))}
          </Stack>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Submit Post
        </Button>
      </form>
    </Paper>
  );
}
