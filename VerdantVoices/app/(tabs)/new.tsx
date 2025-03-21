import { Text, View, Image, TextInput,Pressable } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import Button from "../components/Button";

export default function CreatePost() {
    
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
      quality: 1,
    });

    

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

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
    <Button title="Post"/>
    {/* <View className="mt-auto w-full">
    <Pressable onPress={() => {}} className="bg-blue-400 w-full items-center py-3 rounded-lg">
        <Text className="text-white font-semibold">Post</Text>
    </Pressable>
    </View> */}

    </View>
  );
}