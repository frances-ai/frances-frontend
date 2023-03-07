export const findTopicModelID = (model_name) => {
    const index = model_name.indexOf('_');
    return model_name.substring(0, index);
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