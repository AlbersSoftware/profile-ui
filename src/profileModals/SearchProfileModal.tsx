import {
    useEffect,
    useState
} from "react";

import {
    Box,
    Button,
    CircularProgress,
    Modal,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import { searchProfiles } from "../services/profileService";

import type { ProfileSearchResponseDTO } from "../models/ProfileSearchResponseDTO";

import { useNavigate } from "react-router-dom";

interface SearchProfileModalProps {

    open: boolean;

    onClose: () => void;

}


export default function SearchProfileModal(
    {
        open,
        onClose
    }: SearchProfileModalProps
) {

    const [searchTerm,setSearchTerm] =
        useState("");

    const [profiles,setProfiles] =
        useState<ProfileSearchResponseDTO[]>([]);

    const [page,setPage] =
        useState(0);

    const [loading,setLoading] =
        useState(false);

    const [loadingMore,setLoadingMore] =
        useState(false);

    const navigate =
    useNavigate();

    useEffect(() => {

        if (!open) {

            return;
        }

        const trimmedSearchTerm =
            searchTerm.trim();

        if (!trimmedSearchTerm) {

            setProfiles([]);
            setPage(0);

            return;
        }


        const timeout =
            setTimeout(
                async () => {

                    try {

                        setLoading(true);

                        setPage(0);


                        const results =
                            await searchProfiles(
                                trimmedSearchTerm,
                                0,
                                20
                            );


                        setProfiles(
                            results
                        );


                    } catch(error) {

                        console.error(
                            "Failed searching profiles:",
                            error
                        );

                        setProfiles([]);


                    } finally {

                        setLoading(false);

                    }

                },
                300
            );


        return () =>
            clearTimeout(timeout);


    },[searchTerm,open]);


    async function handleLoadMore() {

        const nextPage =
            page + 1;

        try {

            setLoadingMore(true);


            const results =
                await searchProfiles(
                    searchTerm.trim(),
                    nextPage,
                    20
                );


            setProfiles(
                previous =>
                    [
                        ...previous,
                        ...results
                    ]
            );


            setPage(
                nextPage
            );


        } catch(error) {

            console.error(
                "Failed loading more profiles:",
                error
            );


        } finally {

            setLoadingMore(false);

        }

    }


    function handleClose() {

        setSearchTerm("");

        setProfiles([]);

        setPage(0);

        onClose();

    }

function handleProfileClick( userId: string ) {

    navigate(
        `/profile/${userId}`
    );

    handleClose();

}


    const hasMore =
        profiles.length > 0 &&
        profiles.length % 20 === 0;


    return (

        <Modal
            open={open}
            onClose={handleClose}
        >

            <Box
                sx={{
                    position:"absolute",
                    top:"50%",
                    left:"50%",
                    transform:"translate(-50%, -50%)",
                    width:500,
                    maxHeight:"80vh"
                }}
            >

                <Paper
                    sx={{
                        p:4,
                        maxHeight:"80vh",
                        overflow:"auto"
                    }}
                >

                    <Typography
                        variant="h5"
                        mb={3}
                    >
                        Search Profiles
                    </Typography>


                    <TextField
                        label="Search by name"
                        value={searchTerm}
                        onChange={
                            event =>
                                setSearchTerm(
                                    event.target.value
                                )
                        }
                        fullWidth
                        autoFocus
                    />


                    <Box sx={{mt:3}}>

                        {
                            loading &&

                            <Stack
                                alignItems="center"
                                sx={{py:3}}
                            >

                                <CircularProgress
                                    size={28}
                                />

                            </Stack>
                        }


                        {
                            !loading &&
                            searchTerm.trim() &&
                            profiles.length === 0 &&

                            <Typography
                                color="text.secondary"
                            >
                                No profiles found.
                            </Typography>
                        }


                        <Stack spacing={1}>

                            {
                                profiles.map(
                                    profile => (

                                        <Paper
                                      key={ profile.userId }
                                      variant="outlined"
                                      sx={{
                                          p:2,
                                          cursor:"pointer",
                                          "&:hover": {
                                          backgroundColor:
                                          "action.hover"
                                                  }
                                            }}
                                        onClick={() =>
                                        handleProfileClick(
                                        profile.userId
                                              )
                                              }
                                                >

                                            <Typography>
                                                {
                                                    profile.displayName
                                                }
                                            </Typography>

                                        </Paper>

                                    )
                                )
                            }

                        </Stack>


                        {
                            hasMore &&
                            !loading &&

                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{mt:2}}
                                onClick={
                                    handleLoadMore
                                }
                                disabled={
                                    loadingMore
                                }
                            >

                                {
                                    loadingMore
                                        ? "Loading..."
                                        : "Load More"
                                }

                            </Button>
                        }

                    </Box>


                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{mt:3}}
                        onClick={handleClose}
                    >

                        Close

                    </Button>


                </Paper>

            </Box>

        </Modal>

    );

}


