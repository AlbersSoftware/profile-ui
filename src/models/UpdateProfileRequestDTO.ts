export interface UpdateProfileRequestDTO {
    displayName: string;
    phone: string | null;
    email: string;
    avatarMediaId: string | null;
    timezone: string | null;
    bio: string | null;
    birthday: string | null;
}
