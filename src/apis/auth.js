import {axiosPrivate, axiosPublic} from "./axios";
import Cookies from 'js-cookie'

class AuthAPI {
    login(email, password) {
        return axiosPublic.post( "/auth/login", {
            email: email,
            password: password
        });
    }

    register(first_name, last_name, email, password) {
        return axiosPublic.post( "/auth/register", {
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
        return await axiosPublic.post("/auth/token/refresh",{},  options);
    }

    async emailRegistered(email) {
        return await axiosPublic.post("/auth/emailRegistered", {
            email: email,
        });
    }

    async getProfile() {
        return await axiosPrivate.get("auth/profile");
    }

    logout() {
        return axiosPublic.post("/auth/logout");
    }

}

export default new AuthAPI()