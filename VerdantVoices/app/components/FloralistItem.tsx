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
    
    <View className="p-3 rounded-xl bg-slate-300">

        {/*image */}
        <AdvancedImage cldImg={image} className="'w-full aspect-square rounded-lg"  />
        
        
        {/*Information */}        
          <View className="px-3 pb-3">
            
              <Text className="font-bold text-3xl">
                {post.IndigName}
              </Text>

              <Text className="font-semibold text-2xl px-2">
                {post.ComName}
              </Text>

              <Text className="px-2 text-2xl italic"style={{color: '#8F885D'}}>
                {post.SciName}
              </Text> 

              <Text className="px-4 text-xl">
                {post.Descript}
              </Text>

          </View>
        
    </View>

  );
}
