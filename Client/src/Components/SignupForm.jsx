import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Link } from "@mui/material";

function SignupForm({ onSignup, setAuthMethod }) {
  const [form, setForm] = useState({
    name: "",
    employeeId: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    onSignup({
      name: form.name,
      employeeId: form.employeeId,
      password: form.password,
    }); // Optional callback
    setForm({ name: "", employeeId: "", password: "", confirmPassword: "" });
  }

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: "auto", p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Sign Up</Typography>
        <Link
          component="button"
          variant="body2"
          onClick={() => setAuthMethod("login")}
          underline="hover"
          sx={{ cursor: "pointer" }}
        >
          Login
        </Link>
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          margin="normal"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="employeeId"
          name="employeeId"
          type="text"
          margin="normal"
          value={form.employeeId}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          margin="normal"
          value={form.password}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          margin="normal"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </form>
    </Paper>
  );
}

export default SignupForm;
