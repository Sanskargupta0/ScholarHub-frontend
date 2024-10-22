import React, { useState, useEffect } from "react";
import { components } from "../../../../components";
import { toast } from "react-toastify";
import { Edit, Trash, Eye } from "lucide-react";
import axios from "axios";
import config from "../../../../config";

function Semester() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [newSemester, setNewSemester] = useState({
    semesterNumber: "",
    courseId: "",
    key: "",
  });
  const [showReset, setShowReset] = useState(false);
  const [reset, setReset] = useState(false);
  const [addReset, setAddReset] = useState(false);
  const [semestersData, setSemestersData] = useState([]);
  const [allCoursesData, setAllCoursesData] = useState([]);
  const [showComfirmation, setShowComfirmation] = useState(false);
  const [file, setFile] = useState("");
  const [updateFile, setUpdateFile] = useState("");
  const [filters, setFilters] = useState({
    semesterNumber: "",
    courseId: "",
  });
  const [code, setCode] = useState("");
  const [semester, setSemester] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [totalSemesters, setTotalSemesters] = useState(0);

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

  const getSemesters = async () => {
    try {
      const res = await fetch(
        `${config.backendUrl}/getSemester?page=${currentPage}&perPage=${rowsPerPage}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          body: JSON.stringify({ filterdata: filters }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setSemestersData(data.semesters);
        setTotalSemesters(data.totalSemesters);
      } else {
        const data = await res.json();
        setSemestersData(data.semesters);
        setTotalSemesters(data.totalSemesters);
        toast.error(data.msg, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("Error in getSemesters", error);
    }
  };

  const handleAddClick = () => {
    if (code.courseName && newSemester.semesterNumber) {
      setShowComfirmation(true);
    } else {
      toast.error("Please select a course and semester .", {
        position: "top-center",
      });
    }
  };

  const handleSemesterAdd = async () => {
    try {
      if (file) {
        const courseCode = `${
          allCoursesData.find(
            (course) => course.courseName === code?.courseName
          )?.courseCode
        }`;
        const key = `Syllabus/${courseCode}/${newSemester.semesterNumber}/${courseCode}_${newSemester.semesterNumber}_syllabus.pdf`;
        const res = await axios.post(
          `${config.backendUrl}/upload`,
          {
            key,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
          }
        );

        if (res.status === 200) {
          const uploadRes = await axios.put(res.data.uploadUrl, file, {
            headers: {
              "Content-Type": file.type,
            },
            maxBodyLength: Infinity,
          });

          if (uploadRes.status === 200) {
            // add semester
            const addRes = await axios.post(
              `${config.backendUrl}/createSemester`,
              {
                semesterNumber: newSemester.semesterNumber,
                courseId: newSemester.courseId,
                key,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
              }
            );

            if (addRes.status === 201) {
              toast.success(addRes.data.msg, {
                position: "top-center",
              });
              setSemestersData([addRes.data.semester, ...semestersData]);
              setAddReset(!addReset);
              setCode("");
              setFile("");
              setNewSemester({
                semesterNumber: "",
                courseId: "",
                key: "",
              });
            } else {
              toast.error(addRes.data.msg, {
                position: "top-center",
              });
            }
          } else {
            toast.error(uploadRes.data.msg, {
              position: "top-center",
            });
          }
        } else {
          toast.error(res.data.msg, {
            position: "top-center",
          });
        }
      } else {
        // Handle case when no file is present
        const res = await axios.post(
          `${config.backendUrl}/createSemester`,
          {
            semesterNumber: newSemester.semesterNumber,
            courseId: newSemester.courseId,
            key: "",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
          }
        );

        // Handle both successful and unsuccessful responses
        if (res.status === 201) {
          toast.success(res.data.msg, {
            position: "top-center",
          });
          setSemestersData([res.data.semester, ...semestersData]);
          setAddReset(!addReset);
          setCode("");
          setFile("");
          setNewSemester({
            semesterNumber: "",
            courseId: "",
            key: "",
          });
        } else {
          // Handle non-201 status codes without throwing to catch block
          toast.error(res.data.msg || "Operation failed", {
            position: "top-center",
          });
        }
      }
    } catch (error) {
      // Error handling for network errors and other exceptions
      if (error.response) {
        // Server responded with a status other than 2xx
        toast.error(error.response.data.msg || "An error occurred", {
          position: "top-center",
        });
      } else if (error.request) {
        // Request was made but no response was received
        toast.error("No response from server", {
          position: "top-center",
        });
      } else {
        // Other errors
        toast.error("Error in handleSemesterAdd", {
          position: "top-center",
        });
      }
      console.log("Error in handleSemesterAdd", error);
    }
  };

  const handledelete = async () => {
    try {
      const res = await fetch(`${config.backendUrl}/deleteSemester`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
        body: JSON.stringify({ semesterId: semester._id }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(data.msg, {
          position: "top-center",
        });
        setSemestersData(
          semestersData.filter((sem) => sem._id !== semester._id)
        );
        setIsDelete(false);
        setSemester(null);
      } else {
        const data = await res.json();
        toast.error(data.msg, {
          position: "top-center",
        });
        setIsDelete(false);
        setSemester(null);
      }
    } catch (error) {
      console.log("Error in handledelete", error);
    }
  };

  const handleEdit = async () => {
    try {
      const check = semestersData.find((sem) => sem._id === semester._id);
      const noChanges = semester.semesterNumber === check.semesterNumber && !updateFile.lastModified;
      
      if (noChanges) {
        toast.error("No changes made", { position: "top-center" });
        return setSemester(null);
      }
  
      const courseCode = allCoursesData.find((course) => course._id === semester.courseId._id)?.courseCode;
      const key = `Syllabus/${courseCode}/${semester.semesterNumber}/${courseCode}_${semester.semesterNumber}_syllabus.pdf`;
  
      // Step 1: Update Semester Number if Changed
      if (semester.semesterNumber !== check.semesterNumber) {
        const editRes = await fetch(`${config.backendUrl}/updateSemester`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          body: JSON.stringify({
            semesterNumber: semester.semesterNumber,
            courseId: semester.courseId._id,
            Id: semester._id,
          }),
        });
  
        if (!editRes.ok) {
          const data = await editRes.json();
          toast.error(data.msg, { position: "top-center" });
          return setSemester(null);
        }else{
          const data = await editRes.json();
          toast.success(data.msg, { position: "top-center" });
          setSemestersData(
            semestersData.map((sem) => {
              if (sem._id === semester._id) {
                return data.semester;
              } else {
                return sem;
              }
            })
          );
          setSemester(null);
        }
      }
  
      // Step 2: Handle File Upload
      if (updateFile) {
        const res = await axios.post(
          `${config.backendUrl}/upload`,
          { key },
          { headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` } }
        );
  
        if (res.status === 200) {
          const uploadRes = await axios.put(res.data.uploadUrl, updateFile, {
            headers: { "Content-Type": updateFile.type },
            maxBodyLength: Infinity,
          });
  
          if (uploadRes.status !== 200) {
            return toast.error(uploadRes.data.msg, { position: "top-center" });
          }
  
          // Update Semester Key after file upload
          const editKeyRes = await fetch(`${config.backendUrl}/updateSemesterKey`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
            body: JSON.stringify({ Id: semester._id, key }),
          });
  
          if (editKeyRes.ok) {
            const data = await editKeyRes.json();
            toast.success(data.msg, { position: "top-center" });
            setSemestersData(semestersData.map((sem) => (sem._id === semester._id ? data.semester : sem)));
            setSemester(null);
            setUpdateFile("");
          } else {
            const data = await editKeyRes.json();
            toast.error(data.msg, { position: "top-center" });
            setSemester(null);
            setUpdateFile("");
          }
        } else {
          toast.error(res.data.msg, { position: "top-center" });
        }
      } else {
        toast.success("Semester updated without file changes", { position: "top-center" });
        setSemester(null);
      }
    } catch (error) {
      console.log("Error in handleEdit", error);
      toast.error("An error occurred while editing", { position: "top-center" });
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

  useEffect(() => {
    getAllCourses();
  }, []);

  useEffect(() => {
    getSemesters();
    if (filters.courseId || filters.semesterNumber) {
      setShowReset(true);
    } else {
      setShowReset(false);
    }
  }, [rowsPerPage, currentPage, filters]);

  useEffect(() => {
    if (code) {
      if (code.courseName) {
        setNewSemester({
          ...newSemester,
          courseId: allCoursesData.find(
            (course) => course.courseName === code.courseName
          )?._id,
        });
      } else {
        setNewSemester({ ...newSemester, courseId: "" });
      }
    }
  }, [code]);

  useEffect(() => {
    if (filters.courseName) {
      setFilters({
        ...filters,
        courseId: allCoursesData.find(
          (course) => course.courseName === filters.courseName
        )?._id,
      });
    } else if (!filters.courseName) {
      setFilters({ ...filters, courseId: "" });
    }
  }, [filters.courseName]);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const totalPages = Math.ceil(totalSemesters / rowsPerPage);
  return (
    <div className="container mx-auto p-4 adminpanel">
      <div className="mb-6 mt-6 flex justify-between">
        <h1 className="text-3xl font-semibold">Semesters Panel</h1>

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
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-semibold mb-6 text-black">
          Add New Semester
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Upload File (20MB max)
            </label>
            {!isEdit && (
              <components.FileUploadButton
                maxSizeMB={20}
                reset={addReset}
                onFileSelected={setFile}
              />
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Semester Number
            </label>
            <input
              type="number"
              placeholder="Semester (1-10)"
              value={(newSemester && newSemester.semesterNumber) || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 1 && value <= 10) {
                  setNewSemester({ ...newSemester, semesterNumber: value });
                } else {
                  toast.warning(
                    "Please enter a valid semester between 1 and 10.",
                    { position: "top-center" }
                  );
                  setNewSemester({ ...newSemester, semesterNumber: "" });
                }
              }}
              className="border border-gray-300 rounded-lg p-2 w-full"
              min={1}
              max={10}
              step={1}
            />
          </div>

          <div className="mb-4">
            <components.Dropdown
              placeholder="Course Name"
              options={allCoursesData.map((course) => course.courseName)}
              setFilters={setCode}
              filterKey="courseName"
              reset={addReset}
              setReset={setAddReset}
            />
          </div>

          <div className="mb-4">
            {code && (
              <div className="text-black">
                Course Code:{" "}
                <span className="font-semibold">
                  {allCoursesData.find(
                    (course) => course.courseName === code?.courseName
                  )?.courseCode || "Course not found"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between space-x-4">
          <button
            className="buttonrpt mt-3"
            onClick={() => {
              setNewSemester({
                semesterNumber: "",
                courseId: "",
                key: "",
              });
              setCode("");
              setFile("");
              setAddReset(!addReset);
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

          <button type="button" className="buttonadd" onClick={handleAddClick}>
            <span className="button__text">Add Semester</span>
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
      <div className="overflow-x-auto shadow-lg rounded-lg mt-6">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-800 text-white text-sm uppercase leading-normal">
              <th className="py-3 px-6 text-left">Course Name</th>
              <th className="py-3 px-6 text-left">Course Code</th>
              <th className="py-3 px-6 text-left">Semester</th>
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
                <span className="font-semibold">
                  {allCoursesData.find(
                    (course) => course.courseName === filters?.courseName
                  )?.courseCode || "Course not found"}
                </span>
              </td>
              <td className="py-3 px-6">
                <components.Dropdown
                  placeholder="Semester (1-10)"
                  options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
                  setFilters={setFilters}
                  filterKey="semesterNumber"
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
                          semesterNumber: "",
                          courseId: "",
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
            {semestersData.map((semester, index) => (
              <tr
                key={semester._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-200" : "bg-white"
                } border-b border-gray-200 hover:bg-gray-100`}
              >
                <td className="py-3 px-6">{semester.courseId.courseName}</td>
                <td className="py-3 px-6">{semester.courseId.courseCode}</td>
                <td className="py-3 px-6">{semester.semesterNumber}</td>
                <td className="py-3 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all duration-200 flex items-center justify-center"
                      onClick={() => {
                        setIsEdit(true);
                        setSemester(semester);
                      }}
                    >
                      <Edit className="w-5 h-5 mr-2" />
                      Edit
                    </button>

                    <button
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-all duration-200 flex items-center justify-center ml-2"
                      onClick={() => {
                        setIsDelete(true);
                        setSemester(semester);
                      }}
                    >
                      <Trash className="w-5 h-5 mr-2" />
                      Delete
                    </button>

                    {semester.key ? (
                      <button
                        className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-all duration-200 flex items-center justify-center ml-2 shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={() => handleOpen(semester.key)}
                      >
                        <Eye className="w-5 h-5 mr-2" /> {/* Lucide Eye icon */}
                        <span className="label">View</span>
                      </button>
                    ) : (
                      <span className="text-gray-500 italic">
                        No File Uploaded
                      </span>
                    )}
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
            {Math.min(indexOfLastRow, totalSemesters)} of {totalSemesters}{" "}
            entries
          </span>
        </div>
        <components.Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {showComfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-out">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 transform transition-transform duration-300 ease-out scale-105">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Confirm Course and File Upload
            </h2>

            <div className="mb-6 text-gray-600">
              <p className="text-lg mb-2">
                <span className="font-medium">Course Name:</span>{" "}
                {code?.courseName || "Not provided"}
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Course Code:</span>{" "}
                {allCoursesData.find(
                  (course) => course.courseName === code?.courseName
                )?.courseCode || "Not provided"}
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Semester:</span>{" "}
                {newSemester.semesterNumber || "Not provided"}
              </p>
              <p className="text-lg">
                <span className="font-medium">File Name:</span>{" "}
                {file ? file.name : "No file selected"}
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => setShowComfirmation(false)}
              >
                Previous
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  handleSemesterAdd();
                  setShowComfirmation(false);
                }}
              >
                Confirm & Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {isDelete ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-out">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 transform transition-transform duration-300 ease-out scale-105">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Confirm Semester Deletion
            </h2>

            <div className="mb-6 text-gray-600">
              <p className="text-lg mb-2">
                <span className="font-medium">Course Name:</span>{" "}
                {semester.courseId.courseName || "Not provided"}
              </p>
              <p className="text-lg">
                <span className="font-medium">Course Code:</span>{" "}
                {semester.courseId.courseCode || "Not provided"}
              </p>
              <p className="text-lg">
                <span className="font-medium">Semester:</span>{" "}
                {semester.semesterNumber || "Not provided"}
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
                  setSemester(null);
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
              Edit Semester
            </h2>

            <div className="mb-6 text-gray-600">
              <p className="text-lg mb-2">
                <span className="font-medium">Course Name:</span>{" "}
                {semester.courseId.courseName}
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Course Code:</span>{" "}
                {semester.courseId.courseCode}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">
                  Semester Number
                </label>
                <input
                  type="number"
                  placeholder="Semester (1-10)"
                  value={(semester && semester.semesterNumber) || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value >= 1 && value <= 10) {
                      setSemester({ ...semester, semesterNumber: value });
                    } else {
                      toast.warning(
                        "Please enter a valid semester between 1 and 10.",
                        { position: "top-center" }
                      );
                      setSemester({ ...semester, semesterNumber: "" });
                    }
                  }}
                  className="border focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg p-2 w-full outline-none"
                  style={{ border: "2px solid red" }}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">
                  Upload File to Change the current File (20MB max)
                </label>
                <div className="flex justify-center">
                  <components.FileUploadButton
                    maxSizeMB={20}
                    reset={addReset}
                    onFileSelected={setUpdateFile}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
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
                  setSemester(null);
                  setUpdateFile("");
                  setAddReset(!addReset);
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

export default Semester;
