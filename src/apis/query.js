import {axiosPrivate, axiosPublic} from "./axios";
import {queryMeta} from './queryMeta.js'
import FileDownload from 'js-file-download';
import {store_response_data_in_local_storage} from "./util";

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

        return axiosPublic.post("/query/term_search", {
            search: term,
            page: page
        }).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
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

        return axiosPublic.post("/query/similar_terms", {
            resource_uri: resource_uri,
            page: page
        }).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
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

        return axiosPublic.post("/query/topic_modelling", {
            topic_name: model_name_or_number,
            page: page
        }).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
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

        return axiosPublic.post("/query/spelling_checker", {
            resource_uri: uri,
        }).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }

    visualise(uri, collection) {
        const key = 'visualise' + uri + collection;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }

        return axiosPublic.post("/query/visualization_resources", {
            resource_uri: uri,
            collection: collection
        }).then(response => {
            console.log('server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }

    getAllDefoeQueryTypes() {
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

        return axiosPublic.get("/query/defoe_list").then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }

    uploadFile(file) {
        return axiosPrivate.post("/query/upload", {
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
        return axiosPrivate.post("/query/defoe_submit", data).then(response => {
            //TODO remove it when this endpoint is refined.

            // Fake bug fix for publication_normailisation query submission. 
            if (response.data.success && response.data.results != null) {
                // publication_normailisation query
                response.data = {
                    success: true,
                    id: "publication_normalisation"
                }
                return response;
            }
            return response;
        })
    }

    getDefoeQueryTaskByTaskID(task_id) {
        return axiosPrivate.post("/query/defoe_query_task", {
            task_id: task_id
        }).then(response => {
            return response;
        })
    }

    getDefoeQueryStatus(id) {
        return axiosPrivate.post("/query/defoe_status", {
            id: id
        }).then(response => {
            return response;
        })
    }

    getDefoeQueryResult(result_filename) {
        return axiosPrivate.post("/query/defoe_query_result", {
            result_filename: result_filename
        }).then(response => {
            return response;
        })
    }

    getQueryMeta(collection) {
        if (collection === 'Encyclopaedia Britannica') {
            return queryMeta['EB'];
        } else {
            return queryMeta['NLS'];
        }
    }

    getAllDefoeQueryTasks() {
        return axiosPrivate.post("/query/defoe_query_tasks").then(response => {
            return response;
        })
    }


    getAllDefoeQueryTasksForUser(user_id) {
        console.log("User ID:", user_id);
        return axiosPrivate.post("/query/defoe_query_tasks_for_user", {
            user_id: user_id,
        });
    }

    download(resultFileName, downloadFileName) {
        return axiosPrivate.post("/query/download", {
            result_filename: resultFileName
        }, {
            responseType: 'blob'
        }).then(response => {

            FileDownload(response.data, downloadFileName)
            return response;
        })
    }

    cancelDefoeQueryTask(task_id) {
        return axiosPrivate.post("/query/defoe_cancel", {
            id: task_id
        }).then(response => {
            return response;
        })
    }

}

export default new QueryAPI();