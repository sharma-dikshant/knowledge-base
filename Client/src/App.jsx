import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainBody from "./Components/MainBody";
import Userpage from "./Pages/Userpage";
import Homepage from "./Pages/Homepage";
import AdminHomepage from "./Pages/AdminHomepage";
import Moderator from "./Pages/Modetator";
import SearchPage from "./Pages/SearchPage";

function App() {
  return (
    <div className="App">
      <Router>
        <MainBody>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/user" element={<Userpage />} />
            <Route path="/admin" element={<AdminHomepage />} />
            <Route path="/moderator" element={<Moderator />} />
            <Route path="/search" element={<SearchPage/>}/>

          </Routes>
        </MainBody>
      </Router>
    </div>
  );
}

export default App;
