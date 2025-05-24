import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // حسب سيرفرك (يفترض أن الباكند موجود على نفس الدومين)
  withCredentials: true, // لتفعيل الكوكيز
});

export default api;
