import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import MainBody from "./ui/MainBody";
import Userpage from "./pages/Userpage";
import Homepage from "./pages/Homepage";
import AdminHomepage from "./pages/AdminHomepage";
import Moderator from "./pages/Modetator";
// import SearchPage from "./pages/SearchPage";
import AuthPage from "./pages/AuthPage";
import { Toaster } from "react-hot-toast";
import PostPage from "./pages/PostPage";

import loader from "./utils/dataLoader";
import PostVault from "./pages/PostVault";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainBody />, // layout wrapper
    loader: loader.loadUser, // called before any child loads
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "home",
        element: <Homepage />,
      },
      {
        path: "u/:id",
        element: <Userpage />,
      },
      {
        path: "post/:postId",
        element: <PostPage />,
        loader: loader.loadPostDetails,
      },
      {
        path: "admin",
        element: <AdminHomepage />,
        loader: loader.loadAllUsers,
      },
      {
        path: "moderator",
        element: <Moderator />,
      },
      // {
      //   path: "search",
      //   element: <SearchPage />,
      // },
      {
        path: "/post-vault",
        element: <PostVault />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />, // not wrapped in MainBody
  },
  {
    path: "*",
    element: <h1>Page Not Found | 404</h1>,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;
