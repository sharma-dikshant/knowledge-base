import React, { useState, useEffect } from "react";
import "./uicss/mainbody.css";
import {
  GiHamburgerMenu
} from "react-icons/gi";
import {
  FaUserCircle
} from "react-icons/fa";
import {
  MdHome,
  MdLogin
} from "react-icons/md";
import {
  RiLogoutCircleRLine,
  RiAdminFill
} from "react-icons/ri";
import {
  GrDatabase
} from "react-icons/gr";
import {
  Tooltip
} from "@mui/material";
import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate
} from "react-router-dom";
import axios from "axios";

const MainBody = () => {
  const navigate = useNavigate();
  const user = useLoaderData();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="main-body">
      {/* Top Navbar */}
      <nav className="navbar">
        {/* <div className="navbar-left">
          <GiHamburgerMenu className="hamburger-icon" />
        </div> */}
        <div className="navbar-center">
          <h1 className="app-title">IOCL Knowledge Base</h1>
        </div>
      </nav>

      <div className="main-content">
        {/* Sidebar (Desktop Only) */}
        {!isMobile && (
          <aside className="sidebar">
            <Tooltip title="Home" placement="right">
              <Link to="/home" className="sidebar-link">
                <MdHome />
              </Link>
            </Tooltip>

            {user ? (
              <>
                <Tooltip title="My Profile" placement="right">
                  <Link to={`/u/${user.employeeId}`} className="sidebar-link">
                    <FaUserCircle />
                  </Link>
                </Tooltip>

                {user.role === "admin" && (
                  <Tooltip title="Admin" placement="right">
                    <Link to="/admin" className="sidebar-link">
                      <RiAdminFill />
                    </Link>
                  </Tooltip>
                )}

                {(user.role === "admin" || user.role === "moderator") && (
                  <Tooltip title="Post Vault" placement="right">
                    <Link to="/post-vault" className="sidebar-link">
                      <GrDatabase />
                    </Link>
                  </Tooltip>
                )}

                <Tooltip title="Logout" placement="right">
                  <button onClick={handleLogout} className="sidebar-button">
                    <RiLogoutCircleRLine />
                  </button>
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Login" placement="right">
                <Link to="/auth" className="sidebar-link">
                  <MdLogin />
                </Link>
              </Tooltip>
            )}
          </aside>
        )}

        {/* Main Outlet Content */}
        <main className={isMobile ? "content-full" : "content-with-sidebar"}>
          <Outlet context={user} />
        </main>
      </div>

      
    </div>
  );
};

export default MainBody;
