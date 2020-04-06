import { writable, derived, get } from 'svelte/store';

/**
 * Items per page, default 10. 
 */
export const itemsPerPage = writable(10);
export const totalItems = writable(0);
export const currentItems = writable(0);
export const currentPage = writable(0);

export const totalPages = derived(
    [totalItems, itemsPerPage],
    ([$totalItems, $itemsPerPage]) => {
        if ($itemsPerPage === 0) return 0;
        return Math.round($totalItems / $itemsPerPage);
    });

const methods = {};

methods.first = function() {
    currentPage.update(_ => 1);
    currentItems.set(get(itemsPerPage));
};

methods.prev = function() {
    let page = get(currentPage) - 1;
    if (page > 0) {
        currentPage.set(page);
        currentItems.set(page * get(itemsPerPage));
    }
};

methods.prevItem = function() {
    let prev = get(currentItems) - 1;
    if (prev < 1) return;
    let prevPage = Math.ceil(prev / get(itemsPerPage));
    currentItems.set(prev);
    if (prevPage < get(currentPage) && prevPage > 0) {
        currentPage.set(prevPage);
    }
};

methods.goto = function(page) {
    if (page < 1 || page > get(totalPages)) return;
    if (page === get(currentPage)) return;
    currentPage.set(page);
    currentItems.set(page * get(itemsPerPage));
};

methods.next = function() {
    let page = get(currentPage) + 1;
    if (page <= get(totalPages)) {
        currentPage.set(page);
        currentItems.set(page * get(itemsPerPage));
    }
};

methods.nextItem = function() {
    let next = get(currentItems) + 1;
    if (next > get(totalItems)) return;
    currentItems.set(next);
    let nextPage = Math.ceil(next / get(itemsPerPage));
    if (nextPage <= get(totalPages)) {
        currentPage.set(nextPage);
    }
};

methods.last = function() {
    let page = Math.round(get(totalItems) / get(itemsPerPage));
    currentPage.set(page);
    let limit = page * get(itemsPerPage);
    let total = get(totalItems);
    if (limit > total) limit = total;
    currentItems.set(limit);
};

methods.update = function(meta) {
    if (meta.hasOwnProperty('total')) totalItems.set(meta.total);
    if (meta.hasOwnProperty('size')) itemsPerPage.set(meta.size);
    if (meta.hasOwnProperty('page')) methods.goto(meta.page);
    if (meta.hasOwnProperty('skip')) {
        let { limit, skip } = meta;
        currentPage.set(Math.round(skip / limit));
        currentItems.set(limit);
    }
};

methods.reset = function() {
    itemsPerPage.set(10);
    totalItems.set(0);
    currentPage.set(0);
    currentItems.set(0);
};

export default methods;