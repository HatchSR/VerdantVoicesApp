import React, { useState, useEffect } from 'react';
import { Text, View, Modal, Dimensions, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import Button from "./Button";

export const LocationSelectionModal = ({ 
    visible, 
    initialLocation, 
    onLocationSelect, 
    onClose 
}) => {
    const [location, setLocation] = useState(initialLocation);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!visible) return;
        // console.log('Modal Visible:', visible);
        // console.log('Initial Location:', initialLocation);
        
        if (!location) {
            (async () => {
                try {
                    let { status } = await Location.requestForegroundPermissionsAsync();
                    if (status !== 'granted') {
                        setError('Location permission not granted');
                        return;
                    }

                    let currentLocation = await Location.getCurrentPositionAsync({});
                    const newLocation = {
                        latitude: currentLocation.coords.latitude,
                        longitude: currentLocation.coords.longitude
                    };
                    
                    // console.log('Current Location:', newLocation);
                    setLocation(newLocation);
                } catch (err) {
                    console.error('Location Error:', err);
                    setError('Could not get current location');
                }
            })();
        }
    }, [visible]);

    const handleMapPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        console.log('Map Pressed:', { latitude, longitude });
        setLocation({ latitude, longitude });
    };

    if (!visible) return null;

    if (error) {
        return (
            <Modal visible={visible} animationType="slide">
                <View className="flex-1 justify-center items-center">
                    <Text className="text-red-500">{error}</Text>
                    <Button title="Close" onPress={onClose} />
                </View>
            </Modal>
        );
    }

    if (!location) {
        return (
            <Modal visible={visible} animationType="slide">
                <View className="flex-1 justify-center items-center">
                    <Text>Loading location...</Text>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide">
            <View className="flex-1">
                <Text className="p-4 text-center">
                    {/* Debug Info: 
                    Lat: {location.latitude}, 
                    Long: {location.longitude} */}
                </Text>
                <MapView
                    style={{ 
                        flex: 1, 
                        width: Dimensions.get('window').width, 
                        height: Dimensions.get('window').height - 100 
                    }}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onPress={handleMapPress}
                >
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude
                        }}
                        title="Selected Location"
                    />
                </MapView>
                <View className="p-4 bg-white">
                    <Button 
                        title="Confirm Location" 
                        onPress={() => {
                            onLocationSelect(location);
                            
                        }}
                    />
                    <Button title="Cancel" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};