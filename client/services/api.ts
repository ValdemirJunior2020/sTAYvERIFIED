// File: client/services/api.ts

import axios from "axios";

const API_BASE_URL = "http://localhost:5050";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export default api;