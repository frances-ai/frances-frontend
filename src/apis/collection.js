import {getBaseUrl, axiosPublic} from "./axios";
import {store_response_data_in_local_storage} from "./util";

class CollectionAPI{
    async get_collections() {
        const key = 'collections';
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }
        return await axiosPublic.get("/collection/list").then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }

    async get_collection_detail(uri) {
        const key = 'collection' + uri;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }
        return await axiosPublic.post("/collection/", {uri: uri}).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }


    get_image_url(image_name) {
        return getBaseUrl() + "/collection/image?name=" + image_name;
    }

    async get_eb_editions() {
        const key = 'eb_edition';
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }
        return await axiosPublic.get("/collection/eb_edition/list").then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }

    async get_eb_edition_detail(uri) {
        const key = 'eb_edition' + uri;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }
        return await axiosPublic.get("/collection/eb_edition", {params: {uri: uri}}).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }

    async get_nls_serie_detail(collection, uri) {
        const key = 'nls_serie' + uri;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }
        return await axiosPublic.get("/collection/nls_serie", {params: {collection: collection, uri: uri}}).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }

    async get_nls_series(collection) {
        const key = 'nls_series' + collection;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }
        return await axiosPublic.get("/collection/nls_serie/list", {params: {collection: collection}}).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }

    async get_volumes(collection, edition_uri) {
        const key = 'volumes' + edition_uri;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }
        return await axiosPublic.get("/collection/volume/list", {params: {collection: collection, uri: edition_uri}}).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }

    async get_volume_detail(collection, volume_uri) {
        const key = 'volume' + volume_uri;
        const result = localStorage.getItem(key);
        if (result) {
            return new Promise((resolve => {
                console.log('Local');
                resolve({
                    data: JSON.parse(result)
                });
            }));
        }
        return await axiosPublic.get("/collection/volume", {params: {collection: collection, uri: volume_uri}}).then(response => {
            console.log('Server');
            store_response_data_in_local_storage(key, response)
            return response;
        })
    }
}

export default new CollectionAPI();