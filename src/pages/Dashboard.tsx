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
  Alert,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { courseService, enrollmentService } from "../services/api";
import { Course } from "../types";
import StudentDashboard from "../components/StudentDashboard";
import InstructorDashboard from "../components/InstructorDashboard";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [userRole, setUserRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");
  const [error, setError] = useState("");

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
          <StudentDashboard
            enrolledCourses={courses}
            availableCourses={availableCourses}
            onEnroll={handleEnrollInCourse}
            onWithdraw={handleWithdrawFromCourse}
          />
        )}

        {userRole === "INSTRUCTOR" && (
          <InstructorDashboard
            courses={courses}
            onDeleteCourse={handleDeleteCourse}
          />
        )}
      </Container>
    </Box>
  );
};

export default Dashboard; 