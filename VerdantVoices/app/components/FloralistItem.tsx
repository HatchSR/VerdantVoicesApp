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



export default function FloralistItem({ post }) {
  const image = cld.image(post.image);
  image.resize(thumbnail().width(411).height(411));

  return (
    <View className="p-5 bg-white rounded-2xl shadow-md border border-[#e2e2e2]">

      {/*names */}
      <View className="px-2 space-y-2">
        <Text className="text-3xl font-extrabold text-[#8f885d]">
          {post.IndigName}
        </Text>

        <Text className="text-2xl font-semibold text-gray-800 pl-1">
          {post.ComName}
        </Text>

        <Text className="text-xl italic text-[#8f885d] pl-1 pb-2">
          {post.SciName}
        </Text>
      </View>
      {/* Image */}
      <AdvancedImage
        cldImg={image}
        className="w-full aspect-square rounded-xl mb-4"
      />

      {/* Info */}
      <View className="px-2 space-y-2">
        <Text className="text-base text-gray-700 p-2 leading-relaxed">
          {post.Descript}
        </Text>
      </View>
    </View>
  );
}
