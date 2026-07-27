import {
    useEffect,
    type ReactNode
} from "react";

import {
    Box,
    CircularProgress
} from "@mui/material";

import { useAuth } from "./AuthProvider";

interface Props {

    children: ReactNode;
}

export default function RequireAuth({
    children
}: Props) {

    const {
        user,
        loading,
        login
    } = useAuth();

    useEffect(() => {

        if (!loading && !user) {

            login();

        }

    }, [loading, user, login]);

    if (loading || !user) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >

                <CircularProgress />

            </Box>

        );
    }

    return <>{children}</>;
}
