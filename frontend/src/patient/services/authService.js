import axiosInstance from '../../api/axiosInstance';

export const loginUser = async (email, password) => {
  const response = await axiosInstance.post('/Auth/Login', { email, password });
  return response.data;
};

export const signupUser = async (
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  phone,
  gender,
  dob
) => {
  const response = await axiosInstance.post('/Auth/Register', {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phoneNumber: phone,
    gender,
    dateOfBirth: dob
  });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post('/Auth/forgot-password', { email });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await axiosInstance.post('/Auth/verify-otp', { email, otp });
  return response.data;
};

export const resetPassword = async (email, resetToken, newPassword) => {
  const response = await axiosInstance.post('/Auth/reset-password', {
    resetToken: resetToken,
    newPassword: newPassword,
    confirmPassword: newPassword
  });
  return response.data;
};