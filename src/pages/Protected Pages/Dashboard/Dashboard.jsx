import React, { useState, useEffect } from "react";
import { components } from "../../../components";
import { toast } from "react-toastify";
import config from "../../../config";
import axios from "axios";

function Dashboard() {
  const [addReset, setAddReset] = useState(false);
  const [contribute, setContribute] = useState("");
  const [code, setCode] = useState("");
  const [semester, setSemester] = useState("");
  const [enable, setEnable] = useState({
    courseName: false,
    semester: false,
  });
  const [work, setWork] = useState({
    prePaper: false,
    notes: false,
    books: false,
  });
  const [newPreviousPaper, setNewPreviousPaper] = useState({
    paperTitle: "",
    paperFile: "",
    year: "",
  });
  const [allCoursesData, setAllCoursesData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);

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
            (course) => course.courseName === code.courseName
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

  const updateInput = (e, setfunction) => {
    setfunction((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const generateKey = () => {
    const courseCode = `${
      allCoursesData.find((course) => course.courseName === code?.courseName)
        ?.courseCode
    }`;
    if (contribute.provide === "Previous Year Papers") {
      const uniqueDate = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .substring(0, 16);
      return `Paper/${courseCode}/${semester.semesterNumber}/${newPreviousPaper.year}/${newPreviousPaper.paperTitle}-${uniqueDate}.pdf`;
    } else {
      return "";
    }
  };

  const uploadFileUrl = async (key) => {
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
    return res;
  };

  const addContribution = async () => {
    try {
      if (contribute.provide === "Previous Year Papers") {
        if (
          !newPreviousPaper.paperTitle ||
          !newPreviousPaper.paperFile ||
          !newPreviousPaper.year
        ) {
          toast.error("Please fill all the fields", {
            position: "top-center",
          });
          return;
        } else {
          const key = generateKey();
          const uploadUrlRes = await uploadFileUrl(key);
          if (uploadUrlRes.status === 200) {
            const uploadRes = await axios.put(
              uploadUrlRes.data.uploadUrl,
              newPreviousPaper.paperFile,
              {
                headers: {
                  "Content-Type": newPreviousPaper.paperFile.type,
                },
                maxBodyLength: Infinity,
              }
            );
            if (uploadRes.status === 200) {
              const addRes = await fetch(`${config.backendUrl}/createPaper`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
                body: JSON.stringify({
                  paperTitle: newPreviousPaper.paperTitle,
                  key,
                  courseId: allCoursesData.find(
                    (course) => course.courseName === code.courseName
                  )?._id,
                  semesterId: semesterData.find(
                    (sem) => `${sem.semesterNumber}` === semester.semesterNumber
                  )?._id,
                  year: newPreviousPaper.year,
                }),
              });
              const addResData = await addRes.json();
              if (addRes.status === 201) {
                toast.success(addResData.msg, {
                  position: "top-center",
                });
                setCode("");
                setSemester("");
                setAddReset(true);
                setContribute("");
                setEnable({ courseName: false, semester: false });
                setWork({ prePaper: false, notes: false, books: false });
                setNewPreviousPaper({
                  paperTitle: "",
                  paperFile: "",
                  year: "",
                });
              } else {
                toast.error(addResData.msg, {
                  position: "top-center",
                });
              }
            } else {
              toast.error(uploadRes.data.msg, {
                position: "top-center",
              });
            }
          } else {
            toast.error(uploadUrlRes.data.msg, {
              position: "top-center",
            });
          }
        }
      }
    } catch (error) {
      console.log("Error in addContribution", error);
      toast.error("Something went wrong", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  useEffect(() => {
    if (contribute.provide) {
      setEnable({ courseName: true, semester: false });
      if (code.courseName) {
        getSemester();
        setEnable({ courseName: true, semester: true });
        if (
          contribute.provide === "Previous Year Papers" &&
          semester.semesterNumber
        ) {
          setWork({ prePaper: true, notes: false, books: false });
        } else if (contribute.provide === "Notes" && semester.semesterNumber) {
          setWork({ prePaper: false, notes: true, books: false });
        } else if (contribute.provide === "Books" && semester.semesterNumber) {
          setWork({ prePaper: false, notes: false, books: true });
        } else {
          setWork({ prePaper: false, notes: false, books: false });
          setNewPreviousPaper({
            paperTitle: "",
            paperFile: "",
            year: "",
          });
        }
      } else {
        setSemester("");
        setWork({ prePaper: false, notes: false, books: false });
        setNewPreviousPaper({
          paperTitle: "",
          paperFile: "",
          year: "",
        });
      }
    } else {
      setCode("");
      setSemester("");
      setAddReset(true);
      setEnable({ courseName: false, semester: false });
      setWork({ prePaper: false, notes: false, books: false });
      setNewPreviousPaper({
        paperTitle: "",
        paperFile: "",
        year: "",
      });
    }
  }, [contribute, code, semester]);

  return (
    <div className="container mx-auto p-4 adminpanel">
      <h1
        className="text-4xl font-bold text-800 mb-6"
        style={{ color: "#1DB398" }}
      >
        Dashboard
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-semibold mb-6 text-black">
          Do your contribution here
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          <div className="mb-4 flex align-middle justify-center">
            <components.Dropdown
              placeholder="What can you contribute ?"
              options={["Previous Year Papers", "Notes", "Books"]}
              setFilters={setContribute}
              filterKey="provide"
              reset={addReset}
              setReset={setAddReset}
            />
          </div>

          {enable.courseName && (
            <div className="mb-4 flex align-middle justify-center">
              <components.Dropdown
                placeholder="Course Name"
                options={allCoursesData.map((course) => course.courseName)}
                setFilters={setCode}
                filterKey="courseName"
                reset={addReset}
                setReset={setAddReset}
              />
            </div>
          )}

          {enable.semester && (
            <div className="mb-4 flex align-middle justify-center">
              <p className="text-lg">
                <span className="font-medium">Course Code:</span>{" "}
                {allCoursesData.find(
                  (course) => course.courseName === code?.courseName
                )?.courseCode || "Not provided"}
              </p>
            </div>
          )}

          {enable.semester && (
            <div className="mb-4 flex align-middle justify-center">
              <components.Dropdown
                placeholder="Semester"
                options={semesterData.map((sem) => `${sem.semesterNumber}`)}
                setFilters={setSemester}
                filterKey="semesterNumber"
                reset={addReset}
                setReset={setAddReset}
              />
            </div>
          )}

          {work.prePaper && (
            <div className="mb-4 flex flex-col items-center">
              <label className="block text-sm font-medium text-black mb-2">
                Upload File (20MB max)
              </label>

              <components.FileUploadButton
                maxSizeMB={20}
                reset={addReset}
                onFileSelected={(file) => {
                  setNewPreviousPaper((prev) => ({
                    ...prev,
                    paperFile: file,
                  }));
                }}
              />
            </div>
          )}

          {work.prePaper && (
            <div className="mb-4 flex items-center justify-center">
              <components.Dropdown
                placeholder="Year"
                options={Array.from(
                  { length: new Date().getFullYear() - 2012 },
                  (_, i) => `${new Date().getFullYear() - i}`
                )}
                setFilters={setNewPreviousPaper}
                filterKey="year"
                reset={addReset}
                setReset={setAddReset}
              />
            </div>
          )}

          {work.prePaper && (
            <div className="flex flex-col items-center align-middle justify-center">
              <label
                htmlFor="paperTitle"
                className="block text-lg font-medium text-gray-700 mb-4"
              >
                Paper Title
              </label>
              <input
                type="text"
                name="paperTitle"
                id="paperTitle"
                value={newPreviousPaper.paperTitle}
                onChange={(e) => updateInput(e, setNewPreviousPaper)}
                autoComplete="off"
                className="max-w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out"
                placeholder="Enter Paper Title"
              />
            </div>
          )}

          {contribute.provide && (
            <div className="mb-4 flex align-middle justify-center items-center">
              <button
                className="buttonrpt"
                onClick={() => {
                  setAddReset(true);
                  setContribute("");
                  setCode("");
                  setSemester("");
                  setEnable({ courseName: false, semester: false });
                  setWork({ prePaper: false, notes: false, books: false });
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
            </div>
          )}

          {work.notes && "Notes"}
          {work.books && "Books"}

          <div className="mb-4 flex align-middle justify-center items-center">
            <button
              type="button"
              className="buttonadd"
              onClick={addContribution}
            >
              <span className="button__text">Contribute 🎉</span>
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
      </div>
    </div>
  );
}

export default Dashboard;
