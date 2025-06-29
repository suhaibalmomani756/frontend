import React from "react";
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Course } from "../types";

interface StudentDashboardProps {
  enrolledCourses: Course[];
  availableCourses: Course[];
  onEnroll: (courseId: string) => void;
  onWithdraw: (courseId: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  enrolledCourses,
  availableCourses,
  onEnroll,
  onWithdraw,
}) => {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Enrolled Courses
      </Typography>
      {enrolledCourses.length === 0 ? (
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
          {enrolledCourses.map((course) => (
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
                  onClick={() => onWithdraw(course.id)}
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
                  onClick={() => onEnroll(course.id)}
                >
                  Enroll
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
};

export default StudentDashboard; 