import React, { useState } from 'react';
import './Pagecss/moderator.css';

const Moderator = () => {
  // Sample Data
  const [users, setUsers] = useState([
    { id: 1, username: "JohnDoe", employecode: "EMP001", department: "IT", email: "john.doe@example.com",  posts: 5, grade: "A" },
    { id: 2, username: "JaneSmith", employecode: "EMP002", department: "HR", email: "jane.smith@example.com",  posts: 3, grade: "B" },
    { id: 3, username: "MarkLee", employecode: "EMP003", department: "Finance", email: "mark.lee@example.com", posts: 7, grade: "A+" },
    { id: 4, username: "EmilyClark", employecode: "EMP004", department: "Marketing", email: "emily.clark@example.com", posts: 2, grade: "B+" },
  ]);

  return (
    <div className="moderator-container">
      <h2>Moderator Dashboard</h2>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Employee Code</th>
              <th>Email</th>

              <th>Posts</th>
              <th colSpan="2">Privacy</th>
              <th>Actions</th>
            </tr>
            <tr>
              <th colSpan="4"></th>
              <th>Grade</th>
              <th>Department</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.employecode}</td>
                <td>{user.email}</td>
                <td>{user.posts}</td>
                <td>{user.grade}</td>
                <td>{user.department}</td>
                <td>
                  <button className="approve-btn">Approve</button>
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

export default Moderator;
