import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import { useAuth } from "../auth/AuthProvider";
import { createProfile } from "../services/profileService";

export default function CreateProfilePage() {

    const navigate = useNavigate();

    const {
        appUser
    } = useAuth();

    const [loading, setLoading] = useState(false);

    const [profile, setProfile] = useState({
        displayName: "",
        phone: "",
        email: "",
        timezone: "",
        birthday: "",
        bio: ""
    });

    function updateField(name: string, value: string) {

        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function submit() {

        if (!appUser) {

            console.error("No authenticated user.");

            return;
        }

        try {

            setLoading(true);

            await createProfile({
                displayName: profile.displayName,
                phone: profile.phone,
                email: profile.email,
                timezone: profile.timezone,
                birthday: profile.birthday || null,
                bio: profile.bio
            });

            navigate("/profile");

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    }

    return (

        <Box sx={{ maxWidth: 700, mx: "auto", mt: 5 }}>

            <Paper sx={{ p: 4 }}>

                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Create Profile
                </Typography>

                <Stack spacing={2}>

                    <TextField
                        label="Display Name"
                        value={profile.displayName}
                        onChange={e => updateField("displayName", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Phone"
                        value={profile.phone}
                        onChange={e => updateField("phone", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Email"
                        value={profile.email}
                        onChange={e => updateField("email", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Timezone"
                        value={profile.timezone}
                        onChange={e => updateField("timezone", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Birthday"
                        type="date"
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                        value={profile.birthday}
                        onChange={e => updateField("birthday", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Bio"
                        multiline
                        rows={4}
                        value={profile.bio}
                        onChange={e => updateField("bio", e.target.value)}
                        fullWidth
                    />

                    <Button
                        variant="contained"
                        onClick={submit}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Profile"}
                    </Button>

                </Stack>

            </Paper>

        </Box>

    );
}
