import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_RESAS_API_KEY;
const apiClient = axios.create({
  baseURL: 'https://opendata.resas-portal.go.jp/api/v1',
  headers: {
    'X-API-KEY': API_KEY,
  },
});

export default apiClient;
