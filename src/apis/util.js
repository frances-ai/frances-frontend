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
