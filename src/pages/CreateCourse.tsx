import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { courseService } from '../services/api';
import { createCourseSchema } from '../validators';

interface CreateCourseForm {
  title: string;
  description: string;
}

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseForm>({
    resolver: yupResolver(createCourseSchema),
  });

  const onSubmit = async (data: CreateCourseForm) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const payload = JSON.parse(atob(token.split('.')[1]));
      await courseService.createCourse({ ...data, instructorId: payload.userId });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Create New Course
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Course Title"
              autoFocus
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message as string}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Course Description"
              multiline
              rows={4}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message as string}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Course
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateCourse; 