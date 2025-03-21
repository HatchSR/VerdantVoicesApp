import { Text, View,Image,FlatList } from "react-native";
import posts from '~/assets/data/posts.json'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import PostListItem from '~/app/components/Postlistitem'

const post1 = posts[0]

export default function Feedscreen() {
  return (
    // returns a static list of post items found in the posts.json file
    // <View>
    //     <PostListItem post = {posts[3]}/>
    //     <PostListItem post = {posts[1]}/>
    // </View>

    <FlatList 
        data={posts} 
        contentContainerStyle= {{gap:10}}
        renderItem={({item}) => <PostListItem post={item} />}
        showsVerticalScrollIndicator={false}
         />

  );
}
