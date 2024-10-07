import React, { useEffect, useState } from 'react';
import config from '../../../../config';
const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const queryParams = new URLSearchParams({
        page,
        perPage,
        resetFilters: !Object.keys(filterData).length,
      }).toString();

      const response = await fetch(`${config.backendUrl}/admin/getAllUsers?${queryParams}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('Token')}` // Assuming token-based auth
        },
        body: JSON.stringify(filterData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUsers(data.users || data); // Adjust based on your response format
        setTotalPages(data.totalPages || Math.ceil(data.totalUsers / perPage));
      } else {
        const errorData = await response.json();
        setError(errorData.msg || 'Error fetching users');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users');
    }
  };

  // Handle page and per-page changes
  useEffect(() => {
    fetchUsers();
  }, [page, perPage, filterData]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  // Render users in table
  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          className="border rounded px-4 py-2"
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Filter by Email"
          className="border rounded px-4 py-2"
          onChange={handleFilterChange}
        />
        <button onClick={() => fetchUsers()} className="bg-blue-500 text-white px-4 py-2 rounded">
          Apply Filters
        </button>
      </div>

      {/* User Table */}
      <table className="table-auto w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length ? (
            users.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{user.firstName} {user.lastName}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.isAdmin ? 'Admin' : 'User'}</td>
                <td className="border px-4 py-2">
                  <button className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => deleteUser(user._id)}>
                    Delete
                  </button>
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded">
                    Update
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <select
          value={perPage}
          onChange={(e) => setPerPage(parseInt(e.target.value))}
          className="border rounded px-4 py-2"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default AdminPanel;
