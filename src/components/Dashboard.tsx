import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Alert,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { courseService, enrollmentService } from "../services/api";
import { Course } from "../types";

interface EnrolledStudent {
  id: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [userRole, setUserRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>(
    []
  );
  const [isStudentListOpen, setIsStudentListOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole") as "STUDENT" | "INSTRUCTOR";

    if (!token || !role) {
      navigate("/login");
      return;
    }

    setUserRole(role);

    // Load courses based on role
    const loadCourses = async () => {
      try {
        if (role === "INSTRUCTOR") {
          const instructorCourses = await courseService.getInstructorCourses();
          setCourses(instructorCourses);
        } else {
          const studentCourses = await enrollmentService.getMyCourses();
          setCourses(studentCourses);
          // Load available courses for students
          const allCourses = await courseService.getAllCourses();
          // Filter out courses that are already enrolled in or deleted
          setAvailableCourses(
            allCourses.filter(
              (course) =>
                !studentCourses.some((enrolled) => enrolled.id === course.id) &&
                course.id // Ensure course exists and is not deleted
            )
          );
        }
      } catch (error) {
        console.error("Error loading courses:", error);
        setError("Failed to load courses");
      }
    };

    loadCourses();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleCreateCourse = () => {
    navigate("/create-course");
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await courseService.deleteCourse(courseId);
      // Refresh the course list after deletion
      const updatedCourses = await courseService.getInstructorCourses();
      setCourses(updatedCourses);
    } catch (error) {
      console.error("Error deleting course:", error);
      setError("Failed to delete course");
    }
  };

  const handleViewStudents = async (course: Course) => {
    try {
      setSelectedCourse(course);
      const students = await enrollmentService.getEnrolledStudents(course.id);
      setEnrolledStudents(students);
      setIsStudentListOpen(true);
    } catch (error) {
      console.error("Error loading enrolled students:", error);
      setError("Failed to load enrolled students");
    }
  };

  const handleEnrollInCourse = async (courseId: string) => {
    try {
      await enrollmentService.enrollInCourse(courseId);
      // Refresh both enrolled and available courses
      const studentCourses = await enrollmentService.getMyCourses();
      setCourses(studentCourses);
      const allCourses = await courseService.getAllCourses();
      setAvailableCourses(
        allCourses.filter(
          (course) =>
            !studentCourses.some((enrolled) => enrolled.id === course.id)
        )
      );
    } catch (error) {
      console.error("Error enrolling in course:", error);
      setError("Failed to enroll in course");
    }
  };

  const handleWithdrawFromCourse = async (courseId: string) => {
    try {
      await enrollmentService.withdrawFromCourse(courseId);
      // Refresh both enrolled and available courses
      const studentCourses = await enrollmentService.getMyCourses();
      setCourses(studentCourses);
      const allCourses = await courseService.getAllCourses();
      setAvailableCourses(
        allCourses.filter(
          (course) =>
            !studentCourses.some((enrolled) => enrolled.id === course.id) &&
            course.id
        )
      );
    } catch (error) {
      console.error("Error withdrawing from course:", error);
      setError("Failed to withdraw from course");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Course Management System
          </Typography>
          {userRole === "INSTRUCTOR" && (
            <Button color="inherit" onClick={handleCreateCourse}>
              Create Course
            </Button>
          )}
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {userRole === "STUDENT" && (
          <>
            <Typography variant="h4" gutterBottom>
              Enrolled Courses
            </Typography>
            {courses.length === 0 ? (
              <Typography>No courses enrolled.</Typography>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  mb: 4,
                }}
              >
                {courses.map((course) => (
                  <Card key={course.id}>
                    <CardContent>
                      <Typography variant="h6">{course.title}</Typography>
                      <Typography color="text.secondary">
                        {course.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<ExitToAppIcon />}
                        onClick={() => handleWithdrawFromCourse(course.id)}
                      >
                        Withdraw
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}

            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
              Available Courses
            </Typography>
            {availableCourses.length === 0 ? (
              <Typography>No available courses to enroll in.</Typography>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                }}
              >
                {availableCourses.map((course) => (
                  <Card key={course.id}>
                    <CardContent>
                      <Typography variant="h6">{course.title}</Typography>
                      <Typography color="text.secondary" sx={{ mb: 1 }}>
                        {course.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <SchoolIcon fontSize="small" />
                        Instructor: {course.instructor?.email || "Unknown"}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<SchoolIcon />}
                        onClick={() => handleEnrollInCourse(course.id)}
                      >
                        Enroll
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </>
        )}

        {userRole === "INSTRUCTOR" && (
          <>
            <Typography variant="h4" gutterBottom>
              My Courses
            </Typography>
            {courses.length === 0 ? (
              <Typography>No courses found.</Typography>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                }}
              >
                {courses.map((course) => (
                  <Card key={course.id}>
                    <CardContent>
                      <Typography variant="h6">{course.title}</Typography>
                      <Typography color="text.secondary">
                        {course.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<PeopleIcon />}
                        onClick={() => handleViewStudents(course)}
                      >
                        View Students
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Dialog for displaying enrolled students */}
      <Dialog
        open={isStudentListOpen}
        onClose={() => setIsStudentListOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enrolled Students - {selectedCourse?.title}</DialogTitle>
        <DialogContent>
          {enrolledStudents.length === 0 ? (
            <Typography>No students enrolled in this course.</Typography>
          ) : (
            <List>
              {enrolledStudents.map((student) => (
                <ListItem key={student.id}>
                  <ListItemText primary={student.email} secondary="Student" />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsStudentListOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
