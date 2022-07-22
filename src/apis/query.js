import axios from "./axios";

class QueryAPI {
    searchTerm(term) {
        return axios.post("/query/term_search", {
            search: term
        })
    }
}

export default new QueryAPI();