import {
    API_BASE,
    authHeaders
} from "./api";


import type { UserResponseDTO } from "../models/UserResponseDTO";


export async function createUser(): Promise<UserResponseDTO> {

    const response =
        await fetch(
            `${API_BASE}/users`,
            {
                method: "POST",
                headers: await authHeaders(),

                // Controller still accepts a DTO for now.
                // Once the DTO is removed this body disappears.
                body: JSON.stringify({})
            }
        );

    if (!response.ok) {

        throw new Error(
            "Failed to create user."
        );
    }

    return response.json();
}

export async function getUserById(
    userId: string
): Promise<UserResponseDTO | null> {

    const response =
        await fetch(
            `${API_BASE}/users/${userId}`,
            {
                headers: await authHeaders()
            }
        );

    if (response.status === 404) {

        return null;
    }

    if (!response.ok) {

        throw new Error(
            "Failed to load user."
        );
    }

    return response.json();
}

export async function getUserByCognitoSub(
    cognitoSub: string
): Promise<UserResponseDTO | null> {

    const response =
        await fetch(
            `${API_BASE}/users/cognito/${cognitoSub}`,
            {
                headers: await authHeaders()
            }
        );

    if (response.status === 404) {

        return null;
    }

    if (!response.ok) {

        throw new Error(
            "Failed to load user."
        );
    }

    return response.json();
}
