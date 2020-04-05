'use strict';

/**
 * We use this method to extract our token
 * from the headers. 
 * Again, this is a naïve implementation but
 * otherwise the mechanics are very similar.
 * 
 * @param {Object} headers Req headers object
 */
function getTokenFromHeaders(headers = {}) {
    let authorization = headers.authorization;
    if (!authorization) return false;
    authorization = authorization.replace('Bearer ', '');
    return authorization;
}

/**
 * This is NOT INTENDED to be used 
 * other than this simple demo project.
 * 
 * @param {String} token JWT token
 */
function validateJWT(token = '') {
    if (!token) return false;
    return !!token;
}

/**
 * Simple authentication middleware function.
 * We use it to check for presence of auth tokens.
 * 
 * In real life we want something battle tested 
 * but for demo purposes this is quicker to get
 * up and running.
 * 
 * @param {Object} req http request object
 * @param {Object} res http respnose object
 * @param {Function} next If used as middleware use next
 */
function authenticate(req, res, next) {
    let token = getTokenFromHeaders(req.headers);
    if (!token) return send(res, 401, { success: false, code: 401, message: 'Authentication Required' });
    token = validateJWT(token);
    if (!token) return send(res, 401, { success: false, code: 401, message: 'Authentication Failed' });

    /**
     * We have the user information here
     */
    req.user = token.data;

    /**
     * If used as middleware, iterate
     * But if not in loop, return "success" boolean
     */
    return next ? next() : true;
}

module.exports = authenticate;
module.exports.validateJWT = validateJWT;
module.exports.getTokenFromHeaders = getTokenFromHeaders;