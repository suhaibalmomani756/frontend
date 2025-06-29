import * as yup from 'yup';

export const createCourseSchema = yup.object().shape({
  title: yup.string().required('Course title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Course description is required').min(10, 'Description must be at least 10 characters'),
}); 