import axios from "axios";

async function loadUser() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/user/getUser`,
      { withCredentials: true }
    );

    return response.data.data;
  } catch (error) {
    console.log(error);
  }
}

export default loadUser;
