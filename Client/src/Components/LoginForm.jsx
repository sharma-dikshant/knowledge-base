import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Link } from "@mui/material";

function LoginForm({ onLogin, setAuthMethod }) {
  const [form, setForm] = useState({ employeeId: "", password: "" });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onLogin?.(form);
    setForm({ employeeId: "", password: "" });
  }

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: "auto", p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Login</Typography>
        <Link
          component="button"
          variant="body2"
          onClick={() => setAuthMethod("signup")}
          underline="hover"
          sx={{ cursor: "pointer" }}
        >
          Register
        </Link>
      </Box>

      <form onSubmit={handleSubmit}>
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
        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Paper>
  );
}

export default LoginForm;
