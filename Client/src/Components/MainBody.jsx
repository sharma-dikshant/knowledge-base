import React, { useState, useEffect } from "react";
import "./Componentcss/mainbody.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";
import { MdHome, MdLogin } from "react-icons/md";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";

const MainBody = () => {
  const [user, setUser] = useState(null);
  const [showsidebar, setshowsidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  console.log(user)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    async function getUser() {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/user/getUser`,
        { withCredentials: true }
      );
      setUser(response.data?.data || null);
    }
    getUser();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="MainBodyClass">
      <nav className="navclass">
        <section className="section1">
          <GiHamburgerMenu onClick={() => setshowsidebar(!showsidebar)} />
        </section>
        <section className="section2">
          <h1>IOCL Knowledge Base</h1>
        </section>
      </nav>

      <div className="Body">
        {!isMobile ? (
          showsidebar ? (
            <div className="bodySection1sidebar">
              <div className="sidebarlist">
                <Link to="/" className="sidebarul">
                  <MdHome style={{ fontSize: "2rem" }} /> HomePage
                </Link>
                {user ? (
                  <Link to="/user" className="sidebarul">
                    <FaUserCircle style={{ fontSize: "2rem" }} /> Userpage
                  </Link>
                ) : (
                  <Link className="sidebarul">
                    <MdLogin style={{ fontSize: "2rem" }} /> Login
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="bodySection1navbar">
              <div className="sidebarlist">
                <Link to="/" className="sidebarul">
                  <MdHome />
                </Link>
                <Link to='/user' className="sidebarul">
                  <FaUserCircle />
                </Link>
              </div>
            </div>
          )
        ) : (
          showsidebar && (
            <div className="mobileSidebar">
              <ul className="sidebarul">
                <MdHome style={{ fontSize: "1.5rem" }} /> Home
              </ul>
              <ul className="sidebarul">
                <FaUserCircle style={{ fontSize: "1.5rem" }} /> User
              </ul>
            </div>
          )
        )}

        <div
          className={
            showsidebar && !isMobile ? "bodySection2" : "bodySectionnav2"
          }
        >
          <Outlet context={user} />
        </div>
      </div>

      <footer className="footerClass">Footer</footer>
    </div>
  );
};

export default MainBody;
