import {preprocess, gazetteer} from "./queryMeta";

export function store_response_data_in_local_storage(key, response) {
    try {
        if (response.status === 200 && response.data !== undefined) {
            let data = response.data
            if (Array.isArray(data)) {
                // if data is an array
                if (data.length > 0) {
                    localStorage.setItem(key, JSON.stringify(response.data));
                }
            } else {
                // if data is dictionary object
                if (Object.keys(data).length > 0) {
                    localStorage.setItem(key, JSON.stringify(response.data));
                }
            }
        }
    } catch (e) {
        console.log(e);
        localStorage.clear();
    }
}

export function getDisplayNameForHitCount(hit_count) {
    return hit_count.charAt(0).toUpperCase() + hit_count.slice(1);
}

export function getDisplayNameForPreprocess(preprocess_name) {
    const matched_preprocess = preprocess.find(p => p[0] === preprocess_name);
    return matched_preprocess[1];
}

export function getDisplayNameForGazetteer(gazetteer_name) {
    const matched_gazetteer = gazetteer.find(g => g[0] === gazetteer_name);
    return matched_gazetteer[1];
}

