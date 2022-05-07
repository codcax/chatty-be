//Node imports

module.exports.graphQLError = (error) => {
    if (!error.originalError) {
        return error;
    }
    const errors = error.originalError.data;
    const message = error.message || 'An unexpected error occurred.';
    const code = error.originalError.code || 500;
    const path = error.path || null;
    return {message: message, status: code, errors: errors, path: path};
}

module.exports.errorResponse = (message, errors, code) => {
    const error = new Error(message);
    error.data = errors;
    error.status = code;
    throw error;
}

module.exports.successResponse = (message, data, code) => {
    return {
        message: message,
        status: code,
        ...data
    }
}