export const localStore = {
    set: (key: string, value?: any) => {
        return localStorage.setItem(key, value);
    },
    get: (key: string) => {
        return JSON.parse(localStorage.getItem(key));
    },
    remove: (key: string) => {
        return localStorage.removeItem(key);
    },
}
