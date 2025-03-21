import { View, Text, Pressable } from "react-native";

type ButtonProps = {
    title: string, 
    onPress?: () => void
}

export default function Button({title, onPress}: ButtonProps) {
    return (
            <View className="mt-auto w-full">
            <Pressable onPress={onPress} className="bg-blue-400 w-full items-center py-3 rounded-lg">
                <Text className="text-white font-semibold">{title}</Text>
            </Pressable>
            </View>
    )
    
}