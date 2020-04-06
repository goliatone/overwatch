'use strict';

import { api } from '../services/api';
import { writable } from 'svelte/store';
const { subscribe, set, update } = writable([]);

export const error = writable('');
export const incidentItems = writable([]);

const incidents = _ => ({
    set,
    update,
    subscribe,
    items: incidentItems,
    async listItems(city, query = { page: 1, size: 100 }) {
        try {
            let response = await api.list(city, query);
            let data = response.data;
            let meta = response.meta;
            set(data);
            incidentItems.set(data);
            return data;
        } catch (e) {
            set([]);
            error.set(`
                <h2>Error accessing API</h2>
                <p>Details: ${e.message}</p>
            `);
            return e;
        }
    }
});

export default incidents();