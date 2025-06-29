import React, { useState } from "react";
import {
  Typography,
  Button,
  Box,
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import { enrollmentService } from "../services/api";
import { Course } from "../types";

interface EnrolledStudent {
  id: string;
  email: string;
}

interface InstructorDashboardProps {
  courses: Course[];
  onDeleteCourse: (courseId: string) => void;
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  courses,
  onDeleteCourse,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([]);
  const [isStudentListOpen, setIsStudentListOpen] = useState(false);

  const handleViewStudents = async (course: Course) => {
    try {
      setSelectedCourse(course);
      const students = await enrollmentService.getEnrolledStudents(course.id);
      setEnrolledStudents(students);
      setIsStudentListOpen(true);
    } catch (error) {
      console.error("Error loading enrolled students:", error);
    }
  };

  return (
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
                  onClick={() => onDeleteCourse(course.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

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
    </>
  );
};

export default InstructorDashboard; 