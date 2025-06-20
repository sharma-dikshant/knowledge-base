import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for top posts
export const fetchTopPosts = createAsyncThunk("posts/fetchTopPosts", async () => {
  const response = await axios.get("http://localhost:6005/api/post/getTopfivePosts");
  return response.data.topPosts;
});

// Thunk for departments
export const fetchDepartments = createAsyncThunk("departments/fetchDepartments", async () => {
  const response = await axios.get("http://localhost:6005/api/Departments/getAllDepartment");
  return response.data;
});

// Thunk for search
export const searchPosts = createAsyncThunk("posts/searchPosts", async (query) => {
  const encodedQuery = encodeURIComponent(query);
  console.log("Search Query:", encodedQuery);
  const response = await axios.get(`http://localhost:6005/api/post/search?query=${encodedQuery}`);
  console.log(response.data);
  return response.data.posts;
});

// Post Slice
const postSlice = createSlice({
  name: "posts",
  initialState: {
    topPosts: [],
    searchResults: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopPosts.fulfilled, (state, action) => {
        state.topPosts = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchTopPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  },
});

// Department Slice
const departmentSlice = createSlice({
  name: "departments",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.Departments = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export reducers
export const postReducer = postSlice.reducer;
export const departmentReducer = departmentSlice.reducer;
