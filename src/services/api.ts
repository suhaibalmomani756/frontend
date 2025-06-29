import axios, { InternalAxiosRequestConfig } from 'axios';
import { AuthResponse, Course, LoginCredentials, RegisterCredentials } from '../types';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Sending login request with:', credentials);
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      console.log('Login response from server:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error in authService:', error);
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },
};

export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses');
    return response.data;
  },

  async getInstructorCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses/instructor/my-courses');
    return response.data;
  },

  async createCourse(courseData: { title: string; description: string; instructorId: string }): Promise<Course> {
    const response = await api.post<Course>('/courses', courseData);
    return response.data;
  },

  async deleteCourse(courseId: string): Promise<void> {
    await api.delete(`/courses/${courseId}`);
  },
};

export const enrollmentService = {
  async enrollInCourse(courseId: string): Promise<void> {
    await api.post('/enrollments/enroll', { courseId });
  },

  async withdrawFromCourse(courseId: string): Promise<void> {
    await api.post('/enrollments/withdraw', { courseId });
  },

  async getMyCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>('/enrollments/my-courses');
    return response.data;
  },

  async getEnrolledStudents(courseId: string): Promise<{ id: string; name: string; email: string }[]> {
    const response = await api.get<{ id: string; name: string; email: string }[]>(`/enrollments/course/${courseId}/students`);
    return response.data;
  },
}; 