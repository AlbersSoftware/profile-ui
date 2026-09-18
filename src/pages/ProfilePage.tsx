import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import { useAuth } from "../auth/AuthProvider";

import {
    getProfileByUserId,
    updateProfile
} from "../services/profileService";

import {
    getConnectionByUsers,
    requestConnection
} from "../services/profileConnectionService";
import { getProfileAvatar } from "../services/mediaService";

import AddAvatarModal from "../modals/AddAvatarModal";

import type { ProfileResponseDTO } from "../models/ProfileResponseDTO";

import type { ProfileConnectionResponseDTO } from "../models/ProfileConnectionResponseDTO";

import EditProfileModal from "../profileModals/EditProfileModal";
import SearchProfileModal from "../profileModals/SearchProfileModal";


export default function ProfilePage() {


    const navigate =
        useNavigate();


    const {
        user,
        appUser,
        loading,
        login,
        logout
    } = useAuth();



    const {
        userId
    } = useParams();



    const [profile, setProfile] =
        useState<ProfileResponseDTO | null>(
            null
        );


    const [connection, setConnection] =
        useState<ProfileConnectionResponseDTO | null>(
            null
        );


    const [loadingProfile, setLoadingProfile] =
        useState(true);


    const [editOpen, setEditOpen] =
        useState(false);
    
    const [searchOpen, setSearchOpen] =
        useState(false);
// avatar state
const [avatarOpen, setAvatarOpen] =
    useState(false);

const [avatarUrl, setAvatarUrl] =
    useState<string | null>(null);


  const currentUserId =
    appUser?.userId;


const viewingOwnProfile =
    currentUserId === userId;

    console.log("AUTH DEBUG", {
    cognitoUserId: user?.userId,
    appUserId: appUser?.userId,
    routeUserId: userId,
    currentUserId,
    viewingOwnProfile
      });

useEffect(() => {

    async function loadProfile() {

        if (!userId) {
            return;
        }

        setProfile(null);
        setLoadingProfile(true);

        try {

            const response =
                await getProfileByUserId(
                    userId
                );

            setProfile(
                response
            );

        } catch(error) {

            console.error(
                error
            );

        } finally {

            setLoadingProfile(false);

        }

    }

    loadProfile();

}, [userId]);


useEffect(() => {

    async function loadAvatar() {

        if (!profile?.avatarMediaId) {

            setAvatarUrl(null);

            return;
        }

        try {

            const avatar =
                await getProfileAvatar(
                    profile.avatarMediaId
                );

            setAvatarUrl(
                avatar.imageUrl
            );

        } catch(error) {

            console.error(
                "Failed loading profile avatar:",
                error
            );

            setAvatarUrl(null);
        }
    }

    loadAvatar();

}, [profile?.avatarMediaId]);



    useEffect(() => {


        async function loadConnection() {


            if (
                !appUser ||
                !userId ||
                viewingOwnProfile
            ) {

                return;
            }


            try {


                const response =
                    await getConnectionByUsers(
                        currentUserId,
                        userId
                    );


                setConnection(
                    response
                );


            } catch(error) {


                console.error(
                    error
                );

            }

        }


        loadConnection();


    }, [
        currentUserId,
        userId,
        viewingOwnProfile
    ]);





    async function saveProfile(
        updatedProfile: ProfileResponseDTO
    ) {


        if (!appUser) {

            return;
        }


        const response =
            await updateProfile(
                appUser.userId,
                updatedProfile
            );


        setProfile(
            response
        );

    }


async function handleRequestConnection() {

    console.log(
        "Request connection clicked"
    );

    console.log(
        "appUser:",
        appUser
    );

    console.log(
        "userId:",
        userId
    );
    if (!userId) {
        return;
    }

    try {


        const response =
            await requestConnection(
                userId
            );


        setConnection(
            response
        );


    } catch(error) {


        console.error(
            "Failed requesting connection:",
            error
        );


    }

}


    async function handleLogout() {

        await logout();

    }





    function getConnectionStatus() {


        if (!connection) {

            return "None";

        }


        return connection.status;

    }





    if (
        loading ||
        loadingProfile
    ) {

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





    if (!user) {


        return (

            <Box
                sx={{
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    height:"100vh"
                }}
            >

                <Button
                    variant="contained"
                    onClick={login}
                >

                    Sign In

                </Button>


            </Box>

        );

    }

// back to profile button if viewing someone elses profile

    return (

        <Box
            sx={{
                maxWidth:900,
                mx:"auto",
                mt:5
            }}
        >

            <Paper
                sx={{
                    p:4
                }}
            >
             
                {
    !viewingOwnProfile && currentUserId &&

    <Button
        variant="outlined"
        sx={{
            mb: 3
        }}
        onClick={() =>
            navigate(
                `/profile/${currentUserId}`
            )
        }
    >

        Back to My Profile

    </Button>
}



                <Stack
                    direction="row"
                    spacing={3}
                    alignItems="center"
                >

                    <Avatar
                        src={
                            avatarUrl
                                ?? undefined
                        }
                        alt={
                            profile?.displayName
                                ?? "Profile avatar"
                        }
                        onClick={
                            viewingOwnProfile
                                ? () =>
                                    setAvatarOpen(true)
                                : undefined
                        }
                        sx={{
                            width: 96,
                            height: 96,

                            cursor:
                                viewingOwnProfile
                                    ? "pointer"
                                    : "default",

                            transition:
                                "opacity 0.2s ease",

                            "&:hover": viewingOwnProfile
                                ? {
                                    opacity: 0.8
                                }
                                : undefined
                        }}
                    />


                    <Box>


                        <Typography
                            variant="h4"
                        >

                            {
                                profile?.displayName
                            }

                        </Typography>


                        <Typography
                            color="text.secondary"
                        >

                            {
                                profile?.email
                            }

                        </Typography>


                    </Box>


                </Stack>




                <Divider
                    sx={{
                        my:3
                    }}
                />





                <Typography>
                    <strong>
                        Display Name:
                    </strong>{" "}
                    {
                        profile?.displayName
                    }
                </Typography>



                <Typography>
                    <strong>
                        Phone:
                    </strong>{" "}
                    {
                        profile?.phone
                    }
                </Typography>




                <Typography>
                    <strong>
                        Email:
                    </strong>{" "}
                    {
                        profile?.email
                    }
                </Typography>




                <Typography>
                    <strong>
                        Timezone:
                    </strong>{" "}
                    {
                        profile?.timezone
                    }
                </Typography>




                <Typography>
                    <strong>
                        Birthday:
                    </strong>{" "}
                    {
                        profile?.birthday
                    }
                </Typography>




                <Typography
                    sx={{
                        mt:2
                    }}
                >

                    <strong>
                        Bio:
                    </strong>

                </Typography>



                <Typography>

                    {
                        profile?.bio
                    }

                </Typography>





                {
                    !viewingOwnProfile &&

                    <>

                        <Divider
                            sx={{
                                my:3
                            }}
                        />



                        <Typography>

                            <strong>
                                Status:
                            </strong>{" "}

                            {
                                getConnectionStatus()
                            }

                        </Typography>



                        <Stack
                            direction="row"
                            spacing={2}
                            mt={2}
                        >


                            {
                                !connection &&

                                <Button
                                    variant="contained"
                                    onClick={handleRequestConnection}
                                >

                                    Request Connection
                                  
                                </Button>

                            }




                            {
                                connection?.status === "ACCEPTED" &&

                                <Button
                                    variant="outlined"
                                >

                                    Remove Connection

                                </Button>

                            }




                            {
                                connection?.status === "PENDING" &&

                                <Button
                                    variant="outlined"
                                >

                                    Cancel Connection Request

                                </Button>

                            }



                        </Stack>

                    </>

                }







                {
                    viewingOwnProfile &&

                    <Stack
                        direction="row"
                        spacing={2}
                        mt={4}
                    >


                        <Button
                            variant="contained"
                            onClick={() =>
                                setEditOpen(true)
                            }
                        >

                            Update Profile

                        </Button>



                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigate(
                                    "/connections"
                                )
                            }
                        >

                            My Connections

                        </Button>

                      <Button
                      variant="outlined"
                      onClick={() =>
                      setSearchOpen(true)
                                }
                                >

                            Search

                          </Button>

                    </Stack>

                }





                <Divider
                    sx={{
                        my:3
                    }}
                />



                <Button
                    color="error"
                    onClick={handleLogout}
                >

                    Sign Out

                </Button>




            </Paper>

{
    viewingOwnProfile &&

    <Box
        sx={{
            mt: 2
        }}
    >

        <Button
            fullWidth
            variant="outlined"
            onClick={() =>
                window.location.href =
                    "http://localhost:5174?fromProfile=true"
            }
        >

            Collections

        </Button>

    </Box>
}



            {
                profile &&
                viewingOwnProfile &&

                <EditProfileModal

                    open={editOpen}

                    profile={profile}

                    onClose={() =>
                        setEditOpen(false)
                    }

                    onSave={
                        saveProfile
                    }

                />

            }

                {viewingOwnProfile && profile && (
        <AddAvatarModal
            open={avatarOpen}
            profile={profile}
            onClose={() =>
                setAvatarOpen(false)
            }
            onSaved={(updatedProfile) => {

                setProfile(
                    updatedProfile
                );

                setAvatarOpen(false);
            }}
        />
    )}

<SearchProfileModal

    open={searchOpen}

    onClose={() =>
        setSearchOpen(false)
    }

/>





        </Box>

    );

}
