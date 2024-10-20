import React, { useState, useRef, useEffect } from "react";

const DropDown = ({
  placeholder = "Select an option",
  options = [],
  setFilters = () => {},
  filterKey = "",
  reset = "",
  setReset = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const optionsRef = useRef([]);

  // Filter options based on search value
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Reset focused index when filtered options change
  useEffect(() => {
    if (filteredOptions.length > 0 && focusedIndex === -1) {
      setFocusedIndex(0);
    } else if (focusedIndex >= filteredOptions.length) {
      setFocusedIndex(filteredOptions.length - 1);
    }
  }, [filteredOptions, focusedIndex]);

  // Scroll focused option into view
  useEffect(() => {
    if(reset) {
      setSelectedOption("");
      setReset(false);
      return
    };
    if (focusedIndex >= 0 && optionsRef.current[focusedIndex]) {
      optionsRef.current[focusedIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [focusedIndex, reset]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle option selection or deselection
  const handleOptionClick = (option) => {
    if (option === selectedOption) {
      // Deselect option
      setSelectedOption("");
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterKey]: "",
      }));
    } else {
      // Select option
      setSelectedOption(option);
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterKey]: option,
      }));
    }
    setIsOpen(false);
    setSearchValue("");
    setFocusedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    const lastIndex = filteredOptions.length - 1;

    if (!isOpen && (event.key === "Enter" || event.key === "ArrowDown")) {
      event.preventDefault();
      setIsOpen(true);
      setFocusedIndex(0);
      return;
    }

    if (isOpen) {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (focusedIndex < lastIndex) {
            setFocusedIndex((prevIndex) => prevIndex + 1);
          } else {
            setFocusedIndex(0); // Wrap to first option
          }
          break;

        case "ArrowUp":
          event.preventDefault();
          if (focusedIndex > 0) {
            setFocusedIndex((prevIndex) => prevIndex - 1);
          } else {
            setFocusedIndex(lastIndex); // Wrap to last option
          }
          break;

        case "Enter":
          event.preventDefault();
          if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            handleOptionClick(filteredOptions[focusedIndex]);
          }
          break;

        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          break;

        default:
          // If user types, maintain focus position
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
          break;
      }
    }
  };

  return (
    <div
      className="relative w-64"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className="border rounded-md p-2 bg-white cursor-pointer flex justify-between items-center"
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => {
            if (searchInputRef.current) {
              searchInputRef.current.focus();
            }
            // Focus on the selected option, if any
            const index = filteredOptions.indexOf(selectedOption);
            if (index !== -1) {
              setFocusedIndex(index);
            } else {
              setFocusedIndex(0);
            }
          }, 0);
        }}
      >
        <span className="text-gray-700">{selectedOption || placeholder}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg">
          <div className="p-2">
            <input
              ref={searchInputRef}
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-60 overflow-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                ref={(el) => (optionsRef.current[index] = el)}
                className={`px-4 py-2 cursor-pointer ${
                  selectedOption === option ? "bg-gray-50" : ""
                } ${
                  focusedIndex === index ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                {option}
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="px-4 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropDown;
