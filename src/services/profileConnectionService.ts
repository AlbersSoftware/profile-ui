import {
    API_BASE,
    authHeaders
} from "./api";


import type {
    ProfileConnectionResponseDTO
} from "../models/ProfileConnectionResponseDTO";



export async function requestConnection(
    recipientUserId: string
): Promise<ProfileConnectionResponseDTO> {


    const response =
        await fetch(
            `${API_BASE}/profile-connections`,
            {
                method: "POST",

                headers: await authHeaders(),

                body: JSON.stringify({

                    recipientUserId

                })
            }
        );


    if (!response.ok) {

        throw new Error(
            "Failed to request connection."
        );

    }


    return response.json();

}





export async function acceptConnection(
    connectionId: string
): Promise<ProfileConnectionResponseDTO> {


    const response =
        await fetch(
            `${API_BASE}/profile-connections/${connectionId}/accept`,
            {
                method: "PUT",

                headers: await authHeaders()
            }
        );


    if (!response.ok) {

        throw new Error(
            "Failed to accept connection."
        );

    }


    return response.json();

}





export async function declineConnection(
    connectionId: string
): Promise<ProfileConnectionResponseDTO> {


    const response =
        await fetch(
            `${API_BASE}/profile-connections/${connectionId}/decline`,
            {
                method: "PUT",

                headers: await authHeaders()
            }
        );


    if (!response.ok) {

        throw new Error(
            "Failed to decline connection."
        );

    }


    return response.json();

}





export async function removeConnection(
    connectionId: string
): Promise<ProfileConnectionResponseDTO> {


    const response =
        await fetch(
            `${API_BASE}/profile-connections/${connectionId}/remove`,
            {
                method: "PUT",

                headers: await authHeaders()
            }
        );


    if (!response.ok) {

        throw new Error(
            "Failed to remove connection."
        );

    }


    return response.json();

}





export async function getConnectionById(
    connectionId: string
): Promise<ProfileConnectionResponseDTO | null> {


    const response =
        await fetch(
            `${API_BASE}/profile-connections/${connectionId}`,
            {
                headers: await authHeaders()
            }
        );


    if (response.status === 404) {

        return null;

    }


    if (!response.ok) {

        throw new Error(
            "Failed to load connection."
        );

    }


    return response.json();

}





export async function getConnectionByUsers(
    requesterUserId: string,
    recipientUserId: string
): Promise<ProfileConnectionResponseDTO | null> {


    const response =
        await fetch(
            `${API_BASE}/profile-connections/users?requesterUserId=${requesterUserId}&recipientUserId=${recipientUserId}`,
            {
                headers: await authHeaders()
            }
        );


    if (response.status === 404) {

        return null;

    }


    if (!response.ok) {

        throw new Error(
            "Failed to load connection."
        );

    }


    return response.json();

}





export async function getConnectionsByUserId(
    userId: string
): Promise<ProfileConnectionResponseDTO[]> {


    const response =
        await fetch(
            `${API_BASE}/profile-connections/user/${userId}`,
            {
                headers: await authHeaders()
            }
        );


    if (!response.ok) {

        throw new Error(
            "Failed to load user connections."
        );

    }


    return response.json();

}


export async function getIncomingRequestsByUserId(
    userId: string
): Promise<ProfileConnectionResponseDTO[]> {


    const response =
        await fetch(
            `${API_BASE}/profile-connections/user/${userId}/incoming`,
            {
                headers: await authHeaders()
            }
        );


    if (!response.ok) {

        throw new Error(
            "Failed to load incoming connection requests."
        );

    }


    return response.json();

}


export async function getAcceptedConnectionsByUserId(
    userId: string
): Promise<ProfileConnectionResponseDTO[]> {


    const response =
        await fetch(
            `${API_BASE}/profile-connections/user/${userId}/accepted`,
            {
                headers: await authHeaders()
            }
        );


    if (!response.ok) {

        throw new Error(
            "Failed to load accepted connections."
        );

    }


    return response.json();

}





export async function getDeclinedConnectionsByUserId(
    userId: string
): Promise<ProfileConnectionResponseDTO[]> {


    const response =
        await fetch(
            `${API_BASE}/profile-connections/user/${userId}/declined`,
            {
                headers: await authHeaders()
            }
        );


    if (!response.ok) {

        throw new Error(
            "Failed to load declined connections."
        );

    }


    return response.json();

}
