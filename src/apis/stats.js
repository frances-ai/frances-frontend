import {axiosPublic} from "./axios";

class StatsAPI {
    add_visit(path) {
        return axiosPublic.post( "/stats/add_visit", {
            page: path
        });
    }

    get_number_of_visits() {
        return axiosPublic.get( "/stats/num_visit");
    }
}
export default new StatsAPI();
