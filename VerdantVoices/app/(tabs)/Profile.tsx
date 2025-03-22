import { Text, View, Image, TextInput, Alert } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Button from "../components/Button";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../providers/AuthProviders";
import CustomTextInput from "../components/CustomTextInput";
export default function ProfileScreen() {
  //if you want to add more information to profile, copy each instance of username and change the variable to the desired name, be sure to update profiles table in supabase to refelct the changes
      const [image, setImage] = useState<string | null>(null);
      const [username, setUsername] = useState('');
      ///const [email, setEmail] = useState('');
      const {user} = useAuth();
      useEffect(()=>{
          if (!image) {
              pickImage();
          }
      }, [image]);
  
      useEffect(() => {
        getProfile();
      }, []);

      const getProfile = async () => {
        if (!user) {
          return;
        }
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user?.id)
          .single();
  
        if (error) {
          console.log(error);
        }
        console.log(data);
  
        
        setUsername(data.username);
        //setEmail(data.email);
        setImage(data.avatar_url);
        
      }

      const updateProfile = async () => {
        if (!user) {
          return;
        }
        const { data, error } =
        await supabase
          .from('profiles')
          .update({
            username,
          })
          .eq('id', user.id)
          if (error) {
            Alert.alert('failed to update profile');
          } else{
            Alert.alert('profile updated');
          }
        }
      
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
      {/* <TextInput 
      value={username} 
      placeholder="Username" 
      className="bg-gray-200 p-3 rounded-lg my-3" 
      onChangeText={(newUsername) => setUsername(newUsername)}
      /> */}


      <CustomTextInput label="Username" value={username} onChangeText={(newUsername) => setUsername(newUsername)} />
       
      {/* <TextInput 
      value={email} 
      placeholder="Email" 
      className="bg-gray-200 p-3 rounded-lg my-3"
      onChangeText={(newEmail) => setEmail(newEmail)}
      /> */}
       

      {/*button*/}
      <View className="gap-3">
      <Button title="Update Profile" onPress={updateProfile}/>
      <Button title="Sign out" onPress={()=>supabase.auth.signOut()}/>
      </View>
    </View>
  );
}
