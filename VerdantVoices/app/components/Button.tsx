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
                style={[
                    { 
                      opacity: disabled ? 0.5 : 1, 
                      backgroundColor: disabled ? '#A0A0A0' : '#8F885D' // your custom grays/blues here
                    }
                  ]}
                className={`w-full items-center p-3 rounded-lg`}
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