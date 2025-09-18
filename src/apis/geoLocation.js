import {openStreetMapAxios} from "./axios";

class GeoLocationAPI {
    searchLocation(params) {
        return openStreetMapAxios.get("/search", {params: params})
            .then(response => {
                return response;
            })
    }

    searchBoundingBoxByPlace(keyword) {

        return this.searchLocation({q: keyword, format: "json"}).then(response => {
            console.log(response.data);
            response.data = response.data.map((location) => (
                {
                    "name": location.display_name,
                    "bounding_box": location.boundingbox //see https://nominatim.org/release-docs/develop/api/Output/#boundingbox
                }
            ))
            console.log(response.data);
            return response;
        })
    }
}

export default new GeoLocationAPI()