import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://example.com/api',
  timeout: 10000,
});

export const fetchWildlifeData = async (endpoint) => {
  const response = await apiClient.get(endpoint);
  return response.data;
};

export default apiClient;
