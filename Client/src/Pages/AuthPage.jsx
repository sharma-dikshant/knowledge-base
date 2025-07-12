import { useState } from "react";
import axios from "axios";
import LoginForm from "../Components/LoginForm";
import SignupForm from "../Components/SignupForm";
import { Box, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API_ROUTES from "../services/api";

function AuthPage() {
  const [authMethod, setAuthMethod] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function onLogin(credentials) {
    try {
      setIsLoading(true);
      const response = await axios.post(API_ROUTES.auth.login, credentials, {
        withCredentials: true,
      });
      toast.success("Login Success!");
      navigate("/home");
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
      const response = await axios.post(API_ROUTES.auth.signup, credentials, {
        withCredentials: true,
      });
      toast.success("Sign Up Success!");
    } catch (error) {
      console.log(error);
      toast.error("Sign Up Failed!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: "20px",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
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
