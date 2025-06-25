import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

function SignupForm({ onSignup, setAuthMethod }) {
  const [allowedDepartments, setAllowedDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    employeeId: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function getDepartment() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/department/all`
        );
        setAllowedDepartments(response.data.departments);
      } catch (error) {
        console.log(error);
      }
    }

    getDepartment();
  }, []);

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
      department: form.department,
    });

    setForm({
      name: "",
      employeeId: "",
      department: "",
      password: "",
      confirmPassword: "",
    });
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
          label="Employee ID"
          name="employeeId"
          margin="normal"
          value={form.employeeId}
          onChange={handleChange}
          required
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="department-label">Department</InputLabel>
          <Select
            labelId="department-label"
            id="department"
            name="department"
            value={form.department}
            label="Department"
            onChange={handleChange}
          >
            {allowedDepartments?.map((dept, i) => (
              <MenuItem key={i} value={dept.name}>
                {dept.name} ({dept.departmentId})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
