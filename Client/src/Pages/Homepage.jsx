import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopPosts,
  searchPosts,
  fetchDepartments,
} from "../Redux/HomepageMAnagement/PostSlice";

import "./Pagecss/Homepage.css";
import { IoIosSearch } from "react-icons/io";

const Homepage = () => {
  const dispatch = useDispatch();
  const { topPosts, searchResults, status, error, Departments } = useSelector(
    (state) => state.posts
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState(false);

  useEffect(() => {
    dispatch(fetchTopPosts());
    dispatch(fetchDepartments());
  }, [dispatch, fetchDepartments]);

  const handleSearch = () => {
    setSearch(true);
    if (!searchQuery.trim()) return;
    dispatch(searchPosts(searchQuery));
  };

  return (
    <div className="homepageBody">
      <section className="topSection">
        <div className="topsection1">
          <img
            className="logo"
            src="src/assets/ioc_logo.png"
            alt="Company Logo"
          />
          <h1>How Can We Help You?</h1>
        </div>
        <div className="searchsection">
          <input
            className="searchBar"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IoIosSearch
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={handleSearch}
          />
        </div>
      </section>

      <section className="midSection">
        <h1>Frequently Asked Questions</h1>
        {status === "loading" ? (
          <p>Loading...</p>
        ) : status === "failed" ? (
          <p>Error: {error}</p>
        ) : (
          <ul className="faqList">
            {search
              ? searchResults.map((q, index) => (
                  <li key={index} className="faqItem">
                    <h3>{q.Title}</h3>
                    <p>{q.Description}</p>
                  </li>
                ))
              : topPosts.map((q, index) => (
                  <li key={index} className="faqItem">
                    <h3>{q.Title}</h3>
                    <p>{q.Description}</p>
                  </li>
                ))}
          </ul>
        )}
      </section>

      <section className="BottomSection">
        <h2>Departments</h2>
        <div className="departmentsContainer">
          {["HR", "IT Support", "Finance", "Admin", "Operations"].map(
            (dept, index) => (
              <div key={index} className="departmentBox">
                <p>{dept}</p>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default Homepage;
