import axios from "axios";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

/**
 *      Authentication
 */

async function onLogin(credentials, setIsLoading) {
  try {
    setIsLoading(true);
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/login`,
      credentials,
      {
        withCredentials: true,
      }
    );
    toast.success("Login Success!");
    Navigate("/home");
  } catch (error) {
    toast.error("Login Failed!");
    console.log(error);
  } finally {
    setIsLoading(false);
  }
}

async function onSignup(credentials, setIsLoading) {
  try {
    setIsLoading(true);
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/signup`,
      credentials,
      {
        withCredentials: true,
      }
    );
    toast.success("Sign Up Success!");
  } catch (error) {
    console.log(error);
    toast.error("Sign Up Failed!");
  } finally {
    setIsLoading(false);
  }
}

async function handleLogout() {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    if (response) throw Navigate("/auth");
  } catch (error) {
    console.log(error);
  }
}

/**
 *      User
 */

/**
 *      Posts
 */

async function fetchPosts(setIsLoading, setPosts, searchParams) {
  try {
    setIsLoading(true);
    const urlParams = new URLSearchParams(searchParams.toString());
    urlParams.set("comments", 5);
    urlParams.set("solutions", 1);

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

/**
 *      Departments
 */

async function fetchDepartments(setisLoading, setDepartments) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/department/all`
    );
    const d = response.data.departments.map((dept) => ({
      name: dept.name,
      value: dept.name,
    }));
    setDepartments([{ name: "All", value: "all" }, ...d]);
  } catch (error) {
    console.log(error);
    toast.error("Failed to fetch department");
  }
}

export default {
  onLogin,
  onSignup,
  handleLogout,
  fetchPosts,
  fetchDepartments,
};
