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

        let baseUrl = this.loadConfigItem('dataviz.api.url', config.url);
        this.baseUrl = this._clean(baseUrl);

        this.token = this.loadConfigItem('dataviz.api.token', config.token);
    }

    list(entity, query = false) {
        const token = this.token;

        let uri = new URL(`${this.baseUrl}/api/v1/crime/${entity}`);

        if (query) {
            Object.keys(query).map(key => {
                let value = JSON.stringify(query[key]);
                uri.searchParams.append(key, value);
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
    url: location.href,
    token: '0a6fd546-9699-4fc3-8ba6-f878b11f0396'
});