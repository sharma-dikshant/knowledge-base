import { useState } from "react";
import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

function CreateSolutionForm({ post }) {
  const [solution, setSolution] = useState("");

  async function handleSubmit() {
    if (solution.trim()) {
      try {
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/solution/${post._id}`,
          { description: solution.trim() },
          { withCredentials: true }
        );
        toast.success("solution successfully added!");
      } catch (error) {
        toast.error("failed to add solution!");
        console.log(error);
      }
      setSolution("");
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: "0 auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Submit a Solution for:
      </Typography>

      <Typography variant="h6" color="primary" gutterBottom>
        {post.title}
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        {post.description}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Your Solution"
          placeholder="Describe the solution clearly..."
          value={solution}
          multiline
          minRows={5}
          onChange={(e) => setSolution(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={!solution.trim()}
        >
          Submit Solution
        </Button>
      </Box>
    </Paper>
  );
}

export default CreateSolutionForm;
