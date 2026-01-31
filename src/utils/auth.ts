export const getRole = () => localStorage.getItem("role");
export const isLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";

export const setAuth = (role: string) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", role);
};

export const clearAuth = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
};
