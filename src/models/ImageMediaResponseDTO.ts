export interface ImageMediaResponseDTO {
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
    imageUrl: string;
    imageUrlExpiresAt: string;
    createdAt: string;
    readyAt: string | null;
}
