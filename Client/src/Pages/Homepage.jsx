import { useEffect, useState } from "react";
import "./Pagecss/Homepage.css";
import { IoIosSearch } from "react-icons/io";

import { Pagination } from "@mui/material";
import SelectElement from "../ui/SelectElement.jsx";
import ModalWindow from "../ui/ModalWindow.jsx";
import PostSection from "../Components/PostSection.jsx";
import CreatePostForm from "./../Components/CreatePostForm.jsx";
import { useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";

const departmentOptions = [
  {
    name: "All",
    value: "all",
  },
  {
    name: "HR",
    value: "hr",
  },
  {
    name: "Sales",
    value: "sales",
  },
  {
    name: "Marketing",
    value: "marketing",
  },
];

const filterOptions = [
  { name: "Recent", value: "-createdAt" },
  {
    name: "Popular",
    value: "-votes",
  },
];

function Homepage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [sort, setSort] = useState("createdAt");
  const [department, setDepartment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const queryString = useLocation().search;

  useEffect(() => {
    setPage(parseInt(searchParams.get("page") || 1));
    setSort(searchParams.get("sort") || "createdAt");
    setDepartment(searchParams.get("department") || "all");
  }, [searchParams]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/post/getPosts${queryString}`,
          {
            withCredentials: true,
          }
        );
        setPosts(response.data?.data || []);
      } catch (error) {
        setPosts([]);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [queryString]);

  function handleParamsChange(newParam) {
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, ...newParam });
  }

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
          <IoIosSearch style={{ fontSize: "1.5rem", cursor: "pointer" }} />
        </div>
      </section>

      <section className="midSection">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1>Frequently Asked Questions</h1>
            <SelectElement
              label="Department"
              value={department}
              setValue={(e) => handleParamsChange({ department: e })}
              options={departmentOptions}
            />
            <SelectElement
              label="Filter"
              value={sort}
              setValue={(e) => handleParamsChange({ sort: e })}
              options={filterOptions}
            />
          </div>
          <div>
            <ModalWindow text="Add New Post">
              <CreatePostForm />
            </ModalWindow>
          </div>
        </div>
        {isLoading ? <div>loading....</div> : <PostSection posts={posts} />}
      </section>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={10}
          shape="rounded"
          defaultPage={page}
          onChange={(event, value) => handleParamsChange({ page: value })}
        />
      </div>
    </div>
  );
}

export default Homepage;
