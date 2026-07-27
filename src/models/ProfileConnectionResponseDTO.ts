export interface ProfileConnectionResponseDTO {

    connectionId: string;

    requesterUserId: string;

    recipientUserId: string;

    status: string;

    requestedAt: string | null;

    acceptedAt: string | null;

    updatedAt: string | null;

}
