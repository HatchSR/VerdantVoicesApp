import { Text, View,Image, useWindowDimensions } from "react-native";
import posts from '~/assets/data/posts.json'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { AdvancedImage } from 'cloudinary-react-native';
import { Cloudinary } from "@cloudinary/url-gen";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { cld } from "../../lib/cloudinary";



export default function PostlistItem({post}) {
    const image = cld.image(post.image);
    //const {width} = 411
    image
    .resize(thumbnail().width(411).height(411)) 
    const avatar = cld.image(post.user.avatar_url ||'NewUser_nfj5mp');
    //const {width} = 411
    avatar
    .resize(thumbnail().width(48).height(48)) 
    
  return (
    
    <View className="bg-white">
        {/*Header*/}
        <View className="p-3 flex-row items-center gap-2">
            <AdvancedImage cldImg={avatar} className="w-12 aspect-square rounded-full" />
            <Text className="font-semibold">{post.user.username || 'New user'}</Text>
        </View>

        {/*content */}
        <AdvancedImage cldImg={image} className="'w-full aspect-square"  />
      {/* <Image source={{uri: post.image_url}} className="'w-full aspect-square" /> */}
      <View className="flex-row gap-3 p-3">
        {/*footer*/}


        </View>
                {/* Caption */}
                {post.caption && (
          <View className="px-3 pb-3">
            <Text>
              <Text className="font-bold">{post.user.username || 'New user'}</Text>
              {' '}{post.caption}{'\n'}
              {'Coordinates: '}{post.lat && post.long ? ` (${post.lat}, ${post.long})` : ''}
            </Text>
          </View>
        )}
    </View>

  );
}
