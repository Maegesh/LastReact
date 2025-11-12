const KEY = "auth-token";
const ROLE = "auth-role"

export const tokenstore = {
    get(): string | null {
        return localStorage.getItem(KEY);
    },
    set(token: string) {
        localStorage.setItem(KEY, token)
    },
    getRole(): string | null {
        return localStorage.getItem(ROLE);
    },
    setRole(role: string | null) {
        if (role) localStorage.setItem(ROLE, role);
        else localStorage.removeItem(ROLE);
    },
    clear() {
        localStorage.removeItem(KEY)
        localStorage.removeItem(ROLE)
    }
}