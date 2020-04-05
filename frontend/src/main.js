import App from './App.svelte';
import { api } from './services/api';
window.api = api;

const app = new App({
    target: document.body
});

export default app;