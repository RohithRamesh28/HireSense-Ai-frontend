import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8070';

export default axios;
