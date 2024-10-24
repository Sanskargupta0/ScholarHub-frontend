import React, { useState, useEffect } from "react";
import { components } from "../../../../components";
import { toast } from "react-toastify";
import { Edit, Trash } from "lucide-react";
import axios from "axios";
import config from "../../../../config";
import "./Course.css";

function Course() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [newCourse, setNewCourse] = useState({
    courseName: "",
    courseCode: "",
  });
  const [showReset, setShowReset] = useState(false);
  const [reset, setReset] = useState(false);
  const [coursesData, setCoursesData] = useState([]);
  const [allCoursesData, setAllCoursesData] = useState([]);
  const [showComfirmation, setShowComfirmation] = useState(false);
  const [filters, setFilters] = useState({
    courseId: "",
    courseCode: "",
  });
  const [course, setCourse] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);
  const handledelete = async () => {
    try {
      const res = await fetch(`${config.backendUrl}/deleteCourse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
        body: JSON.stringify({ id: course._id }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        toast.success(data.msg, {
          position: "top-center",
        });
        setCoursesData(coursesData.filter((c) => c._id !== course._id));
        setTotalCourses(totalCourses - 1);
        getAllCourses();
      } else {
        toast.error(data.msg, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("Error in handledelete", error);
    }
  };
  
  const handleEdit = async () => {
    try {
      const perviousCourse = coursesData.find((c) => c._id === course._id);
      if (
        perviousCourse.courseName === course.courseName &&
        perviousCourse.courseCode === course.courseCode
      ) {
        toast.error("No changes made", {
          position: "top-center",
        });
        return;
      }
      const res = await axios.put(
        `${config.backendUrl}/updateCourse`,
        {
          id: course._id,
          courseName: course.courseName,
          courseCode: course.courseCode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success(res.data.msg, {
          position: "top-center",
        });
        setCoursesData(
          coursesData.map((c) => (c._id === course._id ? course : c))
        );
        getAllCourses();
        setIsEdit(false);
      } else {
        toast.error(res.data.msg, {
          position: "top-center",
        });
        setIsEdit(false);
      }
    } catch (error) {
      console.log("Error in handleEdit", error);
    }
  };
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const newCourseData = (e) => {
    setNewCourse({
      ...newCourse,
      [e.target.name]: e.target.value,
    });
  };
  const handleCourseAdd = async () => {
    try {
      const res = await axios.post(
        `${config.backendUrl}/createCourse`,
        {
          courseName: newCourse.courseName,
          courseCode: newCourse.courseCode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 201) {
        toast.success(res.data.msg, {
          position: "top-center",
        });
        setNewCourse({
          courseName: "",
          courseCode: "",
        });
        setShowComfirmation(false);
        setCoursesData([res.data.course, ...coursesData]);
        getAllCourses();
      } else {
        toast.error(res.data.msg, {
          position: "top-center",
        });
        setShowComfirmation(false);
        setNewCourse({
          courseName: "",
          courseCode: "",
        });
      }
    } catch (error) {
      console.log("Error in handleCourseAdd", error);
    }
  };
  const getCourses = async () => {
    try {
      const res = await axios.post(
        `${config.backendUrl}/getCourse?page=${currentPage}&perPage=${rowsPerPage}`,
        { filterdata: filters },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      if (res.status === 200) {
        setCoursesData(res.data.courses);
        setTotalCourses(res.data.totalCourses);
      } else {
        toast.error(res.data.msg, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("Error in getCourses", error);
    }
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

  useEffect(() => {
    getAllCourses();
  }, []);

  useEffect(() => {
    getCourses();
    if (filters.courseName || filters.courseCode) {
      setShowReset(true);
    } else {
      setShowReset(false);
    }
  }, [rowsPerPage, currentPage, filters]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const totalPages = Math.ceil(totalCourses / rowsPerPage);

  return (
    <div className="container mx-auto p-4 adminpanel">
      <div className="mb-6 mt-6 flex justify-between">
        <h1 className="text-3xl font-semibold">Course Panel</h1>

        <div className="flex items-center space-x-2">
          <label htmlFor="rowsPerPage" className="text-gray-700 font-semibold">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            className="border border-gray-300 rounded px-2 py-1"
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

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-black">
          Add New Course
        </h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-4"
            htmlFor="courseName"
          >
            Course Title
          </label>
          <input
            type="text"
            id="courseName"
            placeholder="Enter Course Title"
            onChange={newCourseData}
            name="courseName"
            value={newCourse.courseName}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-4"
            htmlFor="courseCode"
          >
            Course Code
          </label>
          <input
            type="text"
            id="courseCode"
            placeholder="Enter Course Code"
            onChange={newCourseData}
            name="courseCode"
            value={newCourse.courseCode}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex space-x-4 justify-between">
          <button
            className="buttonrpt mt-3"
            onClick={() => {
              setNewCourse({ courseName: "", courseCode: "" });
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
              <g strokeWidth="1.5" strokeLinecap="round" stroke="#ff342b">
                <path d="m3.33337 10.8333c0 3.6819 2.98477 6.6667 6.66663 6.6667 3.682 0 6.6667-2.9848 6.6667-6.6667 0-3.68188-2.9847-6.66664-6.6667-6.66664-1.29938 0-2.51191.37174-3.5371 1.01468"></path>
                <path d="m7.69867 1.58163-1.44987 3.28435c-.18587.42104.00478.91303.42582 1.0989l3.28438 1.44986"></path>
              </g>
            </svg>
            <span className="lable">Reset</span>
          </button>

          <button
            type="button"
            className="buttonadd"
            onClick={() => {
              if (newCourse.courseCode && newCourse.courseName) {
                setShowComfirmation(true);
              } else {
                toast.error("Please fill all the fields", {
                  position: "top-center",
                });
              }
            }}
          >
            <span className="button__text">Add Course</span>
            <span className="button__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                stroke="currentColor"
                height="24"
                fill="none"
                className="svg"
              >
                <line y2="19" y1="5" x2="12" x1="12"></line>
                <line y2="12" y1="12" x2="19" x1="5"></line>
              </svg>
            </span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-800 text-white text-sm uppercase leading-normal">
              <th className="py-3 px-6 text-left">Course Name</th>
              <th className="py-3 px-6 text-left">Course Code</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
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
              <td className="py-3 px-6">
                <components.Dropdown
                  placeholder="Course Code"
                  options={allCoursesData.map((course) => course.courseCode)}
                  setFilters={setFilters}
                  filterKey="courseCode"
                  reset={reset}
                  setReset={setReset}
                />
              </td>
              <td className="py-3 px-6">
                <div className="flex items-center space-x-2">
                  {showReset && (
                    <button
                      className="buttonrpt"
                      onClick={() => {
                        setFilters({
                          courseName: "",
                          courseCode: "",
                        });
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
            {coursesData.map((course, index) => (
              <tr
                key={course._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-200" : "bg-white"
                } border-b border-gray-200 hover:bg-gray-100`}
              >
                <td className="py-3 px-6">{course.courseName}</td>
                <td className="py-3 px-6">{course.courseCode}</td>
                <td className="py-3 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all duration-200 flex items-center justify-center"
                      onClick={() => {
                        setIsEdit(true);
                        setCourse(course);
                      }}
                    >
                      <Edit className="w-5 h-5 mr-2" />
                      Edit
                    </button>

                    <button
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-all duration-200 flex items-center justify-center ml-2"
                      onClick={() => {
                        setIsDelete(true);
                        setCourse(course);
                      }}
                    >
                      <Trash className="w-5 h-5 mr-2" />
                      Delete
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
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <div>
          <span className="text-gray-600">
            Showing {indexOfFirstRow + 1} to{" "}
            {Math.min(indexOfLastRow, totalCourses)} of {totalCourses} entries
          </span>
        </div>
        <components.Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {showComfirmation ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-out">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 transform transition-transform duration-300 ease-out scale-105">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Confirm Course Addition
            </h2>

            <div className="mb-6 text-gray-600">
              <p className="text-lg mb-2">
                <span className="font-medium">Course Name:</span>{" "}
                {newCourse.courseName || "Not provided"}
              </p>
              <p className="text-lg">
                <span className="font-medium">Course Code:</span>{" "}
                {newCourse.courseCode || "Not provided"}
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={handleCourseAdd}
              >
                Confirm
              </button>

              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  setShowComfirmation(false);
                  setNewCourse({ courseName: "", courseCode: "" });
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

      {isEdit ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-out">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 transform transition-transform duration-300 ease-out scale-105">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Edit Course
            </h2>

            <div className="mb-6 text-gray-600">
              <p className="text-lg mb-2">
                <span className="font-medium">Course Name:</span>{" "}
                <input
                  type="text"
                  value={course.courseName}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => {
                    setCourse({
                      ...course,
                      courseName: e.target.value,
                    });
                  }}
                />
              </p>
              <p className="text-lg">
                <span className="font-medium">Course Code:</span>{" "}
                <input
                  type="text"
                  value={course.courseCode}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => {
                    setCourse({
                      ...course,
                      courseCode: e.target.value,
                    });
                  }}
                />
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  setIsEdit(false);
                  handleEdit();
                }}
              >
                Update
              </button>

              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  setIsEdit(false);
                  setCourse(null);
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

      {isDelete ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-out">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 transform transition-transform duration-300 ease-out scale-105">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Confirm Course Deletion
            </h2>

            <div className="mb-6 text-gray-600">
              <p className="text-lg mb-2">
                <span className="font-medium">Course Name:</span>{" "}
                {course.courseName || "Not provided"}
              </p>
              <p className="text-lg">
                <span className="font-medium">Course Code:</span>{" "}
                {course.courseCode || "Not provided"}
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  setIsDelete(false);
                  handledelete();
                }}
              >
                Confirm
              </button>

              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  setIsDelete(false);
                  setCourse(null);
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

export default Course;
