import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { Image, Text, TouchableOpacity, View } from "react-native";



const ListHeading = ({ title, onPress }: ListHeadingProps) => {
  return (
    <View className="list-head ">
      <Text className="list-title">{title}</Text>

      <TouchableOpacity onPress={onPress} className="list-action ">
        <Text className="list-action-text">View all</Text>
        <Image source={icons.rightarrow} className="list-action-icon"  style={{ tintColor: colors.accent }}/>
      </TouchableOpacity>
    </View>
  );
};

export default ListHeading;
