import { Stack,Tabs } from "expo-router";
import '../global.css'
import AuthProvider from "./providers/AuthProviders";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function RootLayout() {
  return(
    <GestureHandlerRootView style={{ flex: 1 }}>
      
    <AuthProvider>
<Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
    
    </GestureHandlerRootView>
     
)
}
