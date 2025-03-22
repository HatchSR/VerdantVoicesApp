import { View,Text,TextInput } from "react-native";

export default function CustomTextInput({label, ...TextInputProps}) {
    return (
        <View>
        <Text>{label}</Text>
          <TextInput 
          {...TextInputProps}
          className="bg-gray-200 p-3 rounded-lg my-3" 
          />

          </View>
    )
}