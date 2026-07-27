export interface ProfileResponseDTO {

    userId: string;

    displayName: string;

    phone: string | null;

    email: string | null;

    avatarMediaId: string | null;

    timezone: string | null;

    birthday: string | null;

    bio: string | null;

    createdAt: string | null;

    updatedAt: string | null;
}
