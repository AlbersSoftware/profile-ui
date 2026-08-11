import {
    useState,
    useEffect
} from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField
} from "@mui/material";

import type {
    ProfileResponseDTO
} from "../models/ProfileResponseDTO";


interface Props {

    open: boolean;

    profile: ProfileResponseDTO;

    onClose: () => void;

    onSave: (
        profile: ProfileResponseDTO
    ) => Promise<void>;

}


export default function EditProfileModal({
    open,
    profile,
    onClose,
    onSave
}: Props) {


    const [form,setForm] =
        useState<ProfileResponseDTO>(
            profile
        );


    const [usernameError,setUsernameError] =
        useState("");


    const [loading,setLoading] =
        useState(false);


    useEffect(() => {

        if (open) {

            setForm(profile);

            setUsernameError("");

        }

    }, [profile,open]);


    function updateField(
        field: keyof ProfileResponseDTO,
        value: string
    ) {

        setForm(prev => ({
            ...prev,
            [field]: value
        }));


        if (field === "displayName") {

            setUsernameError("");

        }

    }


    async function submit() {


        try {

            setLoading(true);

            setUsernameError("");


            await onSave(form);


            onClose();


        } catch(error) {


            console.error(error);


            if (
                error instanceof Error &&
                error.message ===
                    "username is already taken"
            ) {

                setUsernameError(
                    "username is already taken"
                );

            } else {

                console.error(
                    "Failed updating profile:",
                    error
                );

            }


        } finally {

            setLoading(false);

        }

    }


    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >


            <DialogTitle
                sx={{
                    fontSize:"1.1rem",
                    fontWeight:500,
                    pb:1
                }}
            >
                Edit Profile
            </DialogTitle>


            <DialogContent>

                <Stack
                    spacing={4}
                    sx={{pt:2}}
                >


                    <TextField
                        label="Display Name"
                        value={
                            form.displayName ?? ""
                        }
                        onChange={
                            e =>
                                updateField(
                                    "displayName",
                                    e.target.value
                                )
                        }
                        error={
                            Boolean(
                                usernameError
                            )
                        }
                        helperText={
                            usernameError
                        }
                        fullWidth
                    />


                    <TextField
                        label="Phone"
                        value={
                            form.phone ?? ""
                        }
                        onChange={
                            e =>
                                updateField(
                                    "phone",
                                    e.target.value
                                )
                        }
                        fullWidth
                    />


                    <TextField
                        label="Email"
                        value={
                            form.email ?? ""
                        }
                        onChange={
                            e =>
                                updateField(
                                    "email",
                                    e.target.value
                                )
                        }
                        fullWidth
                    />


                    <TextField
                        label="Timezone"
                        value={
                            form.timezone ?? ""
                        }
                        onChange={
                            e =>
                                updateField(
                                    "timezone",
                                    e.target.value
                                )
                        }
                        fullWidth
                    />


                    <TextField
                        label="Birthday"
                        type="date"
                        value={
                            form.birthday ?? ""
                        }
                        onChange={
                            e =>
                                updateField(
                                    "birthday",
                                    e.target.value
                                )
                        }
                        fullWidth
                        slotProps={{
                            inputLabel: {
                                shrink:true
                            }
                        }}
                    />


                    <TextField
                        label="Bio"
                        multiline
                        rows={4}
                        value={
                            form.bio ?? ""
                        }
                        onChange={
                            e =>
                                updateField(
                                    "bio",
                                    e.target.value
                                )
                        }
                        fullWidth
                    />


                </Stack>

            </DialogContent>


            <DialogActions>


                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    onClick={submit}
                    disabled={loading}
                >

                    {
                        loading
                            ? "Saving..."
                            : "Save"
                    }

                </Button>


            </DialogActions>


        </Dialog>

    );

}


