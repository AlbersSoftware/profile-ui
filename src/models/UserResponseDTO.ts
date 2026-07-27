export interface UserResponseDTO {
    userId: string;
    cognitoSub: string;
    email: string;
    emailVerified: boolean;
    accountStatus: string;
    createdAt: string | null;
    updatedAt: string | null;
}
