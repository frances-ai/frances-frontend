import axios, {axiosPrivate, axiosRefresh} from "./axios";

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
        return await axiosRefresh.post("/auth/token/refresh");
    }

    async emailRegistered(email) {
        return await axios.post("/auth/emailRegistered", {
            email: email,
        });
    }

    async getProfile() {
        return await axiosPrivate.get("protected/auth/profile");
    }
}

export default new AuthAPI()