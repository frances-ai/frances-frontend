import axios from "./axios";

class QueryAPI {
    searchTerm(term, page = 1) {
        return axios.post("/query/term_search", {
            search: term,
            page: page
        })
    }
}

export default new QueryAPI();