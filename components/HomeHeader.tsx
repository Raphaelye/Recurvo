import {  HOME_USER } from "@/constants/data";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { Image, Text, View, Pressable} from "react-native";
import { useUser } from "@clerk/expo";
// import { useRouter } from "expo-router";

const HomeHeader = ({onAddPress}: HomeHeaderProps) => {

  const { user } = useUser();
  // const router = useRouter();
  
  return (

   
      <View
        className="header-bg"
      >
        <View className="home-header">
          <View className="home-user">
            <View className="home-avatar-container">
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="home-avatar"
                />
              ) : (
                <Text className="text-2xl font-sans-bold text-background">
                  {user?.firstName?.charAt(0) || "U"}
                </Text>
              )}

            </View>
            <View className="home-user-info">
              <Text className="home-user-greeting"> Welcome back </Text>
              <Text className= "home-user-name">{user?.fullName || HOME_USER.name}</Text>
            </View>
          </View>
          <View className="home-icon-container ">
            <View> 
              <Pressable onPress = {onAddPress} className="rounded-full  p-1.5 bg-accent ">
                <Image
                  source={icons.add}
                  className="home-add-icon "
                  style={{
                    tintColor: colors.foreground,
                    width: 24,
                    height: 24,
                  }}
                />
              </Pressable>

            </View>
            <View>
              <Pressable className="rounded-full border border-border p-2 bg-secondarybg">
                <Image
                  source={icons.notification}
                  className="home-add-icon"
                  style={{
                    tintColor: colors.foreground,
                    width:18,
                    height:18,
                  }}
                />
              
              </Pressable>
              
            </View>
          </View>
        </View>
        
      </View>
    
  );
};

export default HomeHeader;
