import { useState } from "react";
import axios from "axios";
import LoginForm from "./../Components/LoginForm";
import SignupForm from "./../Components/SignupForm";
import { Box, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";

function AuthPage() {
  const [authMethod, setAuthMethod] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  async function onLogin(credentials) {
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
    } catch (error) {
      toast.error("Login Failed!");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  async function onSignup(credentials) {
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

  return (
    <div>
      {authMethod === "login" &&
        (isLoading ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          <LoginForm setAuthMethod={setAuthMethod} onLogin={onLogin} />
        ))}
      {authMethod === "signup" && (
        <SignupForm setAuthMethod={setAuthMethod} onSignup={onSignup} />
      )}
    </div>
  );
}

export default AuthPage;
