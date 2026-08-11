import type { UUID } from "crypto";

export interface ProfileConnectionOutgoingDetailsResponseDTO {

    connectionId: string;

    recipientUserId: string;

    displayName: string;

    email: string;

    status: string;

    requestedAt: string;

}
