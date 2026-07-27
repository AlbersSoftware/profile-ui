import {
    API_BASE,
    authHeaders
} from "./api";

export async function getProfileByUserId(
    userId: string
) {

    const response =
        await fetch(
            `${API_BASE}/profiles/${userId}`,
            {
                headers: await authHeaders()
            }
        );

    if (response.status === 404) {

        return null;
    }

    if (!response.ok) {

        throw new Error(
            "Failed to load profile."
        );
    }

    return response.json();
}

export async function createProfile(
    profile: unknown
) {

    const response =
        await fetch(
            `${API_BASE}/profiles`,
            {
                method: "POST",
                headers: await authHeaders(),
                body: JSON.stringify(profile)
            }
        );

    if (!response.ok) {

        throw new Error(
            "Failed to create profile."
        );
    }

    return response.json();
}

export async function updateProfile(
    userId: string,
    profile: unknown
) {

    const response =
        await fetch(
            `${API_BASE}/profiles/${userId}`,
            {
                method: "PUT",
                headers: await authHeaders(),
                body: JSON.stringify(profile)
            }
        );

    if (!response.ok) {

        throw new Error(
            "Failed to update profile."
        );
    }

    return response.json();
}
