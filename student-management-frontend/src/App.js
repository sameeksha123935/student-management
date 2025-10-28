import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUserPlus,
  FaBookOpen,
  FaSearch,
  FaSort,
  FaFileCsv,
} from "react-icons/fa";

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", email: "", course: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // Fetch students
  const fetchStudents = () => {
    fetch("http://localhost:8080/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isEditing
      ? `http://localhost:8080/api/students/${formData.id}`
      : "http://localhost:8080/api/students";
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(() => {
        alert(isEditing ? "Student updated!" : "Student added!");
        setFormData({ id: "", name: "", email: "", course: "" });
        setIsEditing(false);
        fetchStudents();
      })
      .catch((err) => console.error("Error saving student:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      fetch(`http://localhost:8080/api/students/${id}`, { method: "DELETE" })
        .then(() => {
          alert("Student deleted!");
          fetchStudents();
        })
        .catch((err) => console.error("Error deleting student:", err));
    }
  };

  const handleEdit = (student) => {
    setFormData(student);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ id: "", name: "", email: "", course: "" });
    setIsEditing(false);
  };

  // Filter + Sort
  const filteredStudents = students
    .filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.course.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  // Pagination logic
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Export CSV
  const handleExportCSV = () => {
    const csvHeader = ["ID,Name,Email,Course"];
    const csvRows = students.map(
      (s) => `${s.id},"${s.name}","${s.email}","${s.course}"`
    );
    const csvData = [...csvHeader, ...csvRows].join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "students.csv";
    link.click();
  };

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">🎓 Student Management System</h2>
        <p className="text-muted">
          Manage students easily — Add, Edit, Delete, Search, or Export.
        </p>
      </div>

      {/* Search, Sort & Export */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="input-group w-50">
          <span className="input-group-text bg-white">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email or course"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <FaSort /> Sort ({sortOrder === "asc" ? "A→Z" : "Z→A"})
          </button>
          <button className="btn btn-success" onClick={handleExportCSV}>
            <FaFileCsv className="me-1" /> Export CSV
          </button>
        </div>
      </div>

      {/* Add Student */}
      <div className="card shadow-sm p-4 mb-4">
        <h5 className="mb-3 text-secondary">
          <FaUserPlus className="me-2 text-primary" />
          {isEditing ? "Edit Student" : "Add Student"}
        </h5>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              name="course"
              placeholder="Enter course"
              value={formData.course}
              onChange={handleChange}
              required
            />
          </div>
          <div className="text-center mt-3">
            <button type="submit" className="btn btn-success me-2">
              {isEditing ? "Update Student" : "Add Student"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Student List */}
      <div className="card shadow-sm p-4">
        <h5 className="mb-3 text-secondary">
          <FaBookOpen className="me-2 text-warning" />
          Student List
        </h5>
        <table className="table table-hover text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((s,index) => (
                <tr key={s.id}>
                  <td>{indexOfFirst + index + 1}</td>

                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.course}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-muted">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
