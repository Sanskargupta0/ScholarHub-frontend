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
  const [isUploading, setIsUploading] = useState(false);
  const [enable, setEnable] = useState({
    courseName: false,
    semester: false,
  });
  const [work, setWork] = useState({
    prePaper: false,
    notes: false,
    books: false,
    ebooks: false,
  });
  const [newPreviousPaper, setNewPreviousPaper] = useState({
    paperTitle: "",
    paperFile: "",
    year: "",
  });
  const [newNotes, setNewNotes] = useState({
    notesTitle: "",
    notesFile: "",
    year: "",
  });
  const [newBooks, setNewBooks] = useState({
    bookTitle: "",
    bookFile: "",
    bookCover: "",
    author: "",
    edition: "",
    price: "",
    quantity: 1,
    needToReturn: false,
    isCourseBook: true,
    description: "",
    genres: [],
    linkToEbook: false,
    existingEbookId: "",
    year: "",
  });
  const [newEbooks, setNewEbooks] = useState({
    ebookTitle: "",
    ebookFile: "",
    ebookCover: "",
    author: "",
    edition: "",
    description: "",
    genres: [],
    isCourseBook: true,
    linkToBook: false,
    existingBookId: "",
    year: "",
  });
  const [allCoursesData, setAllCoursesData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [availableGenres] = useState([
    "Fiction", "Non-Fiction", "Academic", "Literature", "Science", 
    "Technology", "Computer Science", "Engineering", "Mathematics", 
    "Physics", "Chemistry", "Biology", "History", "Philosophy", 
    "Economics", "Business", "Management", "Law", "Medical",
    "Arts", "Religious", "Self-Help", "Reference"
  ]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [availableEbooks, setAvailableEbooks] = useState([]);

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
    } else if (contribute.provide === "Notes") {
      const uniqueDate = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .substring(0, 16);
      return `Notes/${courseCode}/${semester.semesterNumber}/${newNotes.year}/${newNotes.notesTitle}-${uniqueDate}.pdf`;
    } else if (contribute.provide === "Books") {
      const uniqueDate = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .substring(0, 16);
      return `Books/${courseCode}/${semester.semesterNumber}/${newBooks.year}/${newBooks.bookTitle}-${uniqueDate}.pdf`;
    } else if (contribute.provide === "EBooks") {
      const uniqueDate = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .substring(0, 16);
      return `EBooks/${courseCode}/${semester.semesterNumber}/${newEbooks.year}/${newEbooks.ebookTitle}-${uniqueDate}.pdf`;
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

  const handleGenreSelection = (genre, setFunction, stateKey) => {
    setFunction(prev => {
      const currentGenres = [...prev.genres];
      if (currentGenres.includes(genre)) {
        return {
          ...prev,
          genres: currentGenres.filter(g => g !== genre)
        };
      } else {
        return {
          ...prev,
          genres: [...currentGenres, genre]
        };
      }
    });
  };

  const getAvailableBooks = async () => {
    if (newEbooks.linkToBook) {
      try {
        const res = await axios.get(`${config.backendUrl}/getAvailableBooks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        });
        if (res.status === 200) {
          setAvailableBooks(res.data.books);
        } else {
          toast.error("Failed to fetch available books", {
            position: "top-center",
          });
        }
      } catch (error) {
        console.log("Error in getAvailableBooks", error);
        toast.error("Something went wrong while fetching books", {
          position: "top-center",
        });
      }
    }
  };

  const getAvailableEbooks = async () => {
    if (newBooks.linkToEbook) {
      try {
        const res = await axios.get(`${config.backendUrl}/getAvailableEbooks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        });
        if (res.status === 200) {
          setAvailableEbooks(res.data.ebooks);
        } else {
          toast.error("Failed to fetch available e-books", {
            position: "top-center",
          });
        }
      } catch (error) {
        console.log("Error in getAvailableEbooks", error);
        toast.error("Something went wrong while fetching e-books", {
          position: "top-center",
        });
      }
    }
  };

  const uploadImageToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'scholar_hub'); // Set your Cloudinary upload preset
      
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', // Replace with your Cloudinary cloud name
        formData
      );
      
      if (response.status === 200) {
        return response.data.secure_url;
      } else {
        throw new Error("Failed to upload image to Cloudinary");
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
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
          setIsUploading(true);
          const loadingToastId = toast.loading("Uploading document...", {
            position: "top-center",
          });

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
              toast.dismiss(loadingToastId);

              if (addRes.status === 201) {
                toast.success(addResData.msg, {
                  position: "top-center",
                });
                setCode("");
                setSemester("");
                setAddReset(true);
                setContribute("");
                setEnable({ courseName: false, semester: false});
                setWork({
                  prePaper: false,
                  notes: false,
                  books: false,
                  ebooks: false,
                });
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
              toast.dismiss(loadingToastId);
              toast.error(uploadRes.data.msg, {
                position: "top-center",
              });
            }
          } else {
            toast.dismiss(loadingToastId);
            toast.error(uploadUrlRes.data.msg, {
              position: "top-center",
            });
          }
          setIsUploading(false);
        }
      } else if (contribute.provide === "Notes") {
        if (!newNotes.notesTitle || !newNotes.notesFile || !newNotes.year) {
          toast.error("Please fill all the fields", {
            position: "top-center",
          });
          return;
        } else {
          setIsUploading(true);
          const loadingToastId = toast.loading("Uploading document...", {
            position: "top-center",
          });

          const key = generateKey();
          const uploadUrlRes = await uploadFileUrl(key);
          if (uploadUrlRes.status === 200) {
            const uploadRes = await axios.put(
              uploadUrlRes.data.uploadUrl,
              newNotes.notesFile,
              {
                headers: {
                  "Content-Type": newNotes.notesFile.type,
                },
                maxBodyLength: Infinity,
              }
            );
            if (uploadRes.status === 200) {
              const addRes = await fetch(`${config.backendUrl}/createNotes`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
                body: JSON.stringify({
                  NotesTitle: newNotes.notesTitle,
                  key,
                  courseId: allCoursesData.find(
                    (course) => course.courseName === code.courseName
                  )?._id,
                  semesterId: semesterData.find(
                    (sem) => `${sem.semesterNumber}` === semester.semesterNumber
                  )?._id,
                  year: newNotes.year,
                }),
              });
              const addResData = await addRes.json();
              toast.dismiss(loadingToastId);

              if (addRes.status === 201) {
                toast.success(addResData.msg, {
                  position: "top-center",
                });
                setCode("");
                setSemester("");
                setAddReset(true);
                setContribute("");
                setEnable({ courseName: false, semester: false});
                setWork({
                  prePaper: false,
                  notes: false,
                  books: false,
                  ebooks: false,
                });
                setNewNotes({
                  notesTitle: "",
                  notesFile: "",
                  year: "",
                });
              } else {
                toast.error(addResData.msg, {
                  position: "top-center",
                });
              }
            } else {
              toast.dismiss(loadingToastId);
              toast.error(uploadRes.data.msg, {
                position: "top-center",
              });
            }
          } else {
            toast.dismiss(loadingToastId);
            toast.error(uploadUrlRes.data.msg, {
              position: "top-center",
            });
          }
          setIsUploading(false);
        }
      } else if (contribute.provide === "Books") {
        if (
          !newBooks.bookTitle ||
          !newBooks.author ||
          !newBooks.edition ||
          !newBooks.price ||
          !newBooks.description ||
          newBooks.genres.length === 0 ||
          (!newBooks.isCourseBook || (newBooks.isCourseBook && !code.courseName)) ||
          (!newBooks.isCourseBook || (newBooks.isCourseBook && !semester.semesterNumber)) ||
          (newBooks.linkToEbook && !newBooks.existingEbookId)
        ) {
          toast.error("Please fill all the required fields", {
            position: "top-center",
          });
          return;
        } else {
          setIsUploading(true);
          const loadingToastId = toast.loading("Uploading book information...", {
            position: "top-center",
          });

          let bookImageUrl = "";
          if (newBooks.bookCover) {
            try {
              bookImageUrl = await uploadImageToCloudinary(newBooks.bookCover);
            } catch (error) {
              toast.dismiss(loadingToastId);
              toast.error("Failed to upload book cover image", {
                position: "top-center",
              });
              setIsUploading(false);
              return;
            }
          }

          const bookData = {
            bookTitle: newBooks.bookTitle,
            author: newBooks.author,
            edition: parseInt(newBooks.edition),
            price: parseFloat(newBooks.price),
            Quantity: parseInt(newBooks.quantity),
            needToReturn: newBooks.needToReturn,
            description: newBooks.description,
            genres: newBooks.genres,
            bookimage: bookImageUrl,
          };

          if (newBooks.isCourseBook) {
            bookData.courseId = allCoursesData.find(
              (course) => course.courseName === code.courseName
            )?._id;
            bookData.semesterId = semesterData.find(
              (sem) => `${sem.semesterNumber}` === semester.semesterNumber
            )?._id;
          }

          if (newBooks.linkToEbook) {
            bookData.eBookId = newBooks.existingEbookId;
          }

          const addRes = await fetch(`${config.backendUrl}/createBook`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
            body: JSON.stringify(bookData),
          });

          const addResData = await addRes.json();
          toast.dismiss(loadingToastId);

          if (addRes.status === 201) {
            toast.success(addResData.msg, {
              position: "top-center",
            });
            setCode("");
            setSemester("");
            setAddReset(true);
            setContribute("");
            setEnable({ courseName: false, semester: false});
            setWork({
              prePaper: false,
              notes: false,
              books: false,
              ebooks: false,
            });
            setNewBooks({
              bookTitle: "",
              bookFile: "",
              bookCover: "",
              author: "",
              edition: "",
              price: "",
              quantity: 1,
              needToReturn: false,
              isCourseBook: true,
              description: "",
              genres: [],
              linkToEbook: false,
              existingEbookId: "",
              year: "",
            });
          } else {
            toast.error(addResData.msg, {
              position: "top-center",
            });
          }
          setIsUploading(false);
        }
      } else if (contribute.provide === "EBooks") {
        if (
          !newEbooks.ebookTitle ||
          !newEbooks.ebookFile ||
          !newEbooks.author ||
          !newEbooks.edition ||
          !newEbooks.description ||
          newEbooks.genres.length === 0 ||
          (!newEbooks.isCourseBook || (newEbooks.isCourseBook && !code.courseName)) ||
          (!newEbooks.isCourseBook || (newEbooks.isCourseBook && !semester.semesterNumber)) ||
          (newEbooks.linkToBook && !newEbooks.existingBookId)
        ) {
          toast.error("Please fill all the required fields", {
            position: "top-center",
          });
          return;
        } else {
          setIsUploading(true);
          const loadingToastId = toast.loading("Uploading e-book...", {
            position: "top-center",
          });

          let ebookImageUrl = "";
          if (newEbooks.ebookCover) {
            try {
              ebookImageUrl = await uploadImageToCloudinary(newEbooks.ebookCover);
            } catch (error) {
              toast.dismiss(loadingToastId);
              toast.error("Failed to upload e-book cover image", {
                position: "top-center",
              });
              setIsUploading(false);
              return;
            }
          }

          const key = generateKey();
          const uploadUrlRes = await uploadFileUrl(key);
          if (uploadUrlRes.status === 200) {
            const uploadRes = await axios.put(
              uploadUrlRes.data.uploadUrl,
              newEbooks.ebookFile,
              {
                headers: {
                  "Content-Type": newEbooks.ebookFile.type,
                },
                maxBodyLength: Infinity,
              }
            );
            if (uploadRes.status === 200) {
              const ebookData = {
                bookTitle: newEbooks.ebookTitle,
                author: newEbooks.author,
                edition: parseInt(newEbooks.edition),
                description: newEbooks.description,
                genres: newEbooks.genres,
                bookimage: ebookImageUrl,
                key
              };

              if (newEbooks.isCourseBook) {
                ebookData.courseId = allCoursesData.find(
                  (course) => course.courseName === code.courseName
                )?._id;
                ebookData.semesterId = semesterData.find(
                  (sem) => `${sem.semesterNumber}` === semester.semesterNumber
                )?._id;
              }

              if (newEbooks.linkToBook) {
                ebookData.bookId = newEbooks.existingBookId;
              }

              const addRes = await fetch(`${config.backendUrl}/createEbook`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
                body: JSON.stringify(ebookData),
              });

              const addResData = await addRes.json();
              toast.dismiss(loadingToastId);

              if (addRes.status === 201) {
                toast.success(addResData.msg, {
                  position: "top-center",
                });
                setCode("");
                setSemester("");
                setAddReset(true);
                setContribute("");
                setEnable({ courseName: false, semester: false});
                setWork({
                  prePaper: false,
                  notes: false,
                  books: false,
                  ebooks: false,
                });
                setNewEbooks({
                  ebookTitle: "",
                  ebookFile: "",
                  ebookCover: "",
                  author: "",
                  edition: "",
                  description: "",
                  genres: [],
                  isCourseBook: true,
                  linkToBook: false,
                  existingBookId: "",
                  year: "",
                });
              } else {
                toast.error(addResData.msg, {
                  position: "top-center",
                });
              }
            } else {
              toast.dismiss(loadingToastId);
              toast.error("Failed to upload e-book file", {
                position: "top-center",
              });
            }
          } else {
            toast.dismiss(loadingToastId);
            toast.error(uploadUrlRes.data.msg, {
              position: "top-center",
            });
          }
          setIsUploading(false);
        }
      }
    } catch (error) {
      setIsUploading(false);
      toast.dismiss();
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
      setEnable({ courseName: true, semester: false});
      setNewBooks(prev => ({...prev, isCourseBook: true}))
      setNewEbooks(prev => ({...prev, isCourseBook: true}))
      if (code.courseName) {
        getSemester();
        setEnable({ courseName: true, semester: true, });
        if (
          contribute.provide === "Previous Year Papers" &&
          semester.semesterNumber
        ) {
          setWork({
            prePaper: true,
            notes: false,
            books: false,
            ebooks: false,
          });
        } else if (contribute.provide === "Notes" && semester.semesterNumber) {
          setWork({
            prePaper: false,
            notes: true,
            books: false,
            ebooks: false,
          });
        } else if (contribute.provide === "Books" && semester.semesterNumber) {
          setWork({
            prePaper: false,
            notes: false,
            books: true,
            ebooks: false,
          });
        } else if (contribute.provide === "EBooks" && semester.semesterNumber) {
          setWork({
            prePaper: false,
            notes: false,
            books: false,
            ebooks: true,
          });
        } else {
          setWork({
            prePaper: false,
            notes: false,
            books: false,
            ebooks: false,
          });
          setNewPreviousPaper({
            paperTitle: "",
            paperFile: "",
            year: "",
          });
        }
      } else {
        setSemester("");
        setWork({ prePaper: false, notes: false, books: false, ebooks: false });
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
      setEnable({ courseName: false, semester: false});
      setWork({ prePaper: false, notes: false, books: false, ebooks: false });
      setNewPreviousPaper({
        paperTitle: "",
        paperFile: "",
        year: "",
      });
      setNewNotes({
        notesTitle: "",
        notesFile: "",
        year: "",
      });
      setNewEbooks({
        ebookTitle: "",
        ebookFile: "",
        ebookCover: "",
        author: "",
        edition: "",
        description: "",
        genres: [],
        isCourseBook: true,
        linkToBook: false,
        existingBookId: "",
        year: "",
      });
      setNewBooks({
        bookTitle: "",
        bookFile: "",
        bookCover: "",
        author: "",
        edition: "",
        price: "",
        quantity: 1,
        needToReturn: false,
        isCourseBook: true,
        description: "",
        genres: [],
        linkToEbook: false,
        existingBookId: "",
        year: "",
      });
    }
    if (newBooks.linkToEbook) {
      getAvailableEbooks();
    }
    if (newEbooks.linkToBook) {
      getAvailableBooks();
    }
  }, [contribute, code, semester, newBooks.linkToEbook, newEbooks.linkToBook]);

  return (
    <div className="container mx-auto p-4 adminpanel dark:bg-gray-800 dark:text-white">
      <h1
        className="text-4xl font-bold mb-6 dark:text-emerald-400"
        style={{ color: "#1DB398" }}
      >
        Dashboard
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-700">
        <h2 className="text-3xl font-semibold mb-6 text-black dark:text-white">
          Do your contribution here
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          <div className="mb-4 flex align-middle justify-center">
            <components.Dropdown
              placeholder="What you want to contribute ?"
              options={["Previous Year Papers", "Notes", "Books", "EBooks"]}
              setFilters={setContribute}
              filterKey="provide"
              reset={addReset}
              setReset={setAddReset}
            />
          </div>

          {contribute.provide == "Books" && (
            <div className="mb-4 flex flex-col items-center">
              <label className="block text-sm font-medium text-black dark:text-gray-200 mb-2">
                Is this a course book?
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isCourseBook"
                    checked={newBooks.isCourseBook}
                    onChange={() => {setNewBooks(prev => ({...prev, isCourseBook: true}))
                                 
                  }
                  }
                    className="form-radio h-5 w-5 text-emerald-500 dark:text-emerald-400"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isCourseBook"
                    checked={!newBooks.isCourseBook}
                    onChange={() => {setNewBooks(prev => ({...prev, isCourseBook: false}))
                    ,setWork(prev => ({...prev, books: true}))                   
                  }
                }
                    className="form-radio h-5 w-5 text-emerald-500 dark:text-emerald-400"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">No</span>
                </label>
              </div>
            </div>
          )}

          {contribute.provide == "EBooks" && (
            <div className="mb-4 flex flex-col items-center">
              <label className="block text-sm font-medium text-black dark:text-gray-200 mb-2">
                Is this a course book?
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="ebookIsCourseBook"
                    checked={newEbooks.isCourseBook}
                    onChange={() => setNewEbooks(prev => ({...prev, isCourseBook: true}))}
                    className="form-radio h-5 w-5 text-emerald-500 dark:text-emerald-400"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="ebookIsCourseBook"
                    checked={!newEbooks.isCourseBook}
                    onChange={() => {setNewEbooks(prev => ({...prev, isCourseBook: false}))
                  ,setWork(prev => ({...prev, ebooks: true})) 
                  }
                }
                    className="form-radio h-5 w-5 text-emerald-500 dark:text-emerald-400"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">No</span>
                </label>
              </div>
            </div>
          )}

          {enable.courseName && newBooks.isCourseBook && newEbooks.isCourseBook  &&  (
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

          {enable.semester && newBooks.isCourseBook && newEbooks.isCourseBook &&  (
            <div className="mb-4 flex align-middle justify-center">
              <p className="text-lg dark:text-gray-200">
                <span className="font-medium">Course Code:</span>{" "}
                {allCoursesData.find(
                  (course) => course.courseName === code?.courseName
                )?.courseCode || "Not provided"}
              </p>
            </div>
          )}

          {enable.semester && newBooks.isCourseBook && newEbooks.isCourseBook && (
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

          {/* Previous Year Papers Form Fields */}
          {work.prePaper && (
            <div className="mb-4 flex flex-col items-center">
              <label className="block text-sm font-medium text-black dark:text-gray-200 mb-2">
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
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4"
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
                className="max-w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Enter Paper Title"
              />
            </div>
          )}

          {/* Notes Form Fields */}
          {work.notes && (
            <div className="mb-4 flex flex-col items-center">
              <label className="block text-sm font-medium text-black dark:text-gray-200 mb-2">
                Upload File (20MB max)
              </label>

              <components.FileUploadButton
                maxSizeMB={20}
                reset={addReset}
                onFileSelected={(file) => {
                  setNewNotes((prev) => ({
                    ...prev,
                    notesFile: file,
                  }));
                }}
              />
            </div>
          )}

          {work.notes && (
            <div className="mb-4 flex items-center justify-center">
              <components.Dropdown
                placeholder="Year"
                options={Array.from(
                  { length: new Date().getFullYear() - 2012 },
                  (_, i) => `${new Date().getFullYear() - i}`
                )}
                setFilters={setNewNotes}
                filterKey="year"
                reset={addReset}
                setReset={setAddReset}
              />
            </div>
          )}

          {work.notes && (
            <div className="flex flex-col items-center align-middle justify-center">
              <label
                htmlFor="notesTitle"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4"
              >
                Notes Title
              </label>
              <input
                type="text"
                name="notesTitle"
                id="notesTitle"
                value={newNotes.notesTitle}
                onChange={(e) => updateInput(e, setNewNotes)}
                autoComplete="off"
                className="max-w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Enter Notes Title"
              />
            </div>
          )}

          {/* Books Form Fields */}
          {work.books && (
            <div className="mb-4 flex flex-col items-center">
              <label className="block text-sm font-medium text-black dark:text-gray-200 mb-2">
                Upload Book Cover Image (Optional)
              </label>

              <components.FileUploadButton
                maxSizeMB={2}
                acceptedTypes=".jpg,.jpeg,.png"
                reset={addReset}
                onFileSelected={(file) => {
                  setNewBooks((prev) => ({
                    ...prev,
                    bookCover: file,
                  }));
                }}
              />
            </div>
          )}

          {work.books && (
            <div className="mb-4 flex flex-col items-center">
              <label className="block text-sm font-medium text-black dark:text-gray-200 mb-2">
                Link to an existing E-Book?
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="linkToEbook"
                    checked={newBooks.linkToEbook}
                    onChange={() => setNewBooks(prev => ({...prev, linkToEbook: true}))}
                    className="form-radio h-5 w-5 text-emerald-500 dark:text-emerald-400"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="linkToEbook"
                    checked={!newBooks.linkToEbook}
                    onChange={() => setNewBooks(prev => ({...prev, linkToEbook: false, existingEbookId: ""}))}
                    className="form-radio h-5 w-5 text-emerald-500 dark:text-emerald-400"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">No</span>
                </label>
              </div>
            </div>
          )}

          {work.books && newBooks.linkToEbook && (
            <div className="mb-4 flex items-center justify-center">
              <components.Dropdown
                placeholder="Select E-Book"
                options={availableEbooks.map((ebook) => ({
                  label: ebook.bookTitle,
                  value: ebook._id,
                }))}
                setFilters={(value) => setNewBooks(prev => ({...prev, existingEbookId: value.value}))}
                filterKey="value"
                isObject={true}
                reset={addReset}
                setReset={setAddReset}
              />
            </div>
          )}

          {work.books && (
            <div className="flex flex-col items-center align-middle justify-center">
              <label
                htmlFor="bookTitle"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4"
              >
                Book Title
              </label>
              <input
                type="text"
                name="bookTitle"
                id="bookTitle"
                value={newBooks.bookTitle}
                onChange={(e) => updateInput(e, setNewBooks)}
                autoComplete="off"
                className="max-w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Enter Book Title"
              />
            </div>
          )}

          {work.books && (
            <div className="flex flex-col items-center align-middle justify-center">
              <label
                htmlFor="author"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4"
              >
                Author Name
              </label>
              <input
                type="text"
                name="author"
                id="author"
                value={newBooks.author}
                onChange={(e) => updateInput(e, setNewBooks)}
                autoComplete="off"
                className="max-w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Enter Author Name"
              />
            </div>
          )}

          {work.books && (
            <div className="flex flex-col items-center align-middle justify-center">
              <label
                htmlFor="edition"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4"
              >
                Edition
              </label>
              <input
                type="number"
                name="edition"
                id="edition"
                value={newBooks.edition}
                onChange={(e) => updateInput(e, setNewBooks)}
                autoComplete="off"
                className="max-w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Enter Edition"
                min="1"
              />
            </div>
          )}

          {work.books && (
            <div className="flex flex-col items-center align-middle justify-center">
              <label
                htmlFor="price"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4"
              >
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={newBooks.price}
                onChange={(e) => updateInput(e, setNewBooks)}
                autoComplete="off"
                className="max-w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Enter Price"
                min="0"
              />
            </div>
          )}

          {work.books && (
            <div className="flex flex-col items-center align-middle justify-center">
              <label
                htmlFor="quantity"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4"
              >
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                value={newBooks.quantity}
                onChange={(e) => updateInput(e, setNewBooks)}
                autoComplete="off"
                className="max-w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Enter Quantity"
                min="1"
              />
            </div>
          )}

          {work.books && (
            <div className="flex flex-col items-center align-middle justify-center col-span-1 md:col-span-3">
              <label
                htmlFor="description"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={newBooks.description}
                onChange={(e) => updateInput(e, setNewBooks)}
                autoComplete="off"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Enter Description"
                rows="4"
              ></textarea>
            </div>
          )}

          {work.books && (
            <div className="flex flex-col items-center align-middle justify-center col-span-1 md:col-span-3">
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
                Select Genres (select at least one)
              </label>
              <div className="flex flex-wrap gap-2 justify-center">
                {availableGenres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleGenreSelection(genre, setNewBooks, 'genres')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      newBooks.genres.includes(genre)
                        ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* E-Books Form Fields */}
          {work.ebooks && (
            <div className="mb-4 flex flex-col items-center">
              <label className="block text-sm font-medium text-black dark:text-gray-200 mb-2">
                Upload E-Book File (PDF, 20MB max)
              </label>

              <components.FileUploadButton
                maxSizeMB={20}
                acceptedTypes=".pdf"
                reset={addReset}
                onFileSelected={(file) => {
                  setNewEbooks((prev) => ({
                    ...prev,
                    ebookFile: file,
                  }));
                }}
              />
            </div>
          )}

          {work.ebooks && (
            <div className="mb-4 flex flex-col items-center">
              <label className="block text-sm font-medium text-black dark:text-gray-200 mb-2">
                Upload E-Book Cover Image (Optional)
              </label>

              <components.FileUploadButton
                maxSizeMB={2}
                acceptedTypes=".jpg,.jpeg,.png"
                reset={addReset}
                onFileSelected={(file) => {
                  setNewEbooks((prev) => ({
                    ...prev,
                    ebookCover: file,
                  }));
                }}
              />
            </div>
          )}

          {work.ebooks && (
            <div className="mb-4 flex flex-col items-center">
              <label className="block text-sm font-medium text-black dark:text-gray-200 mb-2">
                Link to an existing Book?
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="linkToBook"
                    checked={newEbooks.linkToBook}
                    onChange={() => setNewEbooks(prev => ({...prev, linkToBook: true}))}
                    className="form-radio h-5 w-5 text-emerald-500 dark:text-emerald-400"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="linkToBook"
                    checked={!newEbooks.linkToBook}
                    onChange={() => setNewEbooks(prev => ({...prev, linkToBook: false, existingBookId: ""}))}
                    className="form-radio h-5 w-5 text-emerald-500 dark:text-emerald-400"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">No</span>
                </label>
              </div>
            </div>
          )}

          {work.ebooks && newEbooks.linkToBook && (
            <div className="mb-4 flex items-center justify-center">
              <components.Dropdown
                placeholder="Select Book"
                options={availableBooks.map((book) => ({
                  label: book.bookTitle,
                  value: book._id,
                }))}
                setFilters={(value) => setNewEbooks(prev => ({...prev, existingBookId: value.value}))}
                filterKey="value"
                isObject={true}
                reset={addReset}
                setReset={setAddReset}
              />
            </div>
          )}

          {work.ebooks && (
            <div className="flex flex-col items-center align-middle justify-center">
              <label
                htmlFor="ebookTitle"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4"
              >
                E-Book Title
              </label>
              <input
                type="text"
                name="ebookTitle"
                id="ebookTitle"
                value={newEbooks.ebookTitle}
                onChange={(e) => updateInput(e, setNewEbooks)}
                autoComplete="off"
                className="max-w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Enter E-Book Title"
              />
            </div>
          )}

          {work.ebooks && (
            <div className="flex flex-col items-center align-middle justify-center">
              <label
                htmlFor="author"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4"
              >
                Author Name
              </label>
              <input
                type="text"
                name="author"
                id="author"
                value={newEbooks.author}
                onChange={(e) => updateInput(e, setNewEbooks)}
                autoComplete="off"
                className="max-w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Enter Author Name"
              />
            </div>
          )}

          {work.ebooks && (
            <div className="flex flex-col items-center align-middle justify-center">
              <label
                htmlFor="edition"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4"
              >
                Edition
              </label>
              <input
                type="number"
                name="edition"
                id="edition"
                value={newEbooks.edition}
                onChange={(e) => updateInput(e, setNewEbooks)}
                autoComplete="off"
                className="max-w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Enter Edition"
                min="1"
              />
            </div>
          )}

          {work.ebooks && (
            <div className="flex flex-col items-center align-middle justify-center col-span-1 md:col-span-3">
              <label
                htmlFor="description"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={newEbooks.description}
                onChange={(e) => updateInput(e, setNewEbooks)}
                autoComplete="off"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Enter Description"
                rows="4"
              ></textarea>
            </div>
          )}

          {work.ebooks && (
            <div className="flex flex-col items-center align-middle justify-center col-span-1 md:col-span-3">
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
                Select Genres (select at least one)
              </label>
              <div className="flex flex-wrap gap-2 justify-center">
                {availableGenres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleGenreSelection(genre, setNewEbooks, 'genres')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      newEbooks.genres.includes(genre)
                        ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {contribute.provide && (
            <div className="mb-4 flex align-middle justify-center items-center">
              <button
                className="buttonrpt dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
                onClick={() => {
                  setAddReset(true);
                  setContribute("");
                  setCode("");
                  setSemester("");
                  setEnable({ courseName: false, semester: false});
                  setWork({
                    prePaper: false,
                    notes: false,
                    books: false,
                    ebooks: false,
                  });
                }}
                disabled={isUploading}
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

          {(work.prePaper || work.notes || work.books || work.ebooks) && (
            <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center mb-4 mt-4">
              <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                {work.prePaper && "You are contributing a Previous Year Paper"}
                {work.notes && "You are contributing Notes"}
                {work.books && "You are contributing a Book"}
                {work.ebooks && "You are contributing an E-Book"}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Make sure all information is correct before submitting.
              </p>

              {work.prePaper && (
                <div className="text-left text-sm text-gray-700 dark:text-gray-300 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-bold text-green-600 mb-2">
                    Instructions for Previous Year Papers:
                  </h3>
                  <ul className="list-disc list-inside">
                    <li>Upload a high-quality and clearly visible PDF.</li>
                    <li>
                      Follow the naming convention:{" "}
                      <strong>PaperName_PaperCode.pdf</strong>
                    </li>
                    <li>
                      Example: <em>DataStructures_CS101.pdf</em>
                    </li>
                  </ul>
                </div>
              )}

              {work.notes && (
                <div className="text-left text-sm text-gray-700 dark:text-gray-300 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-4">
                  <h3 className="font-bold text-green-600 mb-2">
                    Instructions for Notes:
                  </h3>
                  <ul className="list-disc list-inside">
                    <li>Upload a high-quality and clearly visible PDF.</li>
                    <li>
                      Use this naming convention:{" "}
                      <strong>TopicName_PaperCode_by_YourName.pdf</strong>
                    </li>
                    <li>
                      Example: <em>BinaryTrees_CS201_by_SnehaVerma.pdf</em>
                    </li>
                  </ul>
                </div>
              )}

              {work.books && (
                <div className="text-left text-sm text-gray-700 dark:text-gray-300 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-4">
                  <h3 className="font-bold text-green-600 mb-2">
                    Instructions for Books:
                  </h3>
                  <ul className="list-disc list-inside">
                    <li>Upload the cover image of the book.</li>
                    <li>
                      Select the appropriate genre (e.g., Programming,
                      Mathematics, Literature).
                    </li>
                    <li>
                      Fill in all the required details like Author, Edition,
                      price, etc.
                    </li>
                  </ul>
                </div>
              )}

              {work.ebooks && (
                <div className="text-left text-sm text-gray-700 dark:text-gray-300 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-4">
                  <h3 className="font-bold text-green-600 mb-2">
                    Instructions for E-Books:
                  </h3>
                  <ul className="list-disc list-inside">
                    <li>
                      Upload a high-quality and readable PDF of the E-Book.
                    </li>
                    <li>
                      Ensure metadata like title, author, and genre are filled
                      accurately.
                    </li>
                    <li>
                      Double-check for copyright issues. Only public or
                      permitted content is allowed.
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="col-span-1 sm:col-span-2 md:col-span-3 flex justify-center items-center">
            <button
              type="button"
              className={`buttonadd ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              } dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white`}
              onClick={addContribution}
              disabled={isUploading}
            >
              <span className="button__text">
                {isUploading ? "Uploading..." : "Contribute 🎉"}
              </span>
              <span className="button__icon">
                {isUploading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
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
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
