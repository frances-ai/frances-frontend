export const findTopicModelID = (model_name) => {
    const index = model_name.indexOf('_');
    return model_name.substring(0, index);
}


/**
 * This function convert hto uri to a path, if this is not a hto uri, then it will keep the original uri.
 * @param uri a uri string.
 * @return path if it is a hto uri, otherwise, the original uri.
 */
export const hto_uri_to_path = (uri) => {
    return uri.substring(uri.indexOf("/hto/"));
}

/**
 *  Check if a link to a resource is valid, this link can be a path in this frontend, or an uri to other web source.
 * @param link a string which can be a path in this frontend, or an uri to other web sources.
 * @return true when the link is valid, otherwise, false.
 */
export const is_valid_link = (link) => {
    if (link.includes('http')) {
        return true;
    }
    return is_active_path(link);
}

/**
 *  Check if a path in this frontend has been defined and implemented.
 *  It will only return false when the path is implemented in this frontend.
 * @param path a path string, such as "/hto/ArticleTermRecord/......"
 * @return true when the path is implemented in this frontend, otherwise, false.
 */
export const is_active_path = (path) => {
    const ACTIVE_PATHS = ["/login", "/register", "/", "/search", "/searchResult",
        "/collectionDetails", "/collectionDetails/detail", "/hto/ArticleTermRecord", "/hto/TopicTermRecord",
    "/hto/Page", "/defoeQuery", "/defoeQueryResult", "/defoeQueryTasks"];
    let possible_variations = [path]
    const slashed_path = "/" + path
    if ('/' !== path.charAt(0)) {
        possible_variations.push(slashed_path)
    }
    if (slashed_path.indexOf("/hto/") !== -1 && slashed_path.length > 5 && slashed_path.lastIndexOf('/') > 5) {
        // slashed_path is "/hto/..../..."
        possible_variations.push(slashed_path.substring(0, slashed_path.lastIndexOf('/')))
    }

    for (const v_index in possible_variations) {
        const variation = possible_variations[v_index]
        if (ACTIVE_PATHS.indexOf(variation) > -1) {
            return true;
        }
    }
    return false;
}

export const findTermLinkFromUri = (uri) => {
    const index = uri.lastIndexOf('/');
    return uri.substring(index + 1);
}

export const escapeUnicode = (str) => {
    return str.replace(/[\u00A0-\uffff]/gu, function (c) {
        return "\\u" + ("000" + c.charCodeAt().toString(16)).slice(-4)
    });
}

export function getLexiconFileOriginalName(lexiconFilename) {
    const spiltChar = '_';
    const startIndex = lexiconFilename.indexOf(spiltChar) + 1;
    return lexiconFilename.substring(startIndex);
}