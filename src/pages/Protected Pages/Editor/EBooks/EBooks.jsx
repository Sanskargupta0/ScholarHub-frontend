import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../../../../config';

const EBooks = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUnverifiedEbooks();
  }, []);

  const fetchUnverifiedEbooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.backendUrl}/editor/getUnverifiedEbooks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`,
        },
      });
      
      if (res.status === 200) {
        setEbooks(res.data.ebooks);
      } else {
        toast.error('Failed to fetch unverified e-books', {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error fetching unverified e-books:', error);
      toast.error('Something went wrong while fetching e-books', {
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyEbook = async (ebookId) => {
    try {
      const res = await axios.post(
        `${config.backendUrl}/editor/verifyEbook`,
        { ebookId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (res.status === 200) {
        toast.success('E-Book verified successfully!', {
          position: 'top-center',
        });
        fetchUnverifiedEbooks();
      } else {
        toast.error(res.data.msg || 'Failed to verify e-book', {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error verifying e-book:', error);
      toast.error('Something went wrong during verification', {
        position: 'top-center',
      });
    }
  };

  const rejectEbook = async (ebookId) => {
    if (window.confirm('Are you sure you want to reject this e-book?')) {
      try {
        const res = await axios.delete(
          `${config.backendUrl}/editor/rejectEbook/${ebookId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('Token')}`,
            },
          }
        );
        
        if (res.status === 200) {
          toast.success('E-Book rejected successfully!', {
            position: 'top-center',
          });
          fetchUnverifiedEbooks();
        } else {
          toast.error(res.data.msg || 'Failed to reject e-book', {
            position: 'top-center',
          });
        }
      } catch (error) {
        console.error('Error rejecting e-book:', error);
        toast.error('Something went wrong during rejection', {
          position: 'top-center',
        });
      }
    }
  };

  // Filter ebooks based on search term
  const filteredEbooks = ebooks.filter((ebook) => 
    ebook.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ebook.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ebook.description && ebook.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEbooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEbooks.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to preview e-book
  const previewEbook = async (ebookId) => {
    try {
      const res = await axios.get(`${config.backendUrl}/getEbookPreviewUrl/${ebookId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`,
        },
      });
      
      if (res.status === 200 && res.data.previewUrl) {
        window.open(res.data.previewUrl, '_blank');
      } else {
        toast.error('Failed to preview e-book', {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error previewing e-book:', error);
      toast.error('Something went wrong during preview', {
        position: 'top-center',
      });
    }
  };

  return (
    <div className="container mx-auto p-4 editorpanel dark:bg-gray-800 dark:text-white">
      <h1 className="text-4xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">E-Book Verification</h1>

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
      ) : filteredEbooks.length === 0 ? (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 text-center">
          <p className="text-lg">No e-books pending verification</p>
        </div>
      ) : (
        <>
          {/* Ebooks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((ebook) => (
              <div
                key={ebook._id}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden flex flex-col transition-all hover:shadow-lg"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={ebook.bookimage || "https://via.placeholder.com/300x200?text=E-Book"}
                    alt={ebook.bookTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">{ebook.bookTitle}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">By: {ebook.author}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Edition: {ebook.edition}</p>
                  
                  {ebook.courseId && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Course:</span> {ebook.courseId.courseName || 'Unknown'}
                    </p>
                  )}
                  
                  {ebook.semesterId && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Semester:</span> {ebook.semesterId.semesterNumber || 'Unknown'}
                    </p>
                  )}
                  
                  {ebook.bookId && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
                        Linked to Physical Book
                      </span>
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {ebook.genres.map((genre, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full dark:text-gray-200">
                        {genre}
                      </span>
                    ))}
                  </div>
                  
                  {ebook.description && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold dark:text-gray-200">Description:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {ebook.description.length > 150 
                          ? `${ebook.description.substring(0, 150)}...` 
                          : ebook.description}
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex flex-wrap justify-between gap-2">
                    <button
                      onClick={() => previewEbook(ebook._id)}
                      className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => verifyEbook(ebook._id)}
                      className="px-3 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => rejectEbook(ebook._id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors dark:bg-red-600 dark:hover:bg-red-700"
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

export default EBooks;