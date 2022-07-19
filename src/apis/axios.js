import axios from "axios";
import Config from '../config.json'

export default axios.create({
    baseURL: Config.BACKEND_BASE_URL
})