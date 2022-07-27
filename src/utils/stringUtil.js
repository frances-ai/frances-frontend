export const findTopicModelID = (model_name) => {
    const index = model_name.indexOf('_');
    return model_name.substring(0, index);
}

export const findTermLinkFromUri = (uri) => {
    const index = uri.lastIndexOf('/');
    return uri.substring(index + 1);
}