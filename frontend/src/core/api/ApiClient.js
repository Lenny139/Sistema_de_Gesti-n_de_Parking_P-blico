import ApiEndpoints from './ApiEndpoints.js';
import AuthStore from '../auth/AuthStore.js';
export default class ApiClient {
    constructor() {
        this.authStore = AuthStore.getInstance();
    }
    async get(path) {
        return this.request('GET', path);
    }
    async post(path, body) {
        return this.request('POST', path, body);
    }
    async put(path, body) {
        return this.request('PUT', path, body);
    }
    async delete(path) {
        return this.request('DELETE', path);
    }
    async request(method, path, body) {
        const token = this.authStore.getToken();
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        const response = await fetch(`${ApiEndpoints.baseUrl}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
        if (response.status === 204) {
            return undefined;
        }
        const data = (await response.json().catch(() => null));
        if (response.status >= 400) {
            throw new Error(data?.message ?? `HTTP ${response.status}`);
        }
        return data;
    }
}
