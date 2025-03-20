import { Tabs } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
export default function TabsLayout() {
    return(
    <Tabs screenOptions={{tabBarActiveTintColor: 'black', tabBarShowLabel: false}}>
        <Tabs.Screen name="index" options={{ headerTitle: 'For you', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" size={26} color={color} /> }} />
        <Tabs.Screen name="Profile" options={{ headerTitle: 'Profile', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={26} color={color} /> }} />
        <Tabs.Screen name="new" options={{ headerTitle: 'Create Post', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="note-plus-outline" size={26} color={color} /> }} />

    </Tabs>


     )
}
