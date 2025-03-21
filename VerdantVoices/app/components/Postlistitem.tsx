import { Text, View,Image } from "react-native";
import posts from '~/assets/data/posts.json'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'



export default function PostlistItem({post}) {

  return (
    <View className="bg-white">
        {/*Header*/}
        <View className="p-3 flex-row items-center gap-2">
            <Image source={{uri: post.user.image_url}} className="w-12 aspect-square rounded-full" />
            <Text className="font-semibold">{post.user.username}</Text>
        </View>
      <Image source={{uri: post.image_url}} className="'w-full aspect-square" />
      <View className="flex-row gap-3 p-3">
        {/*footer*/}
        <AntDesign name="hearto" size={24}/>
        <Ionicons name="chatbubble-outline" size={24}/>
        <Feather name="send" size={24}/>
        <Feather name="bookmark" size={24} className="ml-auto"/>
        </View>
    </View>

  );
}
