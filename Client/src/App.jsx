import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainBody from "./Components/MainBody";
import Userpage from "./Pages/Userpage";
import Homepage from "./Pages/Homepage";
import AdminHomepage from "./Pages/AdminHomepage";
import Moderator from "./Pages/Modetator";
import SearchPage from "./Pages/SearchPage";
import AuthPage from "./Pages/AuthPage";
import { Toaster } from "react-hot-toast";
import PostPage from "./Pages/PostPage";

const router = createBrowserRouter([
  {
    element: <MainBody />,
    children: [
      {
        path: "/",
        index: true,
        element: <Homepage />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        path: "/u/:id",
        element: <Userpage />,
      },
      {
        path: "/post/:id",
        element: <PostPage />,
      },
      {
        path: "/admin",
        element: <AdminHomepage />,
      },
      {
        path: "/moderator",
        element: <Moderator />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
    ],
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
