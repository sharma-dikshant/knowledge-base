import {  useSelector } from "react-redux";

import "./Pagecss/Search.css";



const SearchPage = () => {
 
  const { searchResults, status, error } = useSelector((state) => state.posts);



  return (
    <div className="searchPageBody">
    

      <section className="midSection">
        <h1>Results </h1>
        {status === "loading" ? (
          <p>Loading...</p>
        ) : status === "failed" ? (
          <p>Error: {error}</p>
        ) : searchResults.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <ul className="faqList">
            {searchResults.map((result, index) => (
              <li key={index} className="faqItem">
                <h3>{result.Title}</h3>
                <p>{result.Description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default SearchPage;
