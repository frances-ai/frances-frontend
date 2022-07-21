import axios from "axios";
import Config from '../config.json'
import AuthAPI from "./auth";
import Cookies from 'js-cookie'

export default axios.create({
    baseURL: Config.BACKEND_BASE_URL,
    withCredentials: true
})

export const axiosPrivate = axios.create({
    baseURL: Config.BACKEND_BASE_URL,
    withCredentials: true
})

axiosPrivate.interceptors.request.use(
    config => {
        if (!config.headers["X-CSRF-TOKEN"]) {
            config.headers["X-CSRF-TOKEN"] = Cookies.get('csrf_access_token');
        }
        return config;
    }, error => Promise.reject(error)
)

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
