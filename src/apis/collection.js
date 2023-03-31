import axios, {getBaseUrl} from "./axios";

class CollectionAPI{
    async get_collections() {
        return await axios.get("/collection/list");
    }

    get_image_url(image_name) {
        return getBaseUrl() + "/collection/image?name=" + image_name;
    }
}

export default new CollectionAPI();