import React, { useState, useEffect } from "react";
import { components } from "../../../../components";
import { toast } from "react-toastify";
import { CircleX, Eye, CircleCheckBig } from "lucide-react";
import axios from "axios";
import config from "../../../../config";

function Notes() {
  const [hideLastThreeColumns, setHideLastThreeColumns] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotes, setTotalNotes] = useState([]);
  const [showReset, setShowReset] = useState(false);
  const [reset, setReset] = useState(false);
  const [allCoursesData, setAllCoursesData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [notesData, setNotesData] = useState([]);
  const [notes, setNotes] = useState(null);
  const [description, setDescription] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
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

  const getNotes = async () => {
    try {
      const res = await fetch(
        `${config.backendUrl}/getPendingNotes?page=${currentPage}&perPage=${rowsPerPage}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          body: JSON.stringify({
            filterdata: {
              NotesTitle: filters.title,
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
        setTotalNotes(data.totalNotes);
        setNotesData(data.notes);
      } else {
        toast.error(data.msg, {
          position: "top-center",
        });
        setNotesData([]);
        setTotalNotes(0);
      }
    } catch (error) {
      console.log("Error in getNotes", error);
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
      const res = await fetch(`${config.backendUrl}/deleteNotes`, {
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
        setNotesData(notesData.filter((notes) => notes._id !== id));
        setTotalNotes(totalNotes - 1);
        setNotes(null);
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

  const handleAccept = async (id) => {
    try {
      const res = await fetch(`${config.backendUrl}/verifyNotes`, {
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
        setNotesData(notesData.filter((notes) => notes._id !== id));
        setTotalNotes(totalNotes - 1);
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

  useEffect(() => {
    getAllCourses();
  }, []);

  useEffect(() => {
    if (filters.courseName) {
      getSemester();
    }
  }, [filters.courseName]);

  useEffect(() => {
    getNotes();
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
  const totalPages = Math.ceil(totalNotes / rowsPerPage);
  return (
    <div className="container mx-auto p-4 adminpanel dark:bg-gray-800 dark:text-white">
      <h1 className="text-3xl font-semibold mb-6 dark:text-white">
        Notes Pending for Verification
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
              <th className="py-3 px-6 text-left">notes Title</th>
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
                  placeholder="notes Title"
                  type="text"
                  title="notes Title"
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
            {notesData.map((notes, index) => (
              <tr
                key={notes._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-200 dark:bg-gray-800" : "bg-white dark:bg-gray-700"
                } border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600`}
              >
                <td className="py-3 px-6">{notes.courseId.courseName}</td>
                {!hideLastThreeColumns && (
                  <td className="py-3 px-6">{notes.courseId.courseCode}</td>
                )}
                <td className="py-3 px-6">{notes.semesterId.semesterNumber}</td>
                <td className="py-3 px-6">{notes.NotesTitle}</td>
                <td className="py-3 px-6">{notes.year}</td>
                {!hideLastThreeColumns && (
                  <>
                    <td className="py-3 px-6">
                      {notes.uploadedBy.firstName}&nbsp;
                      {notes.uploadedBy.lastName}
                    </td>
                    <td className="py-3 px-6">
                      {new Date(notes.uploadedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      {new Date(notes.uploadedAt).toLocaleTimeString("en-US", {
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
                      title="Accept notes"
                      onClick={() => {
                        setIsAccept(true);
                        setNotes(notes);
                      }}
                    >
                      <CircleCheckBig className="w-5 h-5" />
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-all duration-200 flex items-center justify-center ml-2"
                      onClick={() => {
                        setIsDelete(true);
                        setNotes(notes);
                      }}
                      title="Reject notes"
                    >
                      <CircleX className="w-5 h-5" />
                    </button>
                    <button
                      className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-all duration-200 flex items-center justify-center ml-2 shadow-md hover:shadow-lg transform hover:scale-105"
                      onClick={() => handleOpen(notes.key)}
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
            {Math.min(indexOfLastRow, totalNotes)} of {totalNotes} entries
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
              Confirm notes Rejection
            </h2>

            <div className="mb-6 text-gray-600 dark:text-gray-300">
              <p className="mb-2">
                Are you sure you want to Reject this notes{" "}
                <span className="font-semibold">{notes?.NotesTitle}?</span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Course Name: {notes.courseId.courseName}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Course Code: {notes.courseId.courseCode}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Semester: {notes.semesterId.semesterNumber}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Year: {notes.year}</span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Uploaded By: {notes.uploadedBy.firstName}{" "}
                  {notes.uploadedBy.lastName}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Uploaded At:</span>{" "}
                {new Date(notes.uploadedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                {new Date(notes.uploadedAt).toLocaleTimeString("en-US", {
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
                  handleDelete(notes._id);
                }}
              >
                Confirm
              </button>

              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  setIsDelete(false);
                  setNotes(null);
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
              Confirm notes Acceptance
            </h2>

            <div className="mb-6 text-gray-600 dark:text-gray-300">
              <p className="mb-2">
                Are you sure you want to Accept this notes{" "}
                <span className="font-semibold">{notes?.NotesTitle}?</span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Course Name: {notes.courseId.courseName}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Course Code: {notes.courseId.courseCode}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Semester: {notes.semesterId.semesterNumber}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Year: {notes.year}</span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">
                  Uploaded By: {notes.uploadedBy.firstName}{" "}
                  {notes.uploadedBy.lastName}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Uploaded At:</span>{" "}
                {new Date(notes.uploadedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                {new Date(notes.uploadedAt).toLocaleTimeString("en-US", {
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
                  handleAccept(notes._id);
                  setNotes(null);
                }}
              >
                Confirm
              </button>

              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  setIsAccept(false);
                  setNotes(null);
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

export default Notes;
