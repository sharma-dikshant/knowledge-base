import { useEffect, useState } from "react";
import "./Pagecss/Homepage.css";

import { Pagination } from "@mui/material";
import SelectElement from "../ui/SelectElement.jsx";
import ModalWindow from "../ui/ModalWindow.jsx";
import PostSection from "../Components/PostSection.jsx";
import CreatePostForm from "../Components/CreatePostForm.jsx";
import { useOutletContext, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import SearchBar from "../Components/SearchBar.jsx";

import API_ROUTES from "../services/api.js";

const filterOptions = [
  { name: "Recent", value: "-createdAt" },
  { name: "Popular", value: "-votes" },
];

function Homepage() {
  const user = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const page = parseInt(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "-createdAt";
  const department = searchParams.get("department") || "all";

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await axios.get(API_ROUTES.departments.getAll);
        const options = response.data.departments.map((dept) => ({
          name: dept.name,
          value: dept.name,
        }));
        setDepartmentOptions([{ name: "All", value: "all" }, ...options]);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch departments");
      }
    }

    fetchDepartments();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const urlParams = new URLSearchParams(searchParams.toString());
        urlParams.set("comments", 5);
        urlParams.set("solutions", 1);

        const response = await axios.get(
          `${API_ROUTES.posts.getAll}?${urlParams.toString()}`,
          {
            withCredentials: true,
          }
        );

        setPosts(response.data?.data || []);
      } catch (error) {
        setPosts([]);
        console.error(error);
        toast.error("Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [searchParams]);

  function handleParamsChange(newParams) {
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, ...newParams });
  }

  return (
    <div className="homepageBody">
      {/* Top Section with background image */}
      <section className="topSection">
        <div className="overlay">
          <div className="topContent">
            <h1 className="homepageTitle">How Can We Help You?</h1>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Mid Section with Filters */}
      <section className="midSection">
        <div className="midHeader">
          <h2>Frequently Asked Questions</h2>
          <div className="filters">
            <SelectElement
              label="Department"
              value={department}
              setValue={(val) => handleParamsChange({ department: val })}
              options={departmentOptions}
            />
            <SelectElement
              label="Filter"
              value={sort}
              setValue={(val) => handleParamsChange({ sort: val })}
              options={filterOptions}
            />
            {user && (
              <ModalWindow text="Add New Post">
                <CreatePostForm />
              </ModalWindow>
            )}
          </div>
        </div>

        {/* Posts */}
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <PostSection posts={posts} />
        )}
      </section>

      {/* Pagination */}
      <div className="paginationWrapper">
        <Pagination
          count={10} // Replace with dynamic count from backend
          shape="rounded"
          page={page}
          onChange={(event, value) => handleParamsChange({ page: value })}
        />
      </div>
    </div>
  );
}

export default Homepage;
