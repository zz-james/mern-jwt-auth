import axios from "axios";
import queryClient from "./queryClient";
import { navigate } from "../lib/navigation";

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

const API = axios.create(options);
const TokenRefClient = axios.create(options);
TokenRefClient.interceptors.response.use((response) => response.data);

API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { config, response } = error as { config: string; response: any };
    const { status, data } = response || {};

    // try to refresh the access token
    if (status === 401 && data?.errorCode === "InvalidAccessToken") {
      try {
        await TokenRefClient.get("/auth/refresh");
        return TokenRefClient(config);
      } catch {
        queryClient.clear();
        navigate("/login", {
          state: {
            redirectUrl: window.location.pathname,
          },
        });
      }
    }

    return Promise.reject({ status, ...data });
  }
);

export default API;
