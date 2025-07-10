import axios from "axios";
import toast from "react-hot-toast";
import { redirect } from "react-router-dom";
import API_ROUTES from "../services/api";

async function loadUser() {
  try {
    const response = await axios.get(`${API_ROUTES.users.getLogin}`, {
      withCredentials: true,
    });
    const user = response.data?.data || null;
    if (!user) {
      toast.error("Not Authenticated!");
      throw new Error("Not Authenticated");
    }
    return user;
  } catch (error) {
    console.log(error);
    throw redirect("/auth");
  }
}

async function loadPostDetails({ params, request }) {
  const postId = params.postId;
  const url = new URL(request.url); // <== extract query from URL

  // Get ?comments=10&solutions=10 from query string
  const commentLimit = url.searchParams.get("comments") || 10;
  const solutionLimit = url.searchParams.get("solutions") || 10;

  try {
    const response = await axios.get(
      `${API_ROUTES.posts.details(
        postId
      )}?comments=${commentLimit}&solutions=${solutionLimit}`,
      { withCredentials: true }
    );

    return response.data.data;
  } catch (error) {
    toast.error("Failed to fetch Post!");
    console.error(error);
  }
}

// async function protected(allowedUser = []) {
//   const user = await loadUser();
//   if (allowedUser.length == 0) return true;
//   if (allowedUser.length > 0 && allowedUser.includes(user.role)) return true;
//   return false;
// }

async function loadAllUsers() {
  const user = await loadUser();
  if (!user || user.role !== "admin") {
    toast.error("Please Login as admin!");
    return "please login as admin!";
  }

  const response = await axios.get(`${API_ROUTES.users.getAll}`, {
    withCredentials: true,
  });

  return response.data.data;
}

export default { loadUser, loadPostDetails, loadAllUsers };
