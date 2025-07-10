import { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import SelectElement from "../ui/SelectElement";
import { MenuItem, Pagination, Select } from "@mui/material";
import PostVerificationSection from "../Components/PostVerificationSection";

import API_ROUTES from "../services/api";

const filterOptions = [
  { name: "Recent", value: "-createdAt" },
  { name: "Popular", value: "-votes" },
];

const statusOptions = [
  { name: "pending", value: 1 },
  { name: "approved", value: 2 },
  { name: "rejected", value: 3 },
];

function PostVault() {
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("1");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [department, setDepartment] = useState(
    searchParams.get("department") || "all"
  );

  useEffect(() => {
    const statusInQuery = searchParams.get("status");
    if (!statusInQuery) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("status", "1");
      setSearchParams(newParams);
    }
  }, []);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await axios.get(`${API_ROUTES.departments.getAll}`);
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
    async function fetchPosts() {
      const urlParams = new URLSearchParams(searchParams.toString());
      try {
        setIsLoading(true);
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
        console.log(error);
        toast.error("Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, [searchParams]);

  useEffect(() => {
    setPage(parseInt(searchParams.get("page") || 1));
    setDepartment(searchParams.get("department") || "all");
    setStatus(searchParams.get("status") || "1");
  }, [searchParams]);

  function handleParamsChange(newParams) {
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, ...newParams });
  }

  return (
    <div>
      <section className="midSection">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1>Post Vault</h1>
            <SelectElement
              label="Department"
              value={department}
              setValue={(val) => handleParamsChange({ department: val })}
              options={departmentOptions}
            />
            <SelectElement
              label="Status"
              value={status}
              setValue={(val) => handleParamsChange({ status: val })}
              options={statusOptions}
            />
            <Select
              onChange={(e) => handleParamsChange({ inactive: e.target.value })}
              defaultValue={"false"}
            >
              <MenuItem value="false">Active Posts</MenuItem>
              <MenuItem value="true">Inactive Posts</MenuItem>
            </Select>
          </div>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <PostVerificationSection posts={posts} />
        )}
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

export default PostVault;
