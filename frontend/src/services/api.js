'use strict';

const defaults = {
    loadConfigItem(path, def) {
        return localStorage.getItem(path) || def;
    }
};

/**
 * Simple HTTP API client
 */
class Api {
    constructor(config = {}) {
        config = Object.assign({}, defaults, config);
        this.init(config);
    }

    init(config = {}) {

        Object.assign(this, config);

        let baseUrl;

        baseUrl = this.loadConfigItem('dataviz.api.url', config.url);

        baseUrl = this._clean(baseUrl);

        if (!baseUrl) baseUrl = this._clean(location.href);

        this.baseUrl = baseUrl;

        this.token = this.loadConfigItem('dataviz.api.token', config.token);
    }

    list(entity, query = false) {
        const token = this.token;

        let uri = new URL(`${this.baseUrl}/api/v1/crime/${entity}`);

        if (query) {
            Object.keys(query).map(key => {
                uri.searchParams.append(key, query[key]);
            });
        }

        return fetch(uri.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json());
    }

    _clean(baseUrl = '') {
        if (baseUrl.charAt(baseUrl.length - 1) === '/') {
            baseUrl = baseUrl.slice(0, baseUrl.lastIndexOf('/'));
        }
        return baseUrl;
    }
}

export default Api;

export let api = new Api({
    url: 'http://localhost:1981',
    token: '0a6fd546-9699-4fc3-8ba6-f878b11f0396'
});