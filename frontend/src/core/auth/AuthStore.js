export var ERole;
(function (ERole) {
    ERole["OPERADOR"] = "OPERADOR";
    ERole["ADMINISTRADOR"] = "ADMINISTRADOR";
})(ERole || (ERole = {}));
export default class AuthStore {
    constructor() {
        this.tokenKey = 'frontend.auth.token';
        this.userKey = 'frontend.auth.user';
    }
    static getInstance() {
        if (!AuthStore.instance) {
            AuthStore.instance = new AuthStore();
        }
        return AuthStore.instance;
    }
    setToken(token, user) {
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }
    getUser() {
        const raw = localStorage.getItem(this.userKey);
        if (!raw) {
            return null;
        }
        try {
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    }
    isAuthenticated() {
        return !!this.getToken();
    }
    isAdmin() {
        return this.getRole() === ERole.ADMINISTRADOR;
    }
    clear() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }
    getRole() {
        return this.getUser()?.role ?? null;
    }
}
