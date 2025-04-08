import { Tabs, Redirect } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from "../providers/AuthProviders";
export default function TabsLayout() {
    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) return <Redirect href="/(auth)"/>
    return(
        
    <Tabs screenOptions={{tabBarActiveTintColor: 'white', tabBarInactiveTintColor: '#B1B68E', tabBarStyle:{ backgroundColor: '#726A36'}}}>
        <Tabs.Screen name="index" options={{tabBarLabel: 'Home', headerTitle: 'Home', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="newspaper-variant-outline" size={26} color={color} /> }} />
        <Tabs.Screen name="Profile" options={{tabBarLabel: 'Profile', headerTitle: 'Profile', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={26} color={color} /> }} />
        <Tabs.Screen name="new" options={{tabBarLabel: 'Create Post', headerTitle: 'Create Post', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="camera-plus-outline" size={26} color={color} /> }} />
        <Tabs.Screen name="searchposts" options={{tabBarLabel: 'Search', headerTitle: 'Search Posts', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="map-marker-outline" size={26} color={color} /> }} />
        <Tabs.Screen name="flora" options={{tabBarLabel: 'Flora', headerTitle: 'Flora', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="flower-tulip-outline" size={26} color={color} /> }} />
        

    </Tabs>


     )
}
