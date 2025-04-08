import { Text, View, Image, TextInput, Alert } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Button from "../components/Button";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../providers/AuthProviders";
import CustomTextInput from "../components/CustomTextInput";
import { cld, uploadImage } from "~/lib/cloudinary";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "cloudinary-react-native";

export default function ProfileScreen() {
  //if you want to add more information to profile, copy each instance of username and change the variable to the desired name, be sure to update profiles table in supabase to refelct the changes
      const [image, setImage] = useState<string | null>(null);
      const [remoteImage, setRemoteImage] = useState<string | null>(null);
      const [username, setUsername] = useState('');

      ///const [email, setEmail] = useState('');
      const {user} = useAuth();
      // useEffect(()=>{
      //     if (!image) {
      //         pickImage();
      //     }
      // }, [image]);
  
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
        ;
  
        
        setUsername(data.username);
        //setEmail(data.email);
        setRemoteImage(data.avatar_url);
        
      }

      const updateProfile = async () => {
        if (!user) {
          return;
        }

        const updatedProfile = {
          username,
        }
        if (image){
          const response = await uploadImage(image);
          // console.log(response?.public_id);
          updatedProfile.avatar_url = response.public_id
        }
        const { data, error } =
        await supabase
          .from('profiles')
          .update(
            updatedProfile
          )
          .eq('id', user.id)
          if (error) {
            Alert.alert('failed to update profile');
            console.log(error);
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
    
    let remoteCloudinaryimage;
    if (remoteImage) {
      remoteCloudinaryimage = cld.image(remoteImage);
      //const {width} = 411
      remoteCloudinaryimage
      .resize(thumbnail().width(300).height(300)) 
      
    }

  
  return (
    
    <View className="p-3">
      {/*avatar picker*/}
      {image ? (
          <Image source={{uri: image}}
          className="w-52 aspect-square self-center rounded-full"/>
          
          
          
        ) : remoteCloudinaryimage?(
          <AdvancedImage cldImg={remoteCloudinaryimage} className="w-52 aspect-square self-center rounded-full" />
        ):(
          <View className="w-52 aspect-square bg-gray-300 rounded-full self-center justify-center"/>
        )}
        <View className="my-2">
        <Text  
          onPress={pickImage}
          style={{  backgroundColor: "#8F885D" }} 
          className=" self-center font-semibold text-white p-2 rounded-lg">
            change photo
        </Text>
        </View>
      

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
