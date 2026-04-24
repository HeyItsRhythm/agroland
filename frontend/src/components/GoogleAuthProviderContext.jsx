import { GoogleOAuthProvider } from '@react-oauth/google';

export const GoogleAuthProviderContext = ({ children }) => {
    // Replace with your actual Client ID
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
};
