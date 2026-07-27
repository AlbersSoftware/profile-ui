import { Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import { AuthProvider } from "./auth/AuthProvider.tsx";
import RequireAuth from "./auth/RequireAuth.tsx";

import AuthCallbackPage from "./pages/AuthCallbackPage";
import CreateProfilePage from "./pages/CreateProfilePage";
import ProfilePage from "./pages/ProfilePage";
import MyConnectionsPage from "./pages/MyConnectionsPage";

function App() {

    return (

        <>
            <CssBaseline />

            <AuthProvider>

                <Routes>

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/auth/callback"
                                replace
                            />
                        }
                    />


                    <Route
                        path="/auth/callback"
                        element={
                            <AuthCallbackPage />
                        }
                    />


                    <Route
                        path="/create-profile"
                        element={
                            <RequireAuth>
                                <CreateProfilePage />
                            </RequireAuth>
                        }
                    />


                    <Route
                        path="/profile/:userId"
                        element={
                            <RequireAuth>
                                <ProfilePage />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path="/connections"
                        element={
                            <RequireAuth>
                                <MyConnectionsPage />
                            </RequireAuth>
                        }
                    />

                </Routes>

            </AuthProvider>

        </>
    );
}


export default App;
