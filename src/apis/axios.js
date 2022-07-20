import axios from "axios";
import Config from '../config.json'
import AuthAPI from "./auth";

export default axios.create({
    baseURL: Config.BACKEND_BASE_URL
})

export const axiosPrivate = axios.create({
    baseURL: Config.BACKEND_BASE_URL,
    withCredentials: true
})

export const axiosRefresh = axios.create({
    baseURL: Config.BACKEND_BASE_URL,
    withCredentials: true
})


axiosPrivate.interceptors.response.use(
    response => response,
    // Refresh token when access token expires.
    async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
            prevRequest.sent = true;
            //refresh
            const refresh_response = await AuthAPI.refresh();
            console.log(refresh_response.data);
            return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
    }
);
