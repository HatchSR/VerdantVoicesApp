import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import Button from "../components/Button";
import { uploadImage } from "../../lib/cloudinary";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../providers/AuthProviders";
import { router } from "expo-router";

export default function CreatePost() {
    const {session} = useAuth();
    const [loading, setLoading] = useState(false);
   
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        if (!image) {
            requestPermissions();
        }
    }, [image]);
   
    const requestPermissions = async () => {
        const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

        if (!libraryPermission.granted || !cameraPermission.granted) {
            alert('Sorry, we need camera and photo library permissions to make this work!');
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
        if (!image) {
            console.log('no image');
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
                    user_id: session?.user.id 
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
  
            <View className="flex-row space-x-4 mt-2">
                <TouchableOpacity 
                    onPress={choosePhotoFromLibrary} 
                    className="bg-blue-400 px-4 py-2 rounded-lg"
                >
                    <Text className="text-white">Choose Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={takePhotoWithCamera} 
                    className="bg-blue-400 px-4 py-2 rounded-lg"
                >
                    <Text className="text-white">Take Photo</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                value={caption}
                onChangeText={(newCaption) => setCaption(newCaption)}
                placeholder="Write a caption..."
                className="text-lg font-semibold w-full p-3"
                multiline
            />

            <Button 
                title="Post" 
                onPress={sharePost}
                disabled={loading || !image}
                >
                {loading ? (
                    <ActivityIndicator color='white'/>) 
                    : 
                    (<Text className="text-white">post</Text>

                    )}
            </Button>
            
        </View>
    );
}

