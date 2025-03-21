import { Stack,Tabs } from "expo-router";
import '../global.css'
import AuthProvider from "./providers/AuthProviders";
export default function RootLayout() {
  return(
    <AuthProvider>
<Stack screenOptions={{ headerShown: false }} />;
    </AuthProvider>
     
)
}
