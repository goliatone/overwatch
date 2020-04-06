'use strict';

/**
 * @see https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
 */
export default function debounce(callback, wait = 500) {
    let timeout;
    return (...args) => {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(_ => callback.apply(context, args), wait);
    };
}