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



export default function FloralistItem({post}) {
    const image = cld.image(post.image);
    //const {width} = 411
    image
    .resize(thumbnail().width(411).height(411)) 

    
  return (
    
    <View className="bg-white">

        {/*content */}
        <AdvancedImage cldImg={image} className="'w-full aspect-square"  />
      {/* <Image source={{uri: post.image_url}} className="'w-full aspect-square" /> */}
      <View className="flex-row gap-3 p-3">
        {/*footer*/}


        </View>
                {/* Caption */}
                {post.SciName && (
          <View className="px-3 pb-3">
            <Text>
              {' '}{post.SciName}{'\n'}
              {' '}{post.IndigName}{'\n'}
              {' '}{post.ComName}{'\n'}
              {' '}{post.Descript}{'\n'}
            </Text>
          </View>
        )}
    </View>

  );
}
