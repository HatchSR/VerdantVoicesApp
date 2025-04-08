import { Text, View, useWindowDimensions } from "react-native";
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
    <View className="bg-white rounded-xl overflow-hidden shadow-md">
        {/* Image with overlay */}
        <View className="relative">
            <AdvancedImage cldImg={image} className="w-full aspect-square" />
            
            {/* User info overlay at bottom of image */}
            <View className="absolute bottom-0 left-0 right-0 ">
              <View style={{ backgroundColor: 'rgba(114, 106, 54,0.5)' }} className=" p-3">
                    <View className="flex-row items-center gap-2">
                      <AdvancedImage cldImg={avatar} className="w-8 h-8 rounded-full" />

                      <View>
                          <Text className="font-semibold text-white">{post.user.username || 'New user'}</Text>
                      </View>
                    </View>
                    
                    {/* Location */}
                    <View className="flex-row items-center gap-2 px-4 py-3">

                      <Ionicons name="location-outline" size={18} color="white" />

                      <Text className="text-white font-medium">
                          {post.caption && post.caption.includes('Plant found at') ? post.caption : 
                          post.lat && post.long ? `Plant found at (${post.lat}, ${post.long})` : 
                          'Plant found at Fish Creek Park'}
                      </Text>

                    </View>
              </View>

 
                
            </View>

        </View>
        

    </View>
  );
}