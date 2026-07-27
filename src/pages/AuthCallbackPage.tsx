import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";

import {
    getUserClaims,
    login
} from "../services/authService";

import {
    createUser
} from "../services/userService";

import {
    getProfileByUserId
} from "../services/profileService";

export default function AuthCallbackPage() {

    const navigate = useNavigate();

    const {
        setAppUser
    } = useAuth();

    useEffect(() => {

        async function handleAuthentication() {

            try {

                console.log(
                    "AUTH CALLBACK START"
                );

                console.log(
                    "Current URL:",
                    window.location.href
                );

                const claims =
                    await getUserClaims();

                console.log(
                    "Cognito claims:",
                    claims
                );

                if (!claims) {

                    console.log(
                        "No session found. Redirecting to Cognito."
                    );

                    await login();

                    return;
                }

                console.log(
                    "Creating/verifying user..."
                );

                const user =
                    await createUser();

                setAppUser(
                    user
                );

                console.log(
                    "User response:",
                    user
                );

                console.log(
                    "Checking profile..."
                );

                const profile =
                    await getProfileByUserId(
                        user.userId
                    );

                console.log(
                    "Profile response:",
                    profile
                );

                if (!profile) {

                    console.log(
                        "No profile. Redirecting create profile."
                    );

                    navigate(
                        "/create-profile"
                    );

                    return;
                }

                console.log(
                    "Profile exists. Redirecting profile page."
                );

              navigate(`/profile/${user.userId}`);

            } catch (error) {

                console.error(
                    "AUTH FLOW FAILED:",
                    error
                );
            }
        }

        handleAuthentication();

    }, [
        navigate,
        setAppUser
    ]);

    return (
        <h2>
            Loading Kinorify...Where memories are made!
        </h2>
    );
}
