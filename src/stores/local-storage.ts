export const localStore = {
    set: (key: string, value?: any) => {
        return localStorage.setItem(key, value);
    },
    get: (key: string, defaultShizzle: any) => {
        const lsShizzle = localStorage.getItem(key);
        console.log({lsShizzle})
        return JSON.parse(lsShizzle);
    },
    remove: (key: string) => {
        return localStorage.removeItem(key);
    },
}
