export default class BaseModel {
    constructor() {
        this.listeners = new Map();
    }
    on(event, callback) {
        const current = this.listeners.get(event) ?? [];
        current.push(callback);
        this.listeners.set(event, current);
    }
    emit(event, data) {
        const current = this.listeners.get(event) ?? [];
        current.forEach((callback) => {
            ;
            callback(data);
        });
    }
    off(event, callback) {
        const current = this.listeners.get(event) ?? [];
        this.listeners.set(event, current.filter((listener) => listener !== callback));
    }
}
