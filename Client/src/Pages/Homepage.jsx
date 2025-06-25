import { useEffect, useState } from "react";
import "./Pagecss/Homepage.css";
import { IoIosSearch } from "react-icons/io";

import { Pagination } from "@mui/material";
import SelectElement from "../ui/SelectElement.jsx";
import ModalWindow from "../ui/ModalWindow.jsx";
import PostSection from "../Components/PostSection.jsx";
import CreatePostForm from "./../Components/CreatePostForm.jsx";
import {
  useLocation,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const filterOptions = [
  { name: "Recent", value: "-createdAt" },
  { name: "Popular", value: "-votes" },
];

function Homepage() {
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [sort, setSort] = useState(searchParams.get("sort") || "-createdAt");
  const [department, setDepartment] = useState(
    searchParams.get("department") || "all"
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/department/all`
        );
        const d = response.data.departments.map((dept) => ({
          name: dept.name,
          value: dept.name,
        }));
        setDepartmentOptions([{ name: "All", value: "all" }, ...d]);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch department");
      }
    }
    fetchDepartments();
  }, []);

  useEffect(() => {
    setPage(parseInt(searchParams.get("page") || 1));
    setSort(searchParams.get("sort") || "-createdAt");
    setDepartment(searchParams.get("department") || "all");
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const urlParams = new URLSearchParams(searchParams.toString());
        urlParams.set("comments", 5);

        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/post/getPosts?${urlParams.toString()}`,
          {
            withCredentials: true,
          }
        );
        setPosts(response.data?.data || []);
      } catch (error) {
        setPosts([]);
        console.log(error);
        toast.error("Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, [searchParams]);

  function handleParamsChange(newParams) {
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, ...newParams, page: 1 });
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
          <IoIosSearch
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={() => handleParamsChange({ search: searchQuery })}
          />
        </div>
      </section>

      <section className="midSection">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1>Frequently Asked Questions</h1>
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
          </div>
          {user && (
            <div>
              <ModalWindow text="Add New Post">
                <CreatePostForm />
              </ModalWindow>
            </div>
          )}
        </div>
        {isLoading ? <div>Loading...</div> : <PostSection posts={posts} />}
      </section>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={10} // Ideally should come from backend
          shape="rounded"
          page={page}
          onChange={(event, value) => handleParamsChange({ page: value })}
        />
      </div>
    </div>
  );
}

export default Homepage;
