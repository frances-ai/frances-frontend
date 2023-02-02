import axios from "axios";
import AuthAPI from "./auth";
import Cookies from 'js-cookie'
import config from '../config.json'

let baseUrl = config.BACKEND_BASE_URL;
if (process.env.REACT_APP_FRANCES_API_ADDRESS !== undefined && process.env.REACT_APP_FRANCES_API_ADDRESS !== null) {
    baseUrl = process.env.REACT_APP_FRANCES_API_ADDRESS;
}

export default axios.create({
    baseURL: baseUrl,
    withCredentials: true
})

export const axiosPrivate = axios.create({
    baseURL: baseUrl,
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
