import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const backendUrl = "http://192.168.0.118:5000";

const api = axios.create({
  baseURL: "http://192.168.0.118:5000", 
  timeout: 10000,
}) 

let authToken = null;
export const setAuthToken = (token) => {
  authToken = token;
  api.defaults.headers.common["authorization"] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  authToken = null;
   delete api.defaults.headers.common["authorization"];
};

export const loadAuthToken = async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) authToken = token;
};

api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api


