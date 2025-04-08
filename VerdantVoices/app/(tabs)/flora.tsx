import { Text, View, Image, FlatList, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";
import Floralistitem from "../components/FloralistItem";

export default function Feedscreen() {
    const [posts, setPosts] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []); 

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('flora')
                .select('*')
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

    return (
        <FlatList
            data={posts || []} 
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => <Floralistitem post={item} />}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#ff0000', '#00ff00', '#0000ff']}
                    tintColor={'#ff00ff'}
                />
            }
        />
    );
}
