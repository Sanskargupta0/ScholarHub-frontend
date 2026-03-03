import React, { useState, useEffect } from "react";
import { components } from "../../../../components";
import { toast } from "react-toastify";
import { CircleX, Eye, CircleCheckBig, AlertTriangle } from "lucide-react";
import axios from "axios";
import config from "../../../../config";

function Paper() {
  const [hideLastThreeColumns, setHideLastThreeColumns] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaper, setTotalPaper] = useState([]);
  const [showReset, setShowReset] = useState(false);
  const [reset, setReset] = useState(false);
  const [allCoursesData, setAllCoursesData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [paperData, setPaperData] = useState([]);
  const [paper, setPaper] = useState(null);
  const [description, setDescription] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicatePaper, setDuplicatePaper] = useState(null);
  const [filters, setFilters] = useState({
    semesterNumber: "",
    courseName: "",
    title: "",
    year: "",
  });

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const toggleLastThreeColumns = () => {
    setHideLastThreeColumns(!hideLastThreeColumns);
  };

  const getAllCourses = async () => {
    try {
      const res = await axios.get(`${config.backendUrl}/getCourses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      if (res.status === 200) {
        setAllCoursesData(res.data.courses);
      } else {
        toast.error(res.data.msg, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("Error in getCourses", error);
    }
  };

  const getSemester = async () => {
    try {
      const res = await axios.post(
        `${config.backendUrl}/getSemesters`,
        {
          courseId: allCoursesData.find(
            (course) => course.courseName === filters.courseName
          )?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        setSemesterData(res.data.semesters);
      } else {
        toast.error(res.data.msg, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("Error in getSemester", error);
    }
  };

  const getPaper = async () => {
    try {
      const res = await fetch(
        `${config.backendUrl}/getPendingPapers?page=${currentPage}&perPage=${rowsPerPage}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          body: JSON.stringify({
            filterdata: {
              paperTitle: filters.title,
              year: filters.year,
              courseId: allCoursesData.find(
                (course) => course.courseName === filters.courseName
              )?._id,
              semesterId: semesterData.find(
                (sem) => `${sem.semesterNumber}` === filters.semesterNumber
              )?._id,
            },
          }),
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        setTotalPaper(data.totalPapers);
        setPaperData(data.papers);
      } else {
        toast.error(data.msg, {
          position: "top-center",
        });
        setPaperData([]);
        setTotalPaper(0);
      }
    } catch (error) {
      console.log("Error in getPaper", error);
    }
  };

  const handleOpen = async (key) => {
    try {
      const res = await fetch(`${config.backendUrl}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
        body: JSON.stringify({ key }),
      });
      if (res.ok) {
        const data = await res.json();
        window.open(data, "_blank");
      } else {
        const data = await res.json();
        toast.error(data.msg, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("Error in handleOpen", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${config.backendUrl}/deletePaper`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
        body: JSON.stringify({ id, description }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(data.msg, {
          position: "top-center",
        });
        setPaperData(paperData.filter((paper) => paper._id !== id));
        setTotalPaper(totalPaper - 1);
        setPaper(null);
        setDescription("");
      } else {
        const data = await res.json();
        toast.error(data.msg, {
          position: "top-center",
        });
        setDescription("");
      }
    } catch (error) {
      console.log("Error in handleDelete", error);
    }
  };

  const checkDuplicatePaper = async (paperToCheck) => {
    try {
      const res = await fetch(`${config.backendUrl}/checkDuplicatePaper`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
        body: JSON.stringify({
          courseId: paperToCheck.courseId._id,
          semesterId: paperToCheck.semesterId._id,
          paperTitle: paperToCheck.paperTitle
        }),
      });
      
      const data = await res.json();
      
      if (res.status === 200 && data.exists) {
        setDuplicatePaper(data.paper);
        setIsDuplicate(true);
        return true;
      }
      return false;
    } catch (error) {
      console.log("Error in checkDuplicatePaper", error);
      return false;
    }
  };

  const handleVerificationStart = (paper) => {
    setPaper(paper);
    setIsAccept(true);
  };

  const handleAccept = async (id) => {
    try {
      // First check if the paper has a duplicate
      const paperToVerify = paperData.find(p => p._id === id);
      const hasDuplicate = await checkDuplicatePaper(paperToVerify);
      
      if (hasDuplicate) {
        setIsAccept(false); // Close the acceptance modal
        // The duplicate modal will open automatically due to isDuplicate state
        return;
      }
      
      // If no duplicate, proceed with verification
      const res = await fetch(`${config.backendUrl}/verifyPaper`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(data.msg, {
          position: "top-center",
        });
        setPaperData(paperData.filter((paper) => paper._id !== id));
        setTotalPaper(totalPaper - 1);
        setPaper(null);
      } else {
        const data = await res.json();
        toast.error(data.msg, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("Error in handleAccept", error);
    }
  };

  const handleAcceptWithReplacement = async () => {
    try {
      // First delete the duplicate paper
      if (duplicatePaper && duplicatePaper._id) {
        await fetch(`${config.backendUrl}/deletePaper`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          body: JSON.stringify({ 
            id: duplicatePaper._id, 
            description: "Replaced with a newer version" 
          }),
        });
      }
      
      // Then verify the new paper
      const res = await fetch(`${config.backendUrl}/verifyPaper`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
        body: JSON.stringify({ id: paper._id }),
      });
      
      if (res.ok) {
        const data = await res.json();
        toast.success("Paper verified and replaced the existing one", {
          position: "top-center",
        });
        setPaperData(paperData.filter((p) => p._id !== paper._id));
        setTotalPaper(totalPaper - 1);
        setIsDuplicate(false);
        setPaper(null);
        setDuplicatePaper(null);
      } else {
        const data = await res.json();
        toast.error(data.msg, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("Error in handleAcceptWithReplacement", error);
      toast.error("Failed to replace the paper", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  useEffect(() => {
    if (filters.courseName) {
      getSemester();
    }
  }, [filters.courseName]);

  useEffect(() => {
    getPaper();
    if (
      filters.courseName ||
      filters.semesterNumber ||
      filters.title ||
      filters.year
    ) {
      setShowReset(true);
    } else {
      setShowReset(false);
    }
  }, [rowsPerPage, currentPage, filters]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const totalPages = Math.ceil(totalPaper / rowsPerPage);
  return (
    <div className="container mx-auto p-4 adminpanel dark:bg-gray-800 dark:text-white">
      <h1 className="text-3xl font-semibold mb-6 dark:text-white">
        Paper Pending for Verification
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={toggleLastThreeColumns}
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {hideLastThreeColumns ? "Show" : "Hide"} Columns
        </button>

        <div className="flex items-center space-x-2">
          <label htmlFor="rowsPerPage" className="text-gray-700 font-semibold dark:text-gray-300">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            className="border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg mt-6">
        <table className="min-w-full bg-white dark:bg-gray-700">
          <thead>
            <tr className="bg-gray-800 text-white text-sm uppercase leading-normal">
              <th className="py-3 px-6 text-left">Course Name</th>
              {!hideLastThreeColumns && (
                <th className="py-3 px-6 text-left">Course Code</th>
              )}
              <th className="py-3 px-6 text-left">Semester</th>
              <th className="py-3 px-6 text-left">Paper Title</th>
              <th className="py-3 px-6 text-left">Year</th>
              {!hideLastThreeColumns && (
                <>
                  <th className="py-3 px-6 text-left">Uploaded By</th>
                  <th className="py-3 px-6 text-left">Time</th>
                </>
              )}
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm dark:text-gray-200">
            <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-900">
              <td className="py-3 px-6">
                <components.Dropdown
                  placeholder="Course Name"
                  options={allCoursesData.map((course) => course.courseName)}
                  setFilters={setFilters}
                  filterKey="courseName"
                  reset={reset}
                  setReset={setReset}
                />
              </td>
              {!hideLastThreeColumns && (
                <td className="py-3 px-6">
                  <span className="font-semibold dark:text-gray-300">
                    {allCoursesData.find(
                      (course) => course.courseName === filters?.courseName
                    )?.courseCode || "Course not found"}
                  </span>
                </td>
              )}
              <td className="py-3 px-6">
                <components.Dropdown
                  placeholder="Semester"
                  options={semesterData.map((sem) => `${sem.semesterNumber}`)}
                  setFilters={setFilters}
                  filterKey="semesterNumber"
                  reset={reset}
                  setReset={setReset}
                />
              </td>
              <td className="py-3 px-6">
                <input
                  className="border rounded px-2 py-1 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Paper Title"
                  type="text"
                  title="Paper Title"
                  value={filters.title}
                  onChange={(e) =>
                    setFilters({ ...filters, title: e.target.value })
                  }
                />
              </td>
              <td className="py-3 px-6">
                <components.Dropdown
                  placeholder="Year"
                  options={Array.from(
                    { length: new Date().getFullYear() - 2012 },
                    (_, i) => `${new Date().getFullYear() - i}`
                  )}
                  setFilters={setFilters}
                  filterKey="year"
                  reset={reset}
                  setReset={setReset}
                />
              </td>
              {!hideLastThreeColumns && (
                <>
                  <td className="py-3 px-6"></td>
                  <td className="py-3 px-6"></td>
                </>
              )}
              <td className="py-3 px-6">
                <div className="flex items-center space-x-2">
                  {showReset && (
                    <button
                      className="buttonrpt dark:bg-gray-600 dark:hover:bg-gray-500"
                      onClick={() => {
                        setFilters({
                          semesterNumber: "",
                          courseName: "",
                          title: "",
                          year: "",
                        });
                        setSemesterData([]);
                        setShowReset(false);
                        setReset(true);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        viewBox="0 0 20 20"
                        height="20"
                        fill="none"
                        className="svg-icon"
                      >
                        <g
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          stroke="#ff342b"
                        >
                          <path d="m3.33337 10.8333c0 3.6819 2.98477 6.6667 6.66663 6.6667 3.682 0 6.6667-2.9848 6.6667-6.6667 0-3.68188-2.9847-6.66664-6.6667-6.66664-1.29938 0-2.51191.37174-3.5371 1.01468"></path>
                          <path d="m7.69867 1.58163-1.44987 3.28435c-.18587.42104.00478.91303.42582 1.0989l3.28438 1.44986"></path>
                        </g>
                      </svg>
                      <span className="lable">Reset</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
            {paperData.map((paper, index) => (
              <tr
                key={paper._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-200 dark:bg-gray-800" : "bg-white dark:bg-gray-700"
                } border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600`}
              >
                <td className="py-3 px-6">{paper.courseId.courseName}</td>
                {!hideLastThreeColumns && (
                  <td className="py-3 px-6">{paper.courseId.courseCode}</td>
                )}
                <td className="py-3 px-6">{paper.semesterId.semesterNumber}</td>
                <td className="py-3 px-6">{paper.paperTitle}</td>
                <td className="py-3 px-6">{paper.year}</td>
                {!hideLastThreeColumns && (
                  <>
                    <td className="py-3 px-6">
                      {paper.uploadedBy.firstName}&nbsp;
                      {paper.uploadedBy.lastName}
                    </td>
                    <td className="py-3 px-6">
                      {new Date(paper.uploadedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      {new Date(paper.uploadedAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </>
                )}
                <td className="py-3 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all duration-200 flex items-center justify-center"
                      title="Accept Paper"
                      onClick={() => handleVerificationStart(paper)}
                    >
                      <CircleCheckBig className="w-5 h-5" />
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-all duration-200 flex items-center justify-center ml-2"
                      onClick={() => {
                        setIsDelete(true);
                        setPaper(paper);
                      }}
                      title="Reject Paper"
                    >
                      <CircleX className="w-5 h-5" />
                    </button>
                    <button
                      className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-all duration-200 flex items-center justify-center ml-2 shadow-md hover:shadow-lg transform hover:scale-105"
                      onClick={() => handleOpen(paper.key)}
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      <span className="label">View</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 mb-4 flex justify-between items-center gap-4">
        <div>
          <span className="text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-300">
            Showing {indexOfFirstRow + 1} to{" "}
            {Math.min(indexOfLastRow, totalPaper)} of {totalPaper} entries
          </span>
        </div>
        <components.Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {isDelete ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-out">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 transform transition-transform duration-300 ease-out scale-105 dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Confirm Paper Rejection
            </h2>

            <div className="mb-6 text-gray-600 dark:text-gray-300">
              <p className="mb-2">
                Are you sure you want to Reject this paper{" "}
                <span className="font-semibold">{paper?.paperTitle}?</span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Course Name: {paper.courseId.courseName}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Course Code: {paper.courseId.courseCode}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Semester: {paper.semesterId.semesterNumber}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Year: {paper.year}</span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Uploaded By: {paper.uploadedBy.firstName}{" "}
                  {paper.uploadedBy.lastName}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Uploaded At:</span>{" "}
                {new Date(paper.uploadedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                {new Date(paper.uploadedAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2 dark:text-gray-300"
                  htmlFor="description"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description for rejection If Any Note: This will be sent to the user"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  setIsDelete(false);
                  handleDelete(paper._id);
                }}
              >
                Confirm
              </button>

              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  setIsDelete(false);
                  setPaper(null);
                  setDescription("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {isAccept ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-out">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 transform transition-transform duration-300 ease-out scale-105 dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Confirm Paper Acceptance
            </h2>

            <div className="mb-6 text-gray-600 dark:text-gray-300">
              <p className="mb-2">
                Are you sure you want to Accept this paper{" "}
                <span className="font-semibold">{paper?.paperTitle}?</span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Course Name: {paper.courseId.courseName}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Course Code: {paper.courseId.courseCode}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Semester: {paper.semesterId.semesterNumber}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Year: {paper.year}</span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Uploaded By: {paper.uploadedBy.firstName}{" "}
                  {paper.uploadedBy.lastName}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Uploaded At:</span>{" "}
                {new Date(paper.uploadedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                {new Date(paper.uploadedAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  setIsAccept(false);
                  handleAccept(paper._id);
                }}
              >
                Confirm
              </button>

              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  setIsAccept(false);
                  setPaper(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {isDuplicate ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-out">
          <div className="bg-white p-6 rounded-lg shadow-xl w-120 max-w-3xl transform transition-transform duration-300 ease-out scale-105 dark:bg-gray-800">
            <div className="flex items-center mb-4 text-yellow-600 dark:text-yellow-400">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                Duplicate Paper Found
              </h2>
            </div>

            <div className="mb-6 text-gray-600 dark:text-gray-300">
              <p className="mb-4">
                A paper with the same course, semester, and title already exists in the system.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-gray-300 rounded-md dark:border-gray-600">
                  <h3 className="text-lg font-bold mb-2 text-blue-600 dark:text-blue-400">New Paper</h3>
                  <p className="mb-2">
                    <span className="font-medium">Paper Title:</span> {paper?.paperTitle}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Course:</span> {paper?.courseId.courseName} ({paper?.courseId.courseCode})
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Semester:</span> {paper?.semesterId.semesterNumber}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Year:</span> {paper?.year}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Uploaded By:</span> {paper?.uploadedBy.firstName} {paper?.uploadedBy.lastName}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Uploaded At:</span>{" "}
                    {new Date(paper?.uploadedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg mt-2"
                    onClick={() => handleOpen(paper?.key)}
                  >
                    <Eye className="w-4 h-4 mr-2 inline" />
                    View Paper
                  </button>
                </div>
                
                <div className="p-4 border border-gray-300 rounded-md dark:border-gray-600">
                  <h3 className="text-lg font-bold mb-2 text-green-600 dark:text-green-400">Existing Paper</h3>
                  <p className="mb-2">
                    <span className="font-medium">Paper Title:</span> {duplicatePaper?.paperTitle}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Course:</span> {duplicatePaper?.courseId.courseName} ({duplicatePaper?.courseId.courseCode})
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Semester:</span> {duplicatePaper?.semesterId.semesterNumber}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Year:</span> {duplicatePaper?.year}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Verified:</span> Yes
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Uploaded By:</span> {duplicatePaper?.uploadedBy?.firstName} {duplicatePaper?.uploadedBy?.lastName}
                  </p>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg mt-2"
                    onClick={() => handleOpen(duplicatePaper?.key)}
                  >
                    <Eye className="w-4 h-4 mr-2 inline" />
                    View Paper
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => handleAcceptWithReplacement()}
              >
                Replace Existing & Accept
              </button>

              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  setIsDuplicate(false);
                  setPaper(null);
                  setDuplicatePaper(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Paper;
