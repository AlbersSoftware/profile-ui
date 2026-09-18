export interface CreateImageUploadResponseDTO {
    mediaId: string;
    uploadSessionId: string;
    uploadUrl: string;
    contentType: string;
    mediaStatus: string;
    uploadStatus: string;
    expiresAt: string;
}
