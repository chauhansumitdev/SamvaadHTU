import axios from 'axios';

const baseURL = 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const authRoutes = {
  login: (data) => axiosInstance.post('/login', data),
  register: (data) => axiosInstance.post('/register', data),
};

const otherRoutes = {
  home: () => axiosInstance.get('/home'),
  createPost: (data) => axiosInstance.post('/create-post', data),
  profile: () => axiosInstance.get('/profile'),
  createComment: (postId, data) => axiosInstance.post(`/create-comment/${postId}`, data),
  getComments: (postId) => axiosInstance.get(`/get-comments/${postId}`),
  getFormsList: () => axiosInstance.get('/forms'),
  getForm: (formId) => axiosInstance.get(`/forms/${formId}`),
  submitForm: (formId, data) => axiosInstance.post(`/submit-form/${formId}`, data),
  notifications: () => axiosInstance.get('/notifications'),
  reportForm: (data) => axiosInstance.post('/submit-your-form', data),
  chatbot: (text) => axiosInstance.post('/chatbot', { text }),
  emergency:(emergencyDetails) => axiosInstance.post('/submit-emergency',emergencyDetails),
};

export { authRoutes, otherRoutes };
