import { Text, View,Image,FlatList } from "react-native";
import posts from '~/assets/data/posts.json'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import PostListItem from '~/app/components/Postlistitem'
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";

const post1 = posts[0]

export default function Feedscreen() {
    const [post, setPost] = useState([]);
    useEffect(() => {
        fetchposts();
    },[]);

    const fetchposts = async () => {
        let {data,error} = await supabase.from('posts').select('*,user:profiles(*)');
        if (error) {
            console.log(error);
        } 
        setPost(data);
        //console.log(data);
        
    };

  return (
    // returns a static list of post items found in the posts.json file
    // <View>
    //     <PostListItem post = {posts[3]}/>
    //     <PostListItem post = {posts[1]}/>
    // </View>

    <FlatList 
        data={post} 
        contentContainerStyle= {{gap:10}}
        renderItem={({item}) => <PostListItem post={item} />}
        showsVerticalScrollIndicator={false}
         />

  );
}
