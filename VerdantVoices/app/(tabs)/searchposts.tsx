import { Text, View, FlatList, RefreshControl, TextInput, Alert } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";
import PostListItem from "~/app/components/Postlistitem";
import { LocationSelectionModal } from "../components/LocationSelectionModal";
import Button from "../components/Button";
import * as Location from 'expo-location';

// Haversine formula to calculate distance between two lat/long points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceInKm = R * c;
    return distanceInKm * 0.621371; // Convert to miles
};

export default function Feedscreen() {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [mapVisible, setMapVisible] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [range, setRange] = useState(10); // Default range in miles

    useEffect(() => {
        fetchPosts();
    }, []); 

    const useCurrentLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Location access is required.');
            return;
        }
    
        try {
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            
            setLocation({ latitude, longitude });
            filterPostsByLocation(latitude, longitude);
        } catch (error) {
            console.error('Error getting current location:', error);
            Alert.alert('Location Error', 'Could not retrieve your current location.');
        }
    };

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*, user:profiles(*)')
                .order('id', { ascending: false });

            if (error) throw error;

            setPosts(data || []);
        } catch (err) {
            console.error("Error fetching posts:", err);
            Alert.alert('Error', 'Could not fetch posts');
        } finally {
            setRefreshing(false);
        }
    };

    const filterPostsByLocation = async (lat: number, lon: number) => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*, user:profiles(*)')
                .order('id', { ascending: false });

            if (error) throw error;

            // Filter posts client-side based on distance
            const filteredPosts = (data || []).filter(post => {
                if (!post.lat || !post.long) return false;
                const distance = calculateDistance(lat, lon, post.lat, post.long);
                return distance <= range;
            });

            setPosts(filteredPosts);
        } catch (err) {
            console.error("Error filtering posts:", err);
            Alert.alert('Error', 'Could not filter posts');
        } finally {
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        if (location) {
            filterPostsByLocation(location.latitude, location.longitude);
        } else {
            fetchPosts();
        }
    };

    return (
        <View className="flex-1 gap-2">
            <View className="flex-col items-center gap-2 space-x-4 mt-2 px-4">
                <Button
                    title="Use Current Location" 
                    onPress={useCurrentLocation}
                />
                
                <Button 
                    title="Select Location" 
                    onPress={async () => {
                        if (!location) await useCurrentLocation();
                        setMapVisible(true);
                    }}
                />
            </View>

            <LocationSelectionModal 
                visible={mapVisible}
                initialLocation={location}
                onLocationSelect={(selectedLocation) => {
                    setLocation(selectedLocation);
                    filterPostsByLocation(selectedLocation.latitude, selectedLocation.longitude);
                    setMapVisible(false);
                }}
                onClose={() => setMapVisible(false)}
            />

            {location && (
                <View className="flex-col items-center space-x-2 px-4 mt-2">
                    <Text>
                        Location: {location.latitude.toFixed(4)}, 
                        {location.longitude.toFixed(4)}
                    </Text>
                    <View className="flex-row items-center space-x-4">
                    <Text className="pr-2">Input your desired search range in miles</Text>
                    <TextInput 
                        keyboardType="numeric"
                        value={range.toString()}
                        onChangeText={(text) => {
                            const newRange = parseInt(text) || 0;
                            setRange(newRange);
                            if (location) {
                                filterPostsByLocation(location.latitude, location.longitude);
                            }
                        }}
                        className="border p-2 w-20"
                    />
                    </View>
                </View>
            )}

            <FlatList
                data={posts}
                contentContainerStyle={{ gap: 10, paddingHorizontal: 16 }}
                renderItem={({ item }) => <PostListItem post={item} />}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#ff0000', '#00ff00', '#0000ff']}
                        tintColor={'#ff00ff'}
                    />
                }
                ListEmptyText={location ? "No posts within the selected range" : "No posts found"}
            />
        </View>
    );
}