import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";

import {
    fetchAuthSession,
    getCurrentUser,
    signInWithRedirect,
    signOut
} from "aws-amplify/auth";

import type {
    UserResponseDTO
} from "../models/UserResponseDTO";

import {
    getUserByCognitoSub
} from "../services/userService";


export interface AuthContextType {

    user:
        Awaited<ReturnType<typeof getCurrentUser>> | null;

    appUser:
        UserResponseDTO | null;

    setAppUser:
        (user: UserResponseDTO | null) => void;

    accessToken:
        string | null;

    loading:
        boolean;

    login:
        () => Promise<void>;

    logout:
        () => Promise<void>;

}



const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );



interface Props {

    children: ReactNode;

}



export function AuthProvider({
    children
}: Props) {


    const [user, setUser] =
        useState<AuthContextType["user"]>(null);



    const [appUser, setAppUser] =
        useState<UserResponseDTO | null>(null);



    const [accessToken, setAccessToken] =
        useState<string | null>(null);



    const [loading, setLoading] =
        useState(true);





    useEffect(() => {


        async function loadUser() {


            try {


                const currentUser =
                    await getCurrentUser();



                const session =
                    await fetchAuthSession();



                const token =
                    session.tokens?.accessToken?.toString()
                    ?? null;



                setUser(
                    currentUser
                );



                setAccessToken(
                    token
                );

                console.log("Access token:", session.tokens?.accessToken?.toString());

                /*
                 * Hydrate application user.
                 *
                 * Cognito userId is the Cognito sub.
                 * Application userId is the UUID owned
                 * by profile.users.user_id.
                 */
                const backendUser =
                    await getUserByCognitoSub(
                        currentUser.userId
                    );



                setAppUser(
                    backendUser
                );



            } catch(error) {


                console.error(
                    "Failed loading authenticated user:",
                    error
                );


                setUser(null);

                setAppUser(null);

                setAccessToken(null);


            } finally {


                setLoading(false);


            }


        }



        loadUser();


    }, []);





    async function login() {


        try {


            await getCurrentUser();


            /*
             * User is already authenticated.
             * Avoid Cognito redirect loop.
             */
            return;


        } catch {


            await signInWithRedirect();


        }


    }





    async function logout() {


        setUser(null);

        setAppUser(null);

        setAccessToken(null);



        await signOut({
            global:true
        });


    }





    return (

        <AuthContext.Provider
            value={{
                user,
                appUser,
                setAppUser,
                accessToken,
                loading,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}





export function useAuth() {


    const context =
        useContext(AuthContext);



    if (!context) {


        throw new Error(
            "useAuth must be used inside an AuthProvider."
        );


    }



    return context;


}
