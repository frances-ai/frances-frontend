import axios from "./axios";

class AuthAPI {
    login(email, password) {
        return axios.post( "/auth/login", {
            email: email,
            password: password
        })
    }

    register(first_name, last_name, email, password) {
        return axios.post( "/auth/register", {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password
        })
    }

    async emailRegistered(email) {
        return await axios.post("/auth/emailRegistered", {
            email: email,
        })
    }
}

export default new AuthAPI()