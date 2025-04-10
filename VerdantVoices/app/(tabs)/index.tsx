import { Text, View, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";
import PostListItem from "~/app/components/Postlistitem";
import { useNavigation } from "@react-navigation/native";

export default function FeedScreen() {
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    
    useEffect(() => {
        fetchPosts();
    }, []);
    
    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*, user:profiles(*)')
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
        setRefreshing(true);
        fetchPosts();
    };
    
    const handlePostPress = (post) => {
        // console.log('user_id', post.user_id);
        // Navigate to the user profile when a post is tapped
        navigation.navigate('Profile', { userId: post.user_id });
    };
    
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity 
                onPress={() => handlePostPress(item)}
                activeOpacity={0.9}
            >
                <PostListItem post={item} />
            </TouchableOpacity>
        );
    };
    
    return (
        <FlatList
            data={posts}
            contentContainerStyle={{ gap: 10 }}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#ff0000', '#00ff00', '#0000ff']}
                    tintColor={'#ff00ff'}
                />
            }
            className="p-3"
            keyExtractor={(item) => item.id.toString()}
        />
    );
}