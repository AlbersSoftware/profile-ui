import {
    fetchAuthSession,
    signInWithRedirect,
    signOut
} from "aws-amplify/auth";


export async function login() {

    await signInWithRedirect();

}


export async function logout() {

    await signOut();

}


export async function getSession() {

    return await fetchAuthSession();

}


export async function getAccessToken(): Promise<string | null> {

    const session =
        await fetchAuthSession();


    return (
        session.tokens
            ?.accessToken
            ?.toString()
        ?? null
    );

}


export async function getIdToken(): Promise<string | null> {

    const session =
        await fetchAuthSession();


    return (
        session.tokens
            ?.idToken
            ?.toString()
        ?? null
    );

}


export async function getUserClaims() {

    try {

        console.log("Fetching Cognito session...");


        const session = await fetchAuthSession();
      console.log("Cognito session:", session);
     const payload = session.tokens?.idToken?.payload;
    console.log("ID token payload:", payload);
        if (!payload) {

            return null;
        }
        return {

            sub:
                payload.sub as string,

            email:
                payload.email as string,

            emailVerified:
                payload.email_verified as boolean

        };
    } catch(error) {

        console.error("Failed to fetch Cognito session:", error);
        return null;
    }

}


