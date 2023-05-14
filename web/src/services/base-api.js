import axios from 'axios'

const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
})

http.interceptors.request.use(
  config => {
    const token = localStorage.getItem('user-access-token')
    console.debug('Handling request interceptor token >> ', token)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

http.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const status = error.response?.status;
    if (status === 401 && !window.location.href.includes('login')) {
      localStorage.removeItem('current-user');
      localStorage.removeItem('user-access-token');
      window.location.href = '/login'
      return Promise.resolve();
    } else {
      return Promise.reject(error)
    }
  }
)

export default http