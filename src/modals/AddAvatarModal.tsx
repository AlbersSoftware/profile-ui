import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";

import UploadFileIcon
    from "@mui/icons-material/UploadFile";

import type {
    ProfileResponseDTO
} from "../models/ProfileResponseDTO";

import {
    getProfileAvatar,
    isImageFile,
    uploadProfileAvatar
} from "../services/mediaService";

import {
    updateProfile
} from "../services/profileService";

interface Props {
    open: boolean;
    profile: ProfileResponseDTO;
    onClose: () => void;
    onSaved: (profile: ProfileResponseDTO) => void;
}

export default function AddAvatarModal({
    open,
    profile,
    onClose,
    onSaved
}: Props) {

    const inputRef =
        useRef<HTMLInputElement | null>(null);

    const [selectedFile, setSelectedFile] =
        useState<File | null>(null);

    const [currentAvatarUrl, setCurrentAvatarUrl] =
        useState<string | null>(null);

    const [previewUrl, setPreviewUrl] =
        useState<string | null>(null);

    const [loadingAvatar, setLoadingAvatar] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);


    useEffect(() => {

        if (!open) {
            return;
        }

        loadCurrentAvatar();

    }, [
        open,
        profile.avatarMediaId
    ]);


    useEffect(() => {

        if (!selectedFile) {

            setPreviewUrl(null);

            return;
        }

        const url =
            URL.createObjectURL(
                selectedFile
            );

        setPreviewUrl(
            url
        );

        return () => {
            URL.revokeObjectURL(
                url
            );
        };

    }, [selectedFile]);


    async function loadCurrentAvatar() {

        if (!profile.avatarMediaId) {

            setCurrentAvatarUrl(null);

            return;
        }

        setLoadingAvatar(true);
        setError(null);

        try {

            const avatar =
                await getProfileAvatar(
                    profile.avatarMediaId
                );

            setCurrentAvatarUrl(
                avatar.imageUrl
            );

        } catch(error) {

            console.error(
                "Failed loading current avatar:",
                error
            );

            setCurrentAvatarUrl(null);

        } finally {

            setLoadingAvatar(false);
        }
    }


    function handleOpenFilePicker() {

        inputRef.current?.click();
    }


    function handleFileSelected(
        event: React.ChangeEvent<HTMLInputElement>
    ) {

        const file =
            event.target.files?.[0]
            ?? null;

        if (!file) {
            return;
        }

        if (!isImageFile(file)) {

            setError(
                "Selected avatar must be an image."
            );

            event.target.value = "";

            return;
        }

        setSelectedFile(
            file
        );

        setError(null);
    }


    function handleClose() {

        if (saving) {
            return;
        }

        setSelectedFile(null);
        setPreviewUrl(null);
        setError(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }

        onClose();
    }


    async function handleSave() {

        if (
            !selectedFile ||
            saving
        ) {
            return;
        }

        setSaving(true);
        setError(null);

        try {

            const uploadedAvatar =
                await uploadProfileAvatar(
                    profile.userId,
                    selectedFile
                );

            const updatedProfile =
                await updateProfile(
                    profile.userId,
                    {
                        displayName:
                            profile.displayName,

                        phone:
                            profile.phone,

                        email:
                            profile.email,

                        avatarMediaId:
                            uploadedAvatar.mediaId,

                        timezone:
                            profile.timezone,

                        bio:
                            profile.bio,

                        birthday:
                            profile.birthday
                    }
                );

            onSaved(
                updatedProfile
            );

            handleClose();

        } catch(error) {

            console.error(
                "Failed saving profile avatar:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to save profile avatar."
            );

        } finally {

            setSaving(false);
        }
    }


    const displayedAvatarUrl =
        previewUrl
        ?? currentAvatarUrl;


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Profile Avatar
            </DialogTitle>

            <DialogContent>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        pt: 2
                    }}
                >
                    {loadingAvatar ? (

                        <Box
                            sx={{
                                width: 160,
                                height: 160,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <CircularProgress />
                        </Box>

                    ) : (

                        <Avatar
                            src={
                                displayedAvatarUrl
                                    ?? undefined
                            }
                            alt={
                                profile.displayName
                            }
                            sx={{
                                width: 160,
                                height: 160,
                                mb: 3
                            }}
                        />

                    )}

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            textAlign: "center"
                        }}
                    >
                        {selectedFile
                            ? "Preview of your new profile avatar."
                            : profile.avatarMediaId
                                ? "Your current profile avatar."
                                : "You do not currently have a profile avatar."}
                    </Typography>

                    <input
                        ref={inputRef}
                        hidden
                        type="file"
                        accept="image/*"
                        disabled={saving}
                        onChange={
                            handleFileSelected
                        }
                    />

                    <Button
                        variant="outlined"
                        startIcon={
                            <UploadFileIcon />
                        }
                        disabled={saving}
                        onClick={
                            handleOpenFilePicker
                        }
                    >
                        {profile.avatarMediaId
                            ? "Choose New Avatar"
                            : "Upload Avatar"}
                    </Button>

                    {selectedFile && (

                        <Box
                            sx={{
                                mt: 2,
                                textAlign: "center"
                            }}
                        >
                            <Typography
                                variant="body2"
                                fontWeight={600}
                            >
                                {selectedFile.name}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {selectedFile.type}
                            </Typography>
                        </Box>

                    )}

                    {error && (

                        <Alert
                            severity="error"
                            sx={{
                                mt: 3,
                                width: "100%"
                            }}
                        >
                            {error}
                        </Alert>

                    )}
                </Box>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={
                        handleClose
                    }
                    disabled={
                        saving
                    }
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    disabled={
                        !selectedFile ||
                        saving
                    }
                    onClick={
                        handleSave
                    }
                    startIcon={
                        saving
                            ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            )
                            : undefined
                    }
                >
                    {saving
                        ? "Saving..."
                        : "Save"}
                </Button>

            </DialogActions>
        </Dialog>
    );
}
