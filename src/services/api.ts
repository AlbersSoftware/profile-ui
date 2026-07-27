import { getIdToken } from "./authService";

export const API_BASE = "http://localhost:8081/api";

export async function authHeaders() {

    const token =
        await getIdToken();

    return {
        "Content-Type": "application/json",

        ...(token && {
            Authorization: `Bearer ${token}`
        })
    };
}
