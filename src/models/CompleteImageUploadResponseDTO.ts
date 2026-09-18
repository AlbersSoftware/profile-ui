export interface CompleteImageUploadResponseDTO {
    mediaId: string;
    mediaType: string;
    mediaPurpose: string;
    status: string;
    originalFilename: string;
    displayName: string | null;
    fileFormat: string | null;
    mimeType: string;
    sizeBytes: number | null;
    width: number | null;
    height: number | null;
    uploadedAt: string | null;
    readyAt: string | null;
}
