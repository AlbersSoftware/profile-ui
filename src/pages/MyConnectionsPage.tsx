import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    Avatar,
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

import {
    useAuth
} from "../auth/AuthProvider";

import {
    getAcceptedConnectionDetailsByUserId,
    getIncomingRequestsByUserId,
    getOutgoingConnectionDetailsByUserId,
    acceptConnection,
    declineConnection,
    removeConnection
} from "../services/profileConnectionService";

import {
    getProfileByUserId
} from "../services/profileService";

import {
    getProfileAvatar
} from "../services/mediaService";

import type {
    ProfileConnectionResponseDTO
} from "../models/ProfileConnectionResponseDTO";

import type {
    ProfileConnectionDetailsResponseDTO
} from "../models/ProfileConnectionDetailsResponseDTO";

import type {
    ProfileResponseDTO
} from "../models/ProfileResponseDTO";

import type {
    ProfileConnectionOutgoingDetailsResponseDTO
} from "../models/ProfileConnectionOutgoingDetailsResponseDTO";


export default function MyConnectionsPage() {

    const navigate =
        useNavigate();

    const {
        appUser
    } = useAuth();

    const [connections, setConnections] =
        useState<ProfileConnectionDetailsResponseDTO[]>(
            []
        );

    const [incomingConnections, setIncomingConnections] =
        useState<ProfileConnectionResponseDTO[]>(
            []
        );

    const [outgoingConnections, setOutgoingConnections] =
        useState<ProfileConnectionOutgoingDetailsResponseDTO[]>(
            []
        );

    const [profiles, setProfiles] =
        useState<Record<string, ProfileResponseDTO>>(
            {}
        );

    const [connectionAvatarUrls, setConnectionAvatarUrls] =
        useState<Map<string, string>>(
            new Map()
        );

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        async function loadConnections() {

            if (!appUser) {

                setLoading(false);

                return;
            }

            try {

                const accepted =
                    await getAcceptedConnectionDetailsByUserId(
                        appUser.userId
                    );

                const incoming =
                    await getIncomingRequestsByUserId(
                        appUser.userId
                    );

                const outgoing =
                    await getOutgoingConnectionDetailsByUserId(
                        appUser.userId
                    );


                setConnections(
                    accepted
                );

                setIncomingConnections(
                    incoming
                );

                setOutgoingConnections(
                    outgoing
                );


                await resolveConnectionAvatars(
                    accepted
                );


                const incomingUserIds =
                    incoming.map(
                        connection =>
                            connection.requesterUserId
                    );

                const uniqueIncomingUserIds =
                    [
                        ...new Set(
                            incomingUserIds
                        )
                    ];


                const profileResults =
                    await Promise.all(
                        uniqueIncomingUserIds.map(
                            async userId => {

                                const profile =
                                    await getProfileByUserId(
                                        userId
                                    );

                                return {
                                    userId,
                                    profile
                                };
                            }
                        )
                    );


                const profileMap =
                    Object.fromEntries(
                        profileResults.map(
                            result => [
                                result.userId,
                                result.profile
                            ]
                        )
                    );


                setProfiles(
                    profileMap
                );

            } catch(error) {

                console.error(
                    "Failed loading connections:",
                    error
                );

            } finally {

                setLoading(false);

            }
        }

        loadConnections();

    }, [
        appUser
    ]);


    async function resolveConnectionAvatars(
        connections: ProfileConnectionDetailsResponseDTO[]
    ) {

        const profileResults =
            await Promise.all(
                connections.map(
                    async connection => {

                        try {

                            const profile =
                                await getProfileByUserId(
                                    connection.userId
                                );

                            return {
                                userId:
                                    connection.userId,

                                avatarMediaId:
                                    profile?.avatarMediaId
                                    ?? null
                            };

                        } catch(error) {

                            console.error(
                                `Failed loading profile ${connection.userId}:`,
                                error
                            );

                            return {
                                userId:
                                    connection.userId,

                                avatarMediaId:
                                    null
                            };
                        }
                    }
                )
            );


        const profilesWithAvatars =
            profileResults.filter(
                profile =>
                    profile.avatarMediaId
            );


        const avatarResults =
            await Promise.all(
                profilesWithAvatars.map(
                    async profile => {

                        try {

                            const avatar =
                                await getProfileAvatar(
                                    profile.avatarMediaId!
                                );

                            return [
                                profile.userId,
                                avatar.imageUrl
                            ] as const;

                        } catch(error) {

                            console.error(
                                `Failed loading avatar for ${profile.userId}:`,
                                error
                            );

                            return null;
                        }
                    }
                )
            );


        const validEntries =
            avatarResults.filter(
                (
                    entry
                ): entry is readonly [
                    string,
                    string
                ] =>
                    entry !== null
            );


        setConnectionAvatarUrls(
            new Map(
                validEntries
            )
        );
    }


    async function handleRemoveConnection(
        connectionId: string
    ) {

        try {

            await removeConnection(
                connectionId
            );

            setConnections(
                previous =>
                    previous.filter(
                        connection =>
                            connection.connectionId !==
                            connectionId
                    )
            );

        } catch(error) {

            console.error(
                "Failed removing connection:",
                error
            );

        }
    }


    async function handleAcceptConnection(
        connectionId: string
    ) {

        try {

            await acceptConnection(
                connectionId
            );

            setIncomingConnections(
                previous =>
                    previous.filter(
                        connection =>
                            connection.connectionId !==
                            connectionId
                    )
            );

        } catch(error) {

            console.error(
                "Failed accepting connection:",
                error
            );

        }
    }


    async function handleDeclineConnection(
        connectionId: string
    ) {

        try {

            await declineConnection(
                connectionId
            );

            setIncomingConnections(
                previous =>
                    previous.filter(
                        connection =>
                            connection.connectionId !==
                            connectionId
                    )
            );

        } catch(error) {

            console.error(
                "Failed declining connection:",
                error
            );

        }
    }


    if (loading) {

        return (
            <Stack
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress />
            </Stack>
        );

    }


    return (

        <Box
            sx={{
                maxWidth: 1200,
                mx: "auto",
                mt: 5
            }}
        >

            <Paper
                sx={{
                    p: 4
                }}
            >

                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                        mb: 6
                    }}
                >

                    <Typography
                        variant="h4"
                    >
                        My Connections
                    </Typography>

                    <Button
                        sx={{
                            ml: 12
                        }}
                        variant="outlined"
                        onClick={() =>
                            navigate(
                                `/profile/${appUser?.userId}`
                            )
                        }
                    >
                        Back to My Profile
                    </Button>

                </Stack>


                <Divider
                    sx={{
                        mb: 3
                    }}
                />


                {
                    connections.length === 0 &&

                    <Typography
                        color="text.secondary"
                    >
                        You do not have any
                        connections yet.
                    </Typography>
                }


                <Stack
                    spacing={2}
                >

                    {
                        connections.map(
                            connection => (

                                <Paper
                                    key={
                                        connection.connectionId
                                    }
                                    variant="outlined"
                                    sx={{
                                        p: 2
                                    }}
                                >

                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        gap={2}
                                    >

                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={2}
                                            sx={{
                                                flexGrow: 1,
                                                minWidth: 0
                                            }}
                                        >

                                            <Avatar
                                                src={
                                                    connectionAvatarUrls.get(
                                                        connection.userId
                                                    )
                                                }
                                                alt={
                                                    connection.displayName
                                                }
                                                sx={{
                                                    width: 44,
                                                    height: 44
                                                }}
                                            />

                                            <Typography
                                                component={
                                                    Link
                                                }
                                                to={
                                                    `/profile/${connection.userId}`
                                                }
                                                sx={{
                                                    color:
                                                        "primary.main",

                                                    textDecoration:
                                                        "none",

                                                    fontWeight:
                                                        500,

                                                    "&:hover": {
                                                        textDecoration:
                                                            "underline"
                                                    }
                                                }}
                                            >
                                                {
                                                    connection.displayName
                                                }
                                            </Typography>

                                        </Stack>


                                        <Select
                                            sx={{
                                                minWidth: 170,
                                                ml: 4
                                            }}
                                            defaultValue=""
                                            displayEmpty
                                            size="small"
                                            onChange={event => {

                                                if (
                                                    event.target.value ===
                                                    "remove"
                                                ) {

                                                    handleRemoveConnection(
                                                        connection.connectionId
                                                    );

                                                }

                                            }}
                                        >

                                            <MenuItem
                                                value=""
                                            >
                                                Actions
                                            </MenuItem>

                                            <MenuItem
                                                value="remove"
                                            >
                                                Remove Connection
                                            </MenuItem>

                                        </Select>

                                    </Stack>

                                </Paper>

                            )
                        )
                    }

                </Stack>


                <Divider
                    sx={{
                        my: 4
                    }}
                />


                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Outgoing Requests
                </Typography>


                {
                    outgoingConnections.length === 0 &&

                    <Typography
                        color="text.secondary"
                    >
                        No outgoing connection
                        requests.
                    </Typography>
                }


                <Stack
                    spacing={2}
                >

                    {
                        outgoingConnections.map(
                            connection => (

                                <Paper
                                    key={
                                        connection.connectionId
                                    }
                                    variant="outlined"
                                    sx={{
                                        p: 2
                                    }}
                                >

                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        gap={2}
                                    >

                                        <Typography
                                            sx={{
                                                flexGrow: 1
                                            }}
                                            component={
                                                Link
                                            }
                                            to={
                                                `/profile/${connection.recipientUserId}`
                                            }
                                        >
                                            {
                                                connection.displayName
                                            }
                                        </Typography>


                                        <Typography
                                            color="text.secondary"
                                        >
                                            Pending
                                        </Typography>

                                    </Stack>

                                </Paper>

                            )
                        )
                    }

                </Stack>


                <Divider
                    sx={{
                        my: 4
                    }}
                />


                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Incoming Connections
                </Typography>


                {
                    incomingConnections.length === 0 &&

                    <Typography
                        color="text.secondary"
                    >
                        No incoming connection
                        requests.
                    </Typography>
                }


                <Stack
                    spacing={2}
                >

                    {
                        incomingConnections.map(
                            connection => {

                                const userId =
                                    connection.requesterUserId;

                                return (

                                    <Paper
                                        key={
                                            connection.connectionId
                                        }
                                        variant="outlined"
                                        sx={{
                                            p: 2
                                        }}
                                    >

                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            gap={2}
                                        >

                                            <Typography>
                                                {
                                                    profiles[userId]
                                                        ?.displayName
                                                        ?? "Loading..."
                                                }
                                            </Typography>


                                            <Select
                                                defaultValue=""
                                                displayEmpty
                                                size="small"
                                                onChange={event => {

                                                    if (
                                                        event.target.value ===
                                                        "accept"
                                                    ) {

                                                        handleAcceptConnection(
                                                            connection.connectionId
                                                        );

                                                    }

                                                    if (
                                                        event.target.value ===
                                                        "decline"
                                                    ) {

                                                        handleDeclineConnection(
                                                            connection.connectionId
                                                        );

                                                    }

                                                }}
                                            >

                                                <MenuItem
                                                    value=""
                                                >
                                                    Actions
                                                </MenuItem>

                                                <MenuItem
                                                    value="accept"
                                                >
                                                    Accept
                                                </MenuItem>

                                                <MenuItem
                                                    value="decline"
                                                >
                                                    Decline
                                                </MenuItem>

                                            </Select>

                                        </Stack>

                                    </Paper>

                                );

                            }
                        )
                    }

                </Stack>

            </Paper>

        </Box>

    );

}
