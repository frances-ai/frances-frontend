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
            console.log('Server');
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
            console.log('Server');
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
            console.log('Server');
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
            console.log('Server');
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
            console.log('server');
            try {
                localStorage.setItem(key, JSON.stringify(response.data));
            } catch (e) {
                console.log(e);
                localStorage.clear();
            }

            return response;
        })
    }

    getAllCollectionName() {
        const key = 'allCollectionNames';
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }

        return new Promise((resolve => {
            // fake server call
            const collectionNames = [
                'Encyclopaedia Britannica (1768-1860)',
                'Chapbooks printed in Scotland',
                'Ladies’ Edinburgh Debating Society'
            ]
            resolve({
                data: collectionNames
            });
        }));

        /*return axios.post("/query/allCollectionName").then(response => {
            console.log('Server');
            try {
                localStorage.setItem(key, JSON.stringify(response.data));
            } catch (e) {
                console.log(e);
                localStorage.clear();
            }

            return response;
        })*/
    }

    getAllEditionNameFromEB() {
        const key = 'allEditionNamesFromEB';
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }

        return new Promise((resolve => {
            // fake server call
            const editionNames = [
                'Encyclopaedia Britannica (1768-1860)',
                'Chapbooks printed in Scotland',
                'Ladies’ Edinburgh Debating Society'
            ]
            resolve({
                data: editionNames
            });
        }));

        /*return axios.post("/query/allEditionNames").then(response => {
            console.log('Server');
            try {
                localStorage.setItem(key, JSON.stringify(response.data));
            } catch (e) {
                console.log(e);
                localStorage.clear();
            }

            return response;
        })*/
    }

    getAllDefoeQueries() {
        const key = "defoe-queries";
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }

        return axios.get("http://34.125.20.38:5000/api/v1/query/defoe_list").then(response => {
            console.log('Server');
            try {
                localStorage.setItem(key, JSON.stringify(response.data));
            } catch (e) {
                console.log(e);
                localStorage.clear();
            }

            return response;
        })
    }

    uploadFile(file) {
        return axios.post("http://34.125.20.38:5000/api/v1/query/upload", {
            file: file,
        },{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            return response;
        })
    }

    submitDefoeQuery(data) {
        return axios.post("http://34.125.20.38:5000/api/v1/query/defoe_submit", data).then(response => {
            return response;
        })
    }

    getDefoeQueryStatus(id) {
        return axios.get("http://34.125.20.38:5000/api/v1/query/defoe_status", {
            params: {
                id: id,
            },
        }).then(response => {
            return response;
        })
    }

}

export default new QueryAPI();