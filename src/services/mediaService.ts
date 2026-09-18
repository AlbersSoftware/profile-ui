import {
    fetchAuthSession
} from "aws-amplify/auth";

import type {
    CompleteImageUploadResponseDTO
} from "../models/CompleteImageUploadResponseDTO";

import type {
    CreateImageUploadResponseDTO
} from "../models/CreateImageUploadResponseDTO";

import type {
    ImageMediaResponseDTO
} from "../models/ImageMediaResponseDTO";

const MEDIA_API_URL =
    import.meta.env.VITE_MEDIA_API_URL;

async function getAccessToken(): Promise<string> {

    const session =
        await fetchAuthSession();

    const token =
        session.tokens?.accessToken?.toString();

    if (!token) {
        throw new Error(
            "No authenticated Cognito session found."
        );
    }

    return token;
}

export function isImageFile(
    file: File
): boolean {

    return file.type.startsWith(
        "image/"
    );
}

async function uploadFileToS3(
    uploadUrl: string,
    file: File,
    contentType: string
): Promise<void> {

    const response =
        await fetch(
            uploadUrl,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        contentType
                },
                body: file
            }
        );

    if (!response.ok) {
        throw new Error(
            `Failed to upload file to S3: ${response.status}`
        );
    }
}


// Profile Avatars

export async function createProfileAvatarUpload(
    profileId: string,
    file: File
): Promise<CreateImageUploadResponseDTO> {

    if (!isImageFile(file)) {
        throw new Error(
            "Selected avatar must be an image."
        );
    }

    const accessToken =
        await getAccessToken();

    const response =
        await fetch(
            `${MEDIA_API_URL}/api/media/profile-avatars/uploads?profileId=${encodeURIComponent(profileId)}`,
            {
                method: "POST",
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    originalFilename:
                        file.name,
                    mimeType:
                        file.type,
                    sizeBytes:
                        file.size
                })
            }
        );

    if (!response.ok) {
        throw new Error(
            `Failed to create profile avatar upload: ${response.status}`
        );
    }

    return response.json();
}

export async function completeProfileAvatarUpload(
    mediaId: string,
    uploadSessionId: string
): Promise<CompleteImageUploadResponseDTO> {

    const accessToken =
        await getAccessToken();

    const response =
        await fetch(
            `${MEDIA_API_URL}/api/media/profile-avatars/${mediaId}/uploads/${uploadSessionId}/complete`,
            {
                method: "POST",
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`
                }
            }
        );

    if (!response.ok) {
        throw new Error(
            `Failed to complete profile avatar upload: ${response.status}`
        );
    }

    return response.json();
}

export async function uploadProfileAvatar(
    profileId: string,
    file: File
): Promise<CompleteImageUploadResponseDTO> {

    if (!isImageFile(file)) {
        throw new Error(
            "Selected avatar must be an image."
        );
    }

    const upload =
        await createProfileAvatarUpload(
            profileId,
            file
        );

    await uploadFileToS3(
        upload.uploadUrl,
        file,
        upload.contentType
    );

    return completeProfileAvatarUpload(
        upload.mediaId,
        upload.uploadSessionId
    );
}

export async function getProfileAvatar(
    mediaId: string
): Promise<ImageMediaResponseDTO> {

    const accessToken =
        await getAccessToken();

    const response =
        await fetch(
            `${MEDIA_API_URL}/api/media/profile-avatars/${mediaId}`,
            {
                method: "GET",
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`
                }
            }
        );

    if (!response.ok) {
        throw new Error(
            `Failed to retrieve profile avatar: ${response.status}`
        );
    }

    return response.json();
}
