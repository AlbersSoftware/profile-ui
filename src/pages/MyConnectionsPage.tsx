import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";

import {
    Box,
    Button,
    CircularProgress,
    Divider,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography
} from "@mui/material";

import {useAuth} from "../auth/AuthProvider";

import {
    getAcceptedConnectionsByUserId,
    getIncomingRequestsByUserId,
    acceptConnection,
    declineConnection,
    removeConnection
} from "../services/profileConnectionService";

import {getProfileByUserId} from "../services/profileService";

import type {ProfileConnectionResponseDTO} from "../models/ProfileConnectionResponseDTO";
import type {ProfileResponseDTO} from "../models/ProfileResponseDTO";

export default function MyConnectionsPage() {

    const navigate = useNavigate();

    const {appUser} = useAuth();

    const [connections, setConnections] =
        useState<ProfileConnectionResponseDTO[]>([]);

    const [incomingConnections, setIncomingConnections] =
        useState<ProfileConnectionResponseDTO[]>([]);

    const [profiles, setProfiles] =
        useState<Record<string, ProfileResponseDTO>>({});

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        async function loadConnections() {

            if (!appUser) {
                setLoading(false);
                return;
            }

            try {

                const accepted = await getAcceptedConnectionsByUserId(appUser.userId);
                const incoming = await getIncomingRequestsByUserId(appUser.userId);

                setConnections(accepted);
                setIncomingConnections(incoming);

                const userIds = [
                    ...accepted.map(connection =>
                        connection.requesterUserId === appUser.userId
                            ? connection.recipientUserId
                            : connection.requesterUserId
                    ),
                    ...incoming.map(connection => connection.requesterUserId)
                ];

                const uniqueUserIds = [...new Set(userIds)];

                const profileResults = await Promise.all(
                    uniqueUserIds.map(async userId => {
                        const profile = await getProfileByUserId(userId);
                        return {userId, profile};
                    })
                );

                const profileMap = Object.fromEntries(
                    profileResults.map(result => [result.userId, result.profile])
                );

                setProfiles(profileMap);

            } catch(error) {

                console.error("Failed loading connections:", error);

            } finally {

                setLoading(false);

            }
        }

        loadConnections();

    }, [appUser]);

    function getOtherUserId(connection: ProfileConnectionResponseDTO) {

        return connection.requesterUserId === appUser?.userId
            ? connection.recipientUserId
            : connection.requesterUserId;

    }

    async function handleRemoveConnection(connectionId: string) {

        try {

            await removeConnection(connectionId);

            setConnections(previous =>
                previous.filter(connection => connection.connectionId !== connectionId)
            );

        } catch(error) {

            console.error("Failed removing connection:", error);

        }
    }

    async function handleAcceptConnection(connectionId: string) {

        try {

            await acceptConnection(connectionId);

            setIncomingConnections(previous =>
                previous.filter(connection => connection.connectionId !== connectionId)
            );

        } catch(error) {

            console.error("Failed accepting connection:", error);

        }
    }

    async function handleDeclineConnection(connectionId: string) {

        try {

            await declineConnection(connectionId);

            setIncomingConnections(previous =>
                previous.filter(connection => connection.connectionId !== connectionId)
            );

        } catch(error) {

            console.error("Failed declining connection:", error);

        }
    }

    if (loading) {
        return (
            <Stack display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress/>
            </Stack>
        );
    }

    return (

        <Box sx={{maxWidth:1200,mx:"auto",mt:5}}>

            <Paper sx={{p:4}}>

                <Stack direction="row" alignItems="center" sx={{ mb: 6 }}>
                <Typography variant="h4">
                  My Connections
                </Typography>

                  <Button
                  sx={{ ml: 12 }}
                  variant="outlined"
                  onClick={() => navigate(`/profile/${appUser?.userId}`)}
                  >
                  Back to My Profile
                  </Button>
                  </Stack>

                <Divider sx={{mb:3}}/>

                {connections.length === 0 &&
                    <Typography color="text.secondary">
                        You do not have any connections yet.
                    </Typography>
                }

                <Stack spacing={2}>

                    {connections.map(connection => {

                        const userId = getOtherUserId(connection);

                        return (

                            <Paper
                                key={connection.connectionId}
                                variant="outlined"
                                sx={{p:2}}
                            >

                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={2}
                                >

                                    <Typography sx={{ flexGrow: 1, mr: 4 }}>
                                {profiles[userId]?.displayName ?? "Loading..."}
                                  </Typography>

                                    <Select
                                        sx={{ minWidth: 170 }}
                                        defaultValue=""
                                        displayEmpty
                                        size="small"
                                        onChange={event => {

                                            if (event.target.value === "remove") {
                                                handleRemoveConnection(connection.connectionId);
                                            }

                                        }}
                                    >
                                        <MenuItem value="">Actions</MenuItem>
                                        <MenuItem value="remove">Remove Connection</MenuItem>
                                    </Select>

                                </Stack>

                            </Paper>

                        );

                    })}

                </Stack>

                <Divider sx={{my:4}}/>

                <Typography variant="h4" gutterBottom>
                    Incoming Connections
                </Typography>

                {incomingConnections.length === 0 &&
                    <Typography color="text.secondary">
                        No incoming connection requests.
                    </Typography>
                }

                <Stack spacing={2}>

                    {incomingConnections.map(connection => {

                        const userId = connection.requesterUserId;

                        return (

                            <Paper
                                key={connection.connectionId}
                                variant="outlined"
                                sx={{p:2}}
                            >

                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={2}
                                >

                                    <Typography>
                                        {profiles[userId]?.displayName ?? "Loading..."}
                                    </Typography>

                                    <Select
                                        defaultValue=""
                                        displayEmpty
                                        size="small"
                                        onChange={event => {

                                            if (event.target.value === "accept") {
                                                handleAcceptConnection(connection.connectionId);
                                            }

                                            if (event.target.value === "decline") {
                                                handleDeclineConnection(connection.connectionId);
                                            }

                                        }}
                                    >
                                        <MenuItem value="">Actions</MenuItem>
                                        <MenuItem value="accept">Accept</MenuItem>
                                        <MenuItem value="decline">Decline</MenuItem>
                                    </Select>

                                </Stack>

                            </Paper>

                        );

                    })}

                </Stack>

            </Paper>

        </Box>

    );

}
