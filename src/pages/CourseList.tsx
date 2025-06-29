import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Alert,
} from '@mui/material';
import { courseService, enrollmentService } from '../services/api';
import { Course } from '../types';

const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<'STUDENT' | 'INSTRUCTOR'>('STUDENT');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        // Get user role from localStorage
        const role = localStorage.getItem('userRole');
        console.log('Raw user role from localStorage:', role);
        
        if (!role) {
          console.error('No user role found in localStorage');
          navigate('/login');
          return;
        }

        const userRole = role as 'STUDENT' | 'INSTRUCTOR';
        console.log('Parsed user role:', userRole);
        setUserRole(userRole);

        if (userRole === 'INSTRUCTOR') {
          console.log('Loading instructor courses...');
          const instructorCourses = await courseService.getInstructorCourses();
          console.log('Instructor Courses:', instructorCourses);
          setCourses(instructorCourses);
        } else {
          console.log('Loading all courses...');
          const availableCourses = await courseService.getAllCourses();
          console.log('Available Courses:', availableCourses);
          setCourses(availableCourses);
        }
      } catch (err: any) {
        console.error('Error loading courses:', err);
        setError(err.response?.data?.message || 'Error loading courses');
      }
    };

    loadCourses();
  }, [navigate]);

  const handleEnroll = async (courseId: string) => {
    try {
      console.log('Enrolling in course:', courseId);
      await enrollmentService.enrollInCourse(courseId);
      // After enrolling, refresh the course list
      const availableCourses = await courseService.getAllCourses();
      setCourses(availableCourses);
    } catch (err: any) {
      console.error('Error enrolling:', err);
      setError(err.response?.data?.message || 'Error enrolling in course');
    }
  };

  const handleWithdraw = async (courseId: string) => {
    try {
      console.log('Withdrawing from course:', courseId);
      await enrollmentService.withdrawFromCourse(courseId);
      // After withdrawing, refresh the course list
      const availableCourses = await courseService.getAllCourses();
      setCourses(availableCourses);
    } catch (err: any) {
      console.error('Error withdrawing:', err);
      setError(err.response?.data?.message || 'Error withdrawing from course');
    }
  };

  const handleDelete = async (courseId: string) => {
    try {
      console.log('Deleting course:', courseId);
      await courseService.deleteCourse(courseId);
      // After deleting, refresh the instructor's course list
      const instructorCourses = await courseService.getInstructorCourses();
      setCourses(instructorCourses);
    } catch (err: any) {
      console.error('Error deleting:', err);
      setError(err.response?.data?.message || 'Error deleting course');
    }
  };

  console.log('Current user role in render:', userRole);
  console.log('Current courses in render:', courses);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {userRole === 'INSTRUCTOR' ? 'My Courses' : 'Available Courses'}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {courses.map((course) => (
            <Card key={course.id}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography color="text.secondary">
                  {course.description}
                </Typography>
              </CardContent>
              <CardActions>
                {userRole === 'STUDENT' ? (
                  <>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Enroll
                    </Button>
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => handleWithdraw(course.id)}
                    >
                      Withdraw
                    </Button>
                  </>
                ) : (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </Box>
        {courses.length === 0 && (
          <Typography>No courses available at the moment.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default CourseList; 