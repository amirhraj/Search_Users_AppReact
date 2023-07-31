import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://api.github.com';

const SearchUsers = () => {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('followers');
  const [ascending, setAscending] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleAscendingChange = (event) => {
    setAscending(event.target.checked);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`${API_BASE_URL}/search/users`, {
        params: {
          q: query,
          sort: sortBy,
          order: ascending ? 'asc' : 'desc',
          per_page: 10,
          page: currentPage,
        },
      });
      setUsers(response.data.items);
      setTotalPages(Math.ceil(response.data.total_count / 10));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="query">Search Users:</label>
        <input type="text" id="query" value={query} onChange={handleQueryChange} />
        <div>
          <label htmlFor="sortBy">Sort By:</label>
          <select id="sortBy" value={sortBy} onChange={handleSortByChange}>
            <option value="followers">Followers</option>
            <option value="repositories">Repositories</option>
          </select>
          <label htmlFor="ascending">Ascending:</label>
          <input type="checkbox" id="ascending" checked={ascending} onChange={handleAscendingChange} />
        </div>
        <button type="submit">Search</button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <div>
              <h3>{user.login}</h3>
              <p>{user.html_url}</p>
            </div>
          </li>
        ))}
      </ul>
      <div>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <button key={pageNumber} onClick={() => handlePageChange(pageNumber)}>
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchUsers;
