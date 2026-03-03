import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../../../../config';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.backendUrl}/admin/getAllBooks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`,
        },
      });
      
      if (res.status === 200) {
        setBooks(res.data.books);
      } else {
        toast.error('Failed to fetch books', {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Something went wrong while fetching books', {
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyBook = async (bookId) => {
    try {
      const res = await axios.post(
        `${config.backendUrl}/admin/verifyBook`,
        { bookId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (res.status === 200) {
        toast.success('Book verified successfully!', {
          position: 'top-center',
        });
        fetchBooks();
      } else {
        toast.error(res.data.msg || 'Failed to verify book', {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error verifying book:', error);
      toast.error('Something went wrong during verification', {
        position: 'top-center',
      });
    }
  };

  const deleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const res = await axios.delete(
          `${config.backendUrl}/admin/deleteBook/${bookId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('Token')}`,
            },
          }
        );
        
        if (res.status === 200) {
          toast.success('Book deleted successfully!', {
            position: 'top-center',
          });
          fetchBooks();
        } else {
          toast.error(res.data.msg || 'Failed to delete book', {
            position: 'top-center',
          });
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        toast.error('Something went wrong during deletion', {
          position: 'top-center',
        });
      }
    }
  };

  // Filter books based on status and search term
  const filteredBooks = books.filter((book) => {
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'verified' && book.isVerified) || 
      (filterStatus === 'unverified' && !book.isVerified);
    
    const matchesSearch = 
      book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4 adminpanel dark:bg-gray-800 dark:text-white">
      <h1 className="text-4xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">Books Management</h1>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Books</option>
            <option value="verified">Verified</option>
            <option value="unverified">Pending Verification</option>
          </select>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title, author..."
            className="p-2 pl-8 border rounded-md w-full md:w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-2 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 text-center">
          <p className="text-lg">No books found</p>
        </div>
      ) : (
        <>
          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentItems.map((book) => (
              <div
                key={book._id}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden flex flex-col h-full transition-transform hover:scale-105"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={book.bookimage || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={book.bookTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold mb-1 truncate dark:text-white">{book.bookTitle}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      book.isVerified ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {book.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">By: {book.author}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Edition: {book.edition}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Price: ₹{book.price}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Qty: {book.Quantity}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {book.genres.map((genre, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full dark:text-gray-200">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between">
                    {!book.isVerified && (
                      <button
                        onClick={() => verifyBook(book._id)}
                        className="px-3 py-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors dark:bg-emerald-600 dark:hover:bg-emerald-700"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => deleteBook(book._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors dark:bg-red-600 dark:hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-l-md border ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                  } dark:border-gray-600`}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => paginate(idx + 1)}
                    className={`px-3 py-1 border-t border-b ${
                      currentPage === idx + 1
                        ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                    } dark:border-gray-600`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-r-md border ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                  } dark:border-gray-600`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Books;