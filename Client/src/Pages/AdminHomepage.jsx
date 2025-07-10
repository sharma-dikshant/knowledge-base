import "./Pagecss/admin.css";
import { useOutletContext } from "react-router-dom";

import EmployeesDetails from "../Components/EmployeesDetails";

function AdminHomepage() {
  const admin = useOutletContext();

  if (admin.role !== "admin") {
    return <h3>YOU'RE NOT ALLOWED! PLEASE LOGIN AS ADMIN</h3>;
  }

  return (
    <div className="admin-container">
      <EmployeesDetails />
    </div>
  );
}

export default AdminHomepage;
