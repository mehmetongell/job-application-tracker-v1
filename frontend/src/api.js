import axios from 'axios';

const API = axios.create({
  baseURL: 'https://job-application-tracker-v1-qm6h.onrender.com/api', 
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;