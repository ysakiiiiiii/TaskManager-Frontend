export interface RegisterFormState {
  firstName: string;
  lastName: string;
  username: string; 
  password: string;
  confirmPassword: string;
  agree: boolean;
}
export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  errors?: string[];
}
export interface AuthContextProps {
  user: any;
  role: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  userCreated: string;
  userModified: string | null;
}
