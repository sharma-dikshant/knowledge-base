import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Select,
  MenuItem,
  InputBase,
  Box,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";

import { useLoaderData, useNavigate } from "react-router-dom";
import API_ROUTES from "../services/api";
import { GrView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

function EmployeesDetails() {
  const navigate = useNavigate();
  const initialUsers = useLoaderData() || [];

  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState("true");
  const [totalPages, setTotalPages] = useState(1);

  const handleParamsChange = ({ page }) => {
    setPage(page);
  };

  async function deleteUser(userId) {
    try {
      await axios.delete(`${API_ROUTES.users.delete(userId)}`, {
        withCredentials: true,
      });
      toast.success("User deleted successfully!");
      fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      toast.error("Failed to delete user!");
      console.error("Error in deleting user:", error.message);
    }
  }

  async function makeModerator(empId) {
    try {
      await axios.patch(
        `${API_ROUTES.users.updateRole(empId)}`,
        {
          role: "moderator",
        },
        { withCredentials: true }
      );
      toast.success("moderator created!");
    } catch (error) {
      toast.error("failed to create moderator");
    }
  }

  async function removeModerator(empId) {
    try {
      await axios.patch(
        `${API_ROUTES.users.updateRole(empId)}`,
        { role: "user" },
        { withCredentials: true }
      );
      toast.success("moderator removed");
    } catch (error) {
      toast.error("failed to remove moderator");
    }
  }

  async function fetchUsers() {
    try {
      const response = await axios.get(
        `${API_ROUTES.users.getAll}?active=${active}&page=${page}`,
        {
          withCredentials: true,
        }
      );
      setUsers(response.data.data);
      setTotalPages(response.data.totalPages || 10); // Adjust if backend provides pagination metadata
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [active, page]);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Admin Dashboard - Employee Table</Typography>
        <Select value={active} onChange={(e) => setActive(e.target.value)}>
          <MenuItem value="true">Active Users</MenuItem>
          <MenuItem value="false">Inactive Users</MenuItem>
        </Select>
      </Box>

      {/* Search Bar */}
      <InputBase
        placeholder="Search Employees..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          mb: 2,
          px: 2,
          py: 1,
          border: "1px solid #ccc",
          borderRadius: "8px",
          width: "300px",
        }}
      />

      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          // onClick={() => navigate("/create-user")}
        >
          Create New User
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          // onClick={() => navigate("/import-excel")}
        >
          Add Excel File of Users
        </Button>
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "700" }}>
                Username
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "700" }}>
                Employee ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "700" }}>
                Department
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "700" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "700" }}>
                Designation
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "700" }}>
                Grade
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "700" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((emp) => (
                <TableRow key={emp._id}>
                  <TableCell>
                    {emp.role === "admin" && (
                      <Tooltip title="Admin">
                        <Chip label="A" size="small" color="error" />
                      </Tooltip>
                    )}
                    {emp.role === "moderator" && (
                      <Tooltip title="Moderator">
                        <Chip label="M" size="small" color="warning" />
                      </Tooltip>
                    )}
                    {emp.name?.toUpperCase()}
                  </TableCell>
                  <TableCell>{emp.employeeId}</TableCell>
                  <TableCell>{emp.department?.toUpperCase()}</TableCell>
                  <TableCell>{emp.email || "Not Available"}</TableCell>
                  <TableCell>{emp.designation || "Not Available"}</TableCell>
                  <TableCell>{emp.grade || "Not Available"}</TableCell>
                  <TableCell
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/u/${emp.employeeId}`)}
                    >
                      <GrView size="20px" />
                    </Button>
                    {emp.active && emp.role === "user" && (
                      <Button
                        size="small"
                        color="warning"
                        onClick={() => makeModerator(emp.employeeId)}
                      >
                        Promote
                      </Button>
                    )}
                    {emp.role === "moderator" && (
                      <Button
                        size="small"
                        color="warning"
                        onClick={() => removeModerator(emp.employeeId)}
                      >
                        Demote
                      </Button>
                    )}
                    {emp.active && emp.role !== "admin" && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => deleteUser(emp._id)}
                      >
                        <MdDelete size="20px" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          shape="rounded"
          page={page}
          onChange={(event, value) => handleParamsChange({ page: value })}
        />
      </Box>
    </>
  );
}

export default EmployeesDetails;
