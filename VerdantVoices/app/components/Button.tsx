import React from 'react';
import { View, Pressable, Text } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
}

export default function Button({title, onPress, disabled = false, children}: ButtonProps) {
    return (
        <View className="mt-auto w-full">
            <Pressable 
                onPress={onPress} 
                disabled={disabled}
                className={`w-full items-center py-3 rounded-lg ${disabled ? 'bg-gray-400' : 'bg-blue-400'}`}
            >
                {children ? (
                    children
                ) : (
                    <Text className={`font-semibold ${disabled ? 'text-gray-200' : 'text-white'}`}>
                        {title}
                    </Text>
                )}
            </Pressable>
        </View>
    );
}