import { Text, View, Image, Alert, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Button from "../components/Button";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../providers/AuthProviders";
import CustomTextInput from "../components/CustomTextInput";
import { cld, uploadImage } from "~/lib/cloudinary";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "cloudinary-react-native";
import PostListItem from "~/app/components/Postlistitem";
import { useRoute, useNavigation } from "@react-navigation/native";



export default function ProfileScreen() {
  const [image, setImage] = useState(null);
  const [remoteImage, setRemoteImage] = useState(null);
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
  const [profileUserId, setProfileUserId] = useState(null);
  const navigation = useNavigation();

  const route = useRoute();
  const { user } = useAuth();

  useEffect(() => {
    // Get the profileUserId from route params or default to current user's ID
    const routeUserId = route.params?.userId;
    const userIdToUse = routeUserId || user?.id;
    
    setProfileUserId(userIdToUse);
    
    // Check if this is the current user's profile
    setIsCurrentUserProfile(userIdToUse === user?.id);
    
    // console.log('user id passed:', userIdToUse, 'is current user:', userIdToUse === user?.id);
    
    // Fetch the profile info and posts
    getProfile(userIdToUse);
    fetchPosts(userIdToUse);
  }, [route.params?.userId, user?.id]);

  const fetchPosts = async (userId) => {
    if (!userId) return;
    
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*, user:profiles(*)')
        .eq('user_id', userId)
        .order('id', { ascending: false });

      if (error) throw error;

      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchPosts(profileUserId);
  };

  const getProfile = async (userId) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', userId)
        .single();

      if (error) {
        console.log("Error fetching profile:", error);
        return;
      }

      setUsername(data.username);
      setRemoteImage(data.avatar_url);
    } catch (err) {
      console.error("Error in getProfile:", err);
    }
  };

  const updateProfile = async () => {
    if (!user || !isCurrentUserProfile) {
      return;
    }

    const updatedProfile = {
      username,
    };
    
    if (image) {
      const response = await uploadImage(image);
      updatedProfile.avatar_url = response.public_id;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('id', user.id);
      
    if (error) {
      Alert.alert('Failed to update profile');
      console.log(error);
    } else {
      Alert.alert('Profile updated');
      // Refresh the profile data
      getProfile(user.id);
    }
  };

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
    remoteCloudinaryimage.resize(thumbnail().width(300).height(300));
  }

  const profileHeader = () => {
    return (
      <View className="p-3">
        {/* Avatar display */}
        {/* Edit profile section - only shown for current user */}
        {isCurrentUserProfile ? (
          <>
            {image ? (
              <Image
                source={{ uri: image }}
                className="w-52 aspect-square self-center rounded-full"
              />
            ) : remoteCloudinaryimage ? (
              <AdvancedImage
                cldImg={remoteCloudinaryimage}
                className="w-52 aspect-square self-center rounded-full"
              />
            ) : (
              <View className="w-52 aspect-square bg-gray-300 rounded-full self-center justify-center" />
            )}
   
            {/* Username display */}
            <Text className="text-xl font-bold text-center mt-4 mb-2">
              {username}
            </Text>
            <View className="mt-4">
              <View className="my-2">
                <Text  
                  onPress={pickImage}
                  style={{ backgroundColor: "#8F885D" }}
                  className="self-center font-semibold text-white p-2 rounded-lg">
                  Change photo
                </Text>
              </View>
              <CustomTextInput
                label="Username"
                value={username}
                onChangeText={(newUsername) => setUsername(newUsername)}
              />
              <View className="gap-3 mt-4">
                <Button title="Update Profile" onPress={updateProfile} />
                <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
              </View>
            </View>
          </>
        ) : (
          <>
            <Button
              title="Back To my Profile"
              onPress={() => {
                navigation.navigate('Profile', { userId: user?.id });
              }}
            />
            {image ? (
              <Image
                source={{ uri: image }}
                className="w-52 aspect-square self-center rounded-full"
              />
            ) : remoteCloudinaryimage ? (
              <AdvancedImage
                cldImg={remoteCloudinaryimage}
                className="w-52 aspect-square self-center rounded-full"
              />
            ) : (
              <View className="w-52 aspect-square bg-gray-300 rounded-full self-center justify-center" />
            )}
            {/* Username display */}
            <Text className="text-xl font-bold text-center mt-4 mb-2">
              {username}
            </Text>
          </>
        )}
      </View>
    );
  };
  
  return (
    <FlatList
      data={posts || []}
      contentContainerStyle={{ gap: 10 }}
      ListHeaderComponent={profileHeader}
      renderItem={({ item }) => <PostListItem post={item} />}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      className="p-3"
    />
  );
}