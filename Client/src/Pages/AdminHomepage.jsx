import React, { useState } from "react";
import "./Pagecss/admin.css";
import { Button, Pagination } from "@mui/material";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AdminHomepage = () => {
  const users = useLoaderData() || []; // Sample Data
  const [search, setSearch] = useState("");
  const [page, setPage] = useState();
  const handleParamsChange = () => {};

  async function deleteUser(userId) {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/user/deleteUser/${userId}`,
        { withCredentials: true }
      );
      toast.success("user deleted successfully!");
    } catch (error) {
      toast.error("failed to delete user!");
      console.log("error in deleting user", error.message);
    }
  }

  return (
    <>
      <div className="admin-container">
        <h2>Admin Dashboard - Employee Table</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Employees..."
          className="search-input"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button>Create New User</Button>
        <Button>Add Excel File of Users</Button>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Email</th>

                <th>Designation</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.name.toUpperCase()}</td>
                  <td>{emp.employeeId}</td>
                  <td>{emp.department.toUpperCase()}</td>
                  <td>{emp.email || "not available"}</td>
                  <td>{emp.designation || "not available"}</td>
                  <td>{emp.grade || "not available"}</td>
                  <td>
                    <button className="view-btn">View</button>
                    <button className="edit-btn">Edit</button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteUser(emp._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={10} // Ideally should come from backend
          shape="rounded"
          page={page}
          onChange={(event, value) => handleParamsChange({ page: value })}
        />
      </div>
    </>
  );
};

export default AdminHomepage;
