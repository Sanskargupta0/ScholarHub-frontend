import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const FileUploadButton = ({
  maxSizeMB = 20,
  onFileSelected = () => {},
  reset,
}) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    // Validate file type (only PDF allowed)
    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed!");
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSizeBytes) {
      toast.error(`File size exceeds the limit of ${maxSizeMB} MB`);
      return;
    }

    // Set the file and pass the file metadata to the parent via callback
    setFile(selectedFile);
    const fileData = {
      name: selectedFile.name,
      type: selectedFile.type,
      size: selectedFile.size,
    };
    onFileSelected(selectedFile);

    toast.success(`${selectedFile.name} selected successfully!`);
  };

  // Reset the file input if reset prop is true
  useEffect(() => {
    if (reset) {
      setFile(null);
      document.getElementById("fileInput").value = null; // Reset file input field
    }
  }, [reset]);

  return (
    <div className="file-upload-wrapper">
      <label htmlFor="fileInput" className="cursor-pointer">
        <button 
          type="button" 
          className="flex items-center px-6 py-3 bg-blue-500 text-white text-xs font-bold uppercase rounded-lg gap-3 shadow-md hover:shadow-lg transition-all duration-600 ease-in-out hover:bg-blue-600 focus:opacity-85 active:opacity-85 focus:shadow-none active:shadow-none dark:bg-blue-600 dark:hover:bg-blue-700"
          onClick={() => {
            document.getElementById("fileInput").click();
          }}
        >
          <svg
            aria-hidden="true"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
          >
            <path
              strokeWidth={2}
              stroke="#ffffff"
              d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth={2}
              stroke="#ffffff"
              d="M17 15V18M17 21V18M17 18H14M17 18H20"
            />
          </svg>
          ADD FILE
        </button>
      </label>
      <input
        type="file"
        accept="application/pdf"
        className="hidden"
        id="fileInput"
        onChange={handleFileChange}
      />

      {/* Show selected file name */}
      {file && (
        <div className="mt-2 text-black dark:text-white">
          <strong>Selected File:</strong> {file.name}
        </div>
      )}
    </div>
  );
};

export default FileUploadButton;
