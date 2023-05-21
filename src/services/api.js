import axios from 'axios';

const api = axios.create({
  baseURL: "https://finances-server-production.up.railway.app/api/v1",
})

export default api;