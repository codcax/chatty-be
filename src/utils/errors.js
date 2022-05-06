//Node imports

module.exports.customGraphQLError = (gqlerror) => {
    if (!gqlerror.originalError) {
        return gqlerror;
    }
    const data = gqlerror.originalError.data;
    const message = gqlerror.message || 'An unexpected error occurred.';
    const code = gqlerror.originalError.code || 500;
    const path = gqlerror.path || null;
    return {message: message, status: code, data: data, path: path};
}

module.exports.customError = (message, data, code) => {
    const error = new Error(message);
    if (data) {
        error.data = data
    }
    error.status = code;
    throw error;
}