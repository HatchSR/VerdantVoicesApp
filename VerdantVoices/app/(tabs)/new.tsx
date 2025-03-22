import { Text, View, Image, TextInput,Pressable } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import Button from "../components/Button";
import {upload} from 'cloudinary-react-native';
import { cld, uploadImage } from "../../lib/cloudinary";
import { UploadApiResponse } from "cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../providers/AuthProviders";
import { router } from "expo-router";

export default function CreatePost() {
    const {session} = useAuth();
    
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<string | null>(null);
    useEffect(()=>{
        if (!image) {
            pickImage();
        }
    }, [image]);

    
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
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
        console.log('no image ')
        return}
    //upload to cloudinary
    //console.log(image)
    const response = await uploadImage(image);
    //console.log(response?.public_id)

    //save image to DB

    const { data, error } = await supabase
    .from('posts')
    .insert([
    { caption, 
        image: response?.public_id, 
        user_id: session?.user.id },
    ])
    .select()
    router.push('/(tabs)');
  }

  return (

    <View className="p-3 items-center">
    {/*image picker*/}
    {image ? (
    <Image source={{uri: image}}
    className="w-52 aspect-[3/4] rounded-lg"/>
    
    
    
  ) :(
    <View className="w-52 aspect-[3/4] bg-gray-300 rounded-lg items-center justify-center"/>
  )}
  <Text  onPress={pickImage} className="text-blue-400 font-semibold">change photo</Text>
    {/*text input*/}
    <TextInput 
    value={caption}
    onChangeText={(newCaption) => setCaption(newCaption)} 
    placeholder="write a caption..." 
    className="text-lg font-semibold w-full p-3"/>


    {/*submit button*/}
    <Button title="Post" onPress={sharePost}/>
    {/* <View className="mt-auto w-full">
    <Pressable onPress={() => {}} className="bg-blue-400 w-full items-center py-3 rounded-lg">
        <Text className="text-white font-semibold">Post</Text>
    </Pressable>
    </View> */}

    </View>
  );
}