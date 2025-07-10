import axios from "axios";
import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import styles from "./Componentcss/searchBar.module.css";
import { Link } from "react-router-dom";
import API_ROUTES from "../services/api";

function SearchBar() {
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(text.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [text]);

  // Fetch results on searchQuery change
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `${API_ROUTES.posts.search}?query=${searchQuery}`,
          { withCredentials: true }
        );
        setResults(res.data.data || []);
        // console.log(res.data.data);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
        setShowDropdown(false);
      }
    };

    if (searchQuery.length > 2) {
      fetchResults();
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  const handleSelect = (post) => {
    setShowDropdown(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Search for help..."
          className={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <IoIosSearch className={styles.icon} />
      </div>

      {showDropdown && results.length > 0 && (
        <ul className={styles.dropdown}>
          {results.map((post) => (
            <li key={post._id} className={styles.dropdownItem}>
              <Link to={`/post/${post._id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && results.length === 0 && (
        <div className={styles.noResults}>No results found</div>
      )}
    </div>
  );
}

export default SearchBar;
