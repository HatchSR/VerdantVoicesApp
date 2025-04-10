import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import Button from "../components/Button";
import { LocationSelectionModal } from "../components/LocationSelectionModal";
import { uploadImage } from "../../lib/cloudinary";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../providers/AuthProviders";
import { router } from "expo-router";
import * as Location from 'expo-location';
import { Dropdown } from 'react-native-element-dropdown';

export default function CreatePost() {
    const {session} = useAuth();
    const [loading, setLoading] = useState(false);
   
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [mapVisible, setMapVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    

    
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);
        const [selectedItem, setSelectedItem] = useState(null);



    const fetchDropdownData = async () => {
        try {
            const { data, error } = await supabase
                .from('flora')
                .select('ComName')
                .order('id', { ascending: false });

            if (error) throw error;
            // console.log(data);

            setPosts(data);
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    useEffect(() => {
        if (!image) {
            requestPermissions();
        }
    }, [image,caption,location]);

    useEffect(() => {
        fetchDropdownData();
    }, []);

 
   
    const requestPermissions = async () => {
        try {
            const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            const locationPermission = await Location.requestForegroundPermissionsAsync();
    
            if (!libraryPermission.granted || !cameraPermission.granted || locationPermission.status !== 'granted') {
                alert('Sorry, we need camera, photo library, and location permissions to make this work!');
            }
        } catch (error) {
            console.error('Error requesting permissions:', error);
        }
    };
    
    const choosePhotoFromLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });
   
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setMapVisible(true);
        }
    };

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
            setMapVisible(true);
        } catch (error) {
            console.error('Error getting current location:', error);
            Alert.alert('Location Error', 'Could not retrieve your current location.');
        }
    };

    const takePhotoWithCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });
   
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
 
    const sharePost = async() => {
        console.log('CAPTION',caption);
        if (!image || !location) {
            console.log('no image or location');
            return;
        }
        setLoading(true);

        try {
            // Upload to cloudinary
            const response = await uploadImage(image);
            // Save image to DB
            const { data, error } = await supabase
            
            .from('posts')
            .insert([
                { 
                    caption,
                    image: response?.public_id,
                    user_id: session?.user.id,
                    lat: location?.latitude,
                    long: location?.longitude
                },
            ])
            .select();

            if (error) {
                console.error('Error uploading post:', error);
                setLoading(false);
                return;
            }

            router.push('/(tabs)');
        } catch (err) {
            console.error('Error in sharePost:', err);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        
        <View className="p-3 items-center">
            {loading && <Text>Posting ...</Text>}
            {image ? (
                <Image 
                    source={{uri: image}}
                    className="w-52 aspect-[3/4] rounded-lg"
                />
            ) : (
                <View className="w-52 aspect-[3/4] bg-gray-300 rounded-lg items-center justify-center"/>
            )}
  
            <View className="flex-row space-x-4 gap-2 mb-6 mt-2">
                <TouchableOpacity 
                    onPress={choosePhotoFromLibrary} 
                    style={{ backgroundColor: '#8F885D' }}
                    className="px-4 py-2 rounded-lg"
                >
                    <Text className="text-white">Choose Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={takePhotoWithCamera}
                    style={{ backgroundColor: '#8F885D' }} 
                    className=" px-4 py-2 rounded-lg"
                >
                    <Text className="text-white">Take Photo</Text>
                </TouchableOpacity>
            </View>


                <Dropdown
                    value = {caption}
                    data={posts}
                    search
                    maxHeight={300}
                    labelField="ComName"
                    valueField="ComName"
                    placeholder={!isDropdownOpen ? 'Select item' : '...'}
                    searchPlaceholder="Search..."
                    mode="default"
                    open={isDropdownOpen}
                    onOpen={() => setIsDropdownOpen(true)}
                    onClose={() => setIsDropdownOpen(false)}
                    onChange={(item) => {
                        setCaption(item.ComName);
                        setIsDropdownOpen(false);
                    }}
                    style = {{
                        width: '100%',
                    }}
                />
            

            {/* <TextInput
                value={caption}
                onChangeText={(newCaption) => setCaption(newCaption)}
                placeholder="Write a caption..."
                className="text-lg font-semibold w-full p-3 bg-gray-200"
                multiline
            /> */}
            <View className="flex-col space-x-4 gap-2 mb-6 mt-2">
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
                    setMapVisible(false);
                }}
                onClose={() => setMapVisible(false)}
            />

            {location && (
                <Text>
                    Location: {location.latitude.toFixed(4)}, 
                    {location.longitude.toFixed(4)}
                </Text>
            )}

            <Button 
                title="Post" 
                onPress={sharePost}
                disabled={loading || !image}
            >
                {loading ? (
                    <ActivityIndicator color='white'/>) 
                    : 
                    (<Text className="text-white">post</Text>)
                }
            </Button>
        </View>
    );
}