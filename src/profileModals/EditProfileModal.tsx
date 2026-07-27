import {
    useState
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


    const [form, setForm] =
        useState<ProfileResponseDTO>(
            profile
        );


    function updateField(
        field: keyof ProfileResponseDTO,
        value: string
    ) {

        setForm(prev => ({
            ...prev,
            [field]: value
        }));

    }


    async function submit() {

        await onSave(form);

        onClose();

    }


    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                Edit Profile
            </DialogTitle>


            <DialogContent>

                <Stack
                    spacing={2}
                    mt={1}
                >

                    <TextField
                        label="Display Name"
                        value={form.displayName ?? ""}
                        onChange={
                            e =>
                                updateField(
                                    "displayName",
                                    e.target.value
                                )
                        }
                        fullWidth
                    />


                    <TextField
                        label="Phone"
                        value={form.phone ?? ""}
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
                        value={form.email ?? ""}
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
                        value={form.timezone ?? ""}
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
                                shrink: true
                            }
                        }}
                    />


                    <TextField
                        label="Bio"
                        multiline
                        rows={4}
                        value={form.bio ?? ""}
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
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    onClick={submit}
                >
                    Save
                </Button>

            </DialogActions>


        </Dialog>

    );
}
