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

module.exports.errorResponse = (ok, data, errors) => {
    return {
        ok: ok,
        data:data,
        errors:errors
    }
}

module.exports.successResponse = (ok, data, code, errors) => {
    return {
        ok: ok,
        data:data,
        code: code,
        errors:errors
    }
}