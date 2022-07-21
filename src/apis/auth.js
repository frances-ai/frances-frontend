import axios, {axiosPrivate} from "./axios";
import Cookies from 'js-cookie'

class AuthAPI {
    login(email, password) {
        return axios.post( "/auth/login", {
            email: email,
            password: password
        });
    }

    register(first_name, last_name, email, password) {
        return axios.post( "/auth/register", {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password
        });
    }

    async refresh() {
        const options =  {
            headers:
                {"X-CSRF-TOKEN": Cookies.get('csrf_refresh_token')
                }}
        return await axios.post("/auth/token/refresh",{},  options);
    }

    async emailRegistered(email) {
        return await axios.post("/auth/emailRegistered", {
            email: email,
        });
    }

    async getProfile() {
        return await axiosPrivate.get("protected/auth/profile");
    }

    logout() {
        return axios.post("/auth/logout");
    }

}

export default new AuthAPI()