import axios from "./axios";

class QueryAPI {
    searchTerm(term, page = 1) {
        const key = 'searchTerm' + term + page;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }

        return axios.post("/query/term_search", {
            search: term,
            page: page
        }).then(response => {
            console.log('test');
            try {
                localStorage.setItem(key, JSON.stringify(response.data));
            } catch (e) {
                console.log(e);
                localStorage.clear();
            }

            return response;
        })
    }

    searchSimilarTerms(resource_uri, page = 1) {
        const key = 'searchSimilarTerms' + resource_uri + page;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }

        return axios.post("/query/similar_terms", {
            resource_uri: resource_uri,
            page: page
        }).then(response => {
            console.log('test');
            try {
                localStorage.setItem(key, JSON.stringify(response.data));
            } catch (e) {
                console.log(e);
                localStorage.clear();
            }
            return response;
        })
    }

    searchTopicModels(model_name_or_number, page = 1) {
        const key = 'searchTopicModels' + model_name_or_number + page;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }

        return axios.post("/query/topic_modelling", {
            topic_name: model_name_or_number,
            page: page
        }).then(response => {
            console.log('test');
            try {
                localStorage.setItem(key, JSON.stringify(response.data));
            } catch (e) {
                console.log(e);
                localStorage.clear();
            }

            return response;
        })
    }

    checkSpell(uri) {
        const key = 'checkSpell' + uri;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }

        return axios.post("/query/spelling_checker", {
            resource_uri: uri,
        }).then(response => {
            console.log('test');
            try {
                localStorage.setItem(key, JSON.stringify(response.data));
            } catch (e) {
                console.log(e);
                localStorage.clear();
            }

            return response;
        })
    }

    visualise(uri) {
        const key = 'visualise' + uri;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }

        return axios.post("/query/visualization_resources", {
            resource_uri: uri,
        }).then(response => {
            console.log('test');
            try {
                localStorage.setItem(key, JSON.stringify(response.data));
            } catch (e) {
                console.log(e);
                localStorage.clear();
            }

            return response;
        })
    }
}

export default new QueryAPI();