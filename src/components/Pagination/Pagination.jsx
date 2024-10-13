import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const visiblePages = 3; // Number of pages to show around the current page
    let pages = [];

    // Always add first page
    pages.push(1);

    if (currentPage > visiblePages + 1) {
      pages.push('...');
    }

    // Add pages around current page
    for (let i = Math.max(2, currentPage - Math.floor(visiblePages / 2)); i <= Math.min(totalPages - 1, currentPage + Math.floor(visiblePages / 2)); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - visiblePages) {
      pages.push('...');
    }

    // Always add last page if it's not already included
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages.map((page, index) => (
      <React.Fragment key={index}>
        {page === '...' ? (
          <span className="w-8 h-8 flex items-center justify-center">...</span>
        ) : (
          <button
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentPage === page
                ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex items-center justify-center space-x-2 ">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
      >
        <ChevronLeft size={16} />
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;