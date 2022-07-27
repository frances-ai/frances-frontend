import axios from "./axios";

class QueryAPI {
    searchTerm(term, page = 1) {
        return axios.post("/query/term_search", {
            search: term,
            page: page
        })
    }

    searchSimilarTerms(resource_uri, page = 1) {
        return axios.post("/query/similar_terms", {
            resource_uri: resource_uri,
            page: page
        })
    }

    searchTopicModels(model_name_or_number, page = 1) {
        return axios.post("/query/topic_modelling", {
            topic_name: model_name_or_number,
            page: page
        })
    }
}

export default new QueryAPI();