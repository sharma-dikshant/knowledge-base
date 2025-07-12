import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Chip,
  Stack,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import API_ROUTES from "../services/api";
import SelectElement from "../ui/SelectElement";

const defaultForm = {
  title: "",
  description: "",
  category: "",
  hashtags: [],
  department: null,
  isPrivate: true,
};

const categories = ["feature", "bug", "enhancement"];

export default function CreatePostForm() {
  const [form, setForm] = useState(defaultForm);
  const [tagInput, setTagInput] = useState("");
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const responses = await axios.get(`${API_ROUTES.departments.getAll}`);
        setDepartments(responses.data?.departments || []);
      } catch (error) {
        toast.error("Failed to fetch departments");
      }
    }
    fetchDepartments();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.department) {
      toast.error("Please select a department");
      return;
    }

    try {
      const payload = {
        ...form,
        department: form.department?.name || "",
        private: form.isPrivate,
      };
      await axios.post(`${API_ROUTES.posts.create}`, payload, {
        withCredentials: true,
      });
      setForm(defaultForm);
      setTagInput("");
      toast.success("Successfully created post!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create new post!");
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{ maxWidth: 600, mx: "auto", p: 4, height: "100%" }}
    >
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

        <FormControl fullWidth margin="normal">
          <InputLabel>Department</InputLabel>
          <Select
            label="Department"
            value={form.department?.departmentId || ""}
            onChange={(e) => {
              const selectedDept = departments.find(
                (d) => d.departmentId === e.target.value
              );
              console.log("Selected:", selectedDept); // ✅ This will now log
              setForm((prev) => ({
                ...prev,
                department: selectedDept,
              }));
            }}
          >
            {departments.map((dept) => (
              <MenuItem key={dept.departmentId} value={dept.departmentId}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

        <Box mt={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.isPrivate}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isPrivate: e.target.checked,
                  }))
                }
                name="isPrivate"
                color="primary"
              />
            }
            label="Make this post private"
          />
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
