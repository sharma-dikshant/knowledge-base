import React, { useState } from 'react';
import './Pagecss/admin.css';

const AdminHomepage = () => {
  // Sample Data
  const [employees, setEmployees] = useState([
    { id: 1, username: "JohnDoe", employecode: "EMP001", department: "IT", email: "john.doe@example.com", phonenumber: "9876543210", posts: 5, grade: "A" },
    { id: 2, username: "JaneSmith", employecode: "EMP002", department: "HR", email: "jane.smith@example.com", phonenumber: "9876543211", posts: 3, grade: "B" },
    { id: 3, username: "MarkLee", employecode: "EMP003", department: "Finance", email: "mark.lee@example.com", phonenumber: "9876543212", posts: 7, grade: "A+" },
    { id: 4, username: "EmilyClark", employecode: "EMP004", department: "Marketing", email: "emily.clark@example.com", phonenumber: "9876543213", posts: 2, grade: "B+" },
  ]);

  const [search, setSearch] = useState("");

  // Filter data based on search input
  const filteredEmployees = employees.filter(emp =>
    emp.username.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-container">
      <h2>Admin Dashboard - Employee Table</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Employees..."
        className="search-input"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Employee Code</th>
              <th>Department</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Posts</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.username}</td>
                <td>{emp.employecode}</td>
                <td>{emp.department}</td>
                <td>{emp.email}</td>
                <td>{emp.phonenumber}</td>
                <td>{emp.posts}</td>
                <td>{emp.grade}</td>
                <td>
                  <button className="view-btn">View</button>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHomepage;
