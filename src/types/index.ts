export interface User {
  id: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructor?: {
    id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  role: 'STUDENT' | 'INSTRUCTOR';
} 