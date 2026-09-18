import {
    API_BASE,
    authHeaders
} from "./api";

import type {
    ProfileResponseDTO
} from "../models/ProfileResponseDTO";

import type {
    UpdateProfileRequestDTO
} from "../models/UpdateProfileRequestDTO";

import type {
    ProfileSearchResponseDTO
} from "../models/ProfileSearchResponseDTO";


export async function getProfileByUserId(
    userId: string
): Promise<ProfileResponseDTO | null> {

    const response =
        await fetch(
            `${API_BASE}/profiles/${userId}`,
            {
                headers:
                    await authHeaders()
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
): Promise<ProfileResponseDTO> {

    const response =
        await fetch(
            `${API_BASE}/profiles`,
            {
                method: "POST",

                headers:
                    await authHeaders(),

                body:
                    JSON.stringify(
                        profile
                    )
            }
        );

    if (!response.ok) {

        let message =
            "Failed to create profile.";

        try {

            const error =
                await response.json();

            if (error.message) {
                message =
                    error.message;
            }

        } catch {

            // Response was not JSON.
        }

        throw new Error(
            message
        );
    }

    return response.json();
}


export async function updateProfile(
    userId: string,
    profile: UpdateProfileRequestDTO
): Promise<ProfileResponseDTO> {

    const response =
        await fetch(
            `${API_BASE}/profiles/${userId}`,
            {
                method: "PUT",

                headers:
                    await authHeaders(),

                body:
                    JSON.stringify(
                        profile
                    )
            }
        );

    if (!response.ok) {

        let message =
            "Failed to update profile.";

        try {

            const error =
                await response.json();

            if (error.message) {
                message =
                    error.message;
            }

        } catch {

            // Response was not JSON.
        }

        throw new Error(
            message
        );
    }

    return response.json();
}






export async function searchProfiles(
    query: string,
    page: number = 0,
    size: number = 20
): Promise<ProfileSearchResponseDTO[]> {

    const response =
        await fetch(
            `http://localhost:8081/graphql`,
            {
                method: "POST",

                headers: {
                    ...(await authHeaders()),
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    query: `
                        query SearchProfiles(
                            $query: String!,
                            $page: Int!,
                            $size: Int!
                        ) {
                            searchProfiles(
                                query: $query,
                                page: $page,
                                size: $size
                            ) {
                                userId
                                displayName
                                avatarMediaId
                            }
                        }
                    `,

                    variables: {
                        query,
                        page,
                        size
                    }

                })
            }
        );

    if (!response.ok) {

        throw new Error(
            "Failed to search profiles."
        );
    }

    const result =
        await response.json();

    if (result.errors) {

        throw new Error(
            result.errors[0]?.message
                ?? "Failed to search profiles."
        );
    }

    return result.data.searchProfiles;
}


