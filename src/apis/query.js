import {axiosPrivate, axiosPublic} from "./axios";
import {queryMeta, eb_levels, nls_levels} from './queryMeta.js'
import FileDownload from 'js-file-download';
import {store_response_data_in_local_storage} from "./util";

class QueryAPI {

    get_terms_by_concept_uri(concept_uri) {
        return axiosPublic.post("/search/concept_term_records", {"concept_uri": concept_uri}).then(response => {
            console.log('Server');
            return response;
        })
    }

    get_similar_records(record_uri, collection_name) {
        return axiosPublic.post("/search/similar_records", {record_uri: record_uri, collection: collection_name}).then(response => {
            console.log('Server');
            return response;
        })
    }

    get_word_frequencies(record_name, collection_name){
        return axiosPublic.post("/search/word_frequencies", {record_name: record_name, collection: collection_name}).then(response => {
            console.log('Server');
            return response;
        })
    }

    search(query) {
        return axiosPublic.get("/search", {params: query}).then(response => {
            console.log('Server');
            return response;
        })
    }

    get_similar_record_descriptions(record_uri, collection_name) {
        return axiosPublic.post("/search/similar_record_descriptions", {record_uri: record_uri, collection: collection_name}).then(response => {
            console.log('Server');
            return response;
        })
    }


    check_page_exists(page_path) {
        const key = 'check_page_exists' + page_path;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }

        return axiosPublic.get("/search/page_exists", {params: {page_path: page_path}}).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }


    get_page_display_info(page_path) {
        const key = 'get_page_display_info' + page_path;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }

        return axiosPublic.get("/search/page_display", {params: {page_path: page_path}}).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }


    get_page_info(page_path) {
        const key = 'get_page_info' + page_path;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }

        return axiosPublic.get("/search/page", {params: {page_path: page_path}}).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }

    get_term_info(term_path) {
        const key = 'get_term_info' + term_path;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }

        return axiosPublic.get("/search/term", {params: {term_path: term_path}}).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }

    get_location_record_info(record_path) {
        const key = 'get_location_record_info' + record_path;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }

        return axiosPublic.get("/search/location_record", {params: {record_path: record_path}}).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }

    get_broadside_record_info(record_path) {
        const key = 'get_broadside_record_info' + record_path;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }

        return axiosPublic.get("/search/broadside", {params: {record_path: record_path}}).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }

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

    get_kg_triples(entry_uri) {
        // const test_data = [{'pre': {'type': 'uri', 'value': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'}, 'obj': {'type': 'uri', 'value': 'https://w3id.org/hto#InformationResource'}}, {'pre': {'type': 'uri', 'value': 'http://www.w3.org/ns/prov#wasAttributedTo'}, 'obj': {'type': 'uri', 'value': 'https://w3id.org/hto/Organization/NCKP'}}, {'pre': {'type': 'uri', 'value': 'http://www.w3.org/ns/prov#wasAttributedTo'}, 'obj': {'type': 'uri', 'value': 'https://pdf.abbyy.com'}}, {'pre': {'type': 'uri', 'value': 'http://www.w3.org/ns/prov#value'}, 'obj': {'type': 'literal', 'value': './eb07_TXT_v2/e8/kp-eb0708-039107-8218-v2.txt'}}]
        // return new Promise((resolve => {
        //     console.log('Test data');
        //     resolve(test_data);
        // }));
        return axiosPublic.post("/search/hto_triples", {
            entry_uri: entry_uri,
        }).then(response => {
            console.log('Server');
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


    getSourceProviders(collection) {
        if (collection === 'Encyclopaedia Britannica') {
            return ["NLS", "HQ", "NeuSpell"];
        } else {
            return ["NLS", "NeuSpell"];
        }
    }

    getLevels(collection) {
        if (collection === 'Encyclopaedia Britannica') {
            return eb_levels;
        } else {
            return nls_levels;
        }
    }

    getQueryMeta(collection) {
        if (collection === 'Encyclopaedia Britannica') {
            return queryMeta['EB'];
        } else {
            return queryMeta['NLS'];
        }
    }

    getAllDefoeQueryTasks(options) {
        return axiosPrivate.post("/query/defoe_query_tasks", options).then(response => {
            return response;
        })
    }


    deleteDefoeQueryTasks(task_ids) {
        return axiosPrivate.post("/query/delete_defoe_query_tasks", {taskIDs: task_ids}).then(response => {
            return response;
        })
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