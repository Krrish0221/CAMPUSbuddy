import axios from 'axios';

// Uncomment and use this in API routes when Python server is ready
// import pythonApi from '@/lib/pythonApi';
// const data = await pythonApi.get('/menu-items');

const pythonApi = axios.create({
  baseURL: process.env.PYTHON_API_URL || 'http://localhost:8000',
  headers: {
    'x-internal-secret': process.env.INTERNAL_API_SECRET || '',
  },
});

export default pythonApi;
