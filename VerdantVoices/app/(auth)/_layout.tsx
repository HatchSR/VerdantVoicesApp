import { Stack, Redirect } from "expo-router";
import { useAuth } from "../providers/AuthProviders";

export default function AuthLayout() {
    const {isAuthenticated} = useAuth();

    if (isAuthenticated) return <Redirect href="/(tabs)"/>
    return <Stack/>
}