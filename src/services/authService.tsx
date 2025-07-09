import api from "../api/api";

export interface RegisterDto {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export const registerUser = async (data: RegisterDto) => {
  const response = await api.post("/User/Register", data);
  return response;
};
