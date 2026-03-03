import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../../../../config';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUnverifiedBooks();
  }, []);

  const fetchUnverifiedBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.backendUrl}/editor/getUnverifiedBooks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`,
        },
      });
      
      if (res.status === 200) {
        setBooks(res.data.books);
      } else {
        toast.error('Failed to fetch unverified books', {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error fetching unverified books:', error);
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
        `${config.backendUrl}/editor/verifyBook`,
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
        fetchUnverifiedBooks();
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

  const rejectBook = async (bookId) => {
    if (window.confirm('Are you sure you want to reject this book?')) {
      try {
        const res = await axios.delete(
          `${config.backendUrl}/editor/rejectBook/${bookId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('Token')}`,
            },
          }
        );
        
        if (res.status === 200) {
          toast.success('Book rejected successfully!', {
            position: 'top-center',
          });
          fetchUnverifiedBooks();
        } else {
          toast.error(res.data.msg || 'Failed to reject book', {
            position: 'top-center',
          });
        }
      } catch (error) {
        console.error('Error rejecting book:', error);
        toast.error('Something went wrong during rejection', {
          position: 'top-center',
        });
      }
    }
  };

  // Filter books based on search term
  const filteredBooks = books.filter((book) => 
    book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4 editorpanel dark:bg-gray-800 dark:text-white">
      <h1 className="text-4xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">Book Verification</h1>

      {/* Search Bar */}
      <div className="flex justify-end mb-6">
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
          <p className="text-lg">No books pending verification</p>
        </div>
      ) : (
        <>
          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((book) => (
              <div
                key={book._id}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden flex flex-col transition-all hover:shadow-lg"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={book.bookimage || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={book.bookTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">{book.bookTitle}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">By: {book.author}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Edition: {book.edition}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Price: ₹{book.price}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Quantity: {book.Quantity}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Return Required: {book.needToReturn ? 'Yes' : 'No'}</p>
                  
                  {book.courseId && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Course:</span> {book.courseId.courseName || 'Unknown'}
                    </p>
                  )}
                  
                  {book.semesterId && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Semester:</span> {book.semesterId.semesterNumber || 'Unknown'}
                    </p>
                  )}
                  
                  {book.eBookId && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
                        Linked to E-Book
                      </span>
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {book.genres.map((genre, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full dark:text-gray-200">
                        {genre}
                      </span>
                    ))}
                  </div>
                  
                  {book.description && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold dark:text-gray-200">Description:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {book.description.length > 150 
                          ? `${book.description.substring(0, 150)}...` 
                          : book.description}
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between">
                    <button
                      onClick={() => verifyBook(book._id)}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => rejectBook(book._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors dark:bg-red-600 dark:hover:bg-red-700"
                    >
                      Reject
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