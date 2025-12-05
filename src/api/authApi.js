import axios from "axios";

const API_URL = "https://flask-backend-2pd6.onrender.com/";

const instance = axios.create({ baseURL: API_URL });

// USER AUTH
export function signup(payload) {
  console.log("payload", payload);
  return instance.post("auth/signup", payload, { withCredentials: true });
}

export function login(payload) {
  return instance.post("auth/login", payload, { withCredentials: true });
}
export function fetchDashboard(token) {
  return instance.get(`profile/user/${token}`);
}

export function getUser(token) {
  return instance.get("/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateUser(token, payload) {
  return instance.put("/user/update", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function deleteUser(token) {
  return instance.delete("/user/delete", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// USER PROFILES (multiple profiles for 1 user)
export function createProfile(token, payload) {
  return instance.post("/profile/create", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getAllProfiles(token) {
  return instance.get("/profile/all", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getProfile(token, id) {
  return instance.get(`/profile/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateProfile(token, id, payload) {
  return instance.put(`/profile/update/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function deleteProfile(token, id) {
  return instance.delete(`/profile/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
