import api from "./axiosClient";

export const registerUser = async ({ name, email, password }) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data; // { user, token }
};

export const loginUser = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { user, token }
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data.user;
};
