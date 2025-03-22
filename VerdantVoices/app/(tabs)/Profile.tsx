import { Text, View, Image, TextInput } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Button from "../components/Button";
import { supabase } from "../../lib/supabase";
export default function Index() {
  
      const [image, setImage] = useState<string | null>(null);
      const [username, setUsername] = useState('');
      const [email, setEmail] = useState('');
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
        aspect: [1, 1],
        quality: 1,
      });
  
      
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };
  
  return (
    
    <View className="p-3">
      {/*avatar picker*/}
      {image ? (
          <Image source={{uri: image}}
          className="w-52 aspect-square self-center rounded-full"/>
          
          
          
        ) :(
          <View className="w-52 aspect-square bg-gray-300 rounded-full self-center justify-center"/>
        )}
        <Text  onPress={pickImage} className="text-blue-400 self-center font-semibold">change photo</Text>
      

      {/*user info form*/}
      <TextInput 
      value={username} 
      placeholder="Username" 
      className="bg-gray-200 p-3 rounded-lg my-3" 
      onChangeText={(newUsername) => setUsername(newUsername)}
      />
       
      <TextInput 
      value={email} 
      placeholder="Email" 
      className="bg-gray-200 p-3 rounded-lg my-3"
      onChangeText={(newEmail) => setEmail(newEmail)}
      />
       

      {/*button*/}
      <View>
      <Button title="Update Profile"/>
      <Button title="Sign out" onPress={()=>supabase.auth.signOut()}/>
      </View>
    </View>
  );
}
