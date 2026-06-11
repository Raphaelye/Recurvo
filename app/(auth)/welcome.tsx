import OnboardingItem from "@/components/OnboardingItem";
import { StyledSafeAreaView } from "@/components/StyledSafeAreaView";
import { ONBOARDING_DATA } from "@/constants/data";
import { icons } from "@/constants/icons";
import { image } from "@/constants/images";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, FlatList, Image, Pressable, Text, View } from "react-native";

export default function WelcomePage() {
  
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const flatListRef = useRef<FlatList>(null);
  
  const scrollx = useRef(new Animated.Value(0)).current;
  
  

  const viewableItemsChangedConfig = useRef(({viewableItems}: any) => {
    setActiveIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;
  
  if (!isLoaded) return null;
  if (isSignedIn) return router.push("/(tabs)"); 

  return (
    <View className="flex-1 bg-black">
        {/* Background Decorative Pattern */}

      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_DATA}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={viewableItemsChangedConfig}
          scrollEventThrottle={16}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollx}}}], 
          {  useNativeDriver: false}
          )}
          viewabilityConfig={viewabilityConfig}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OnboardingItem  {...item} />
          )}
        />

      </View>
      {/* Pagination Indicators */}

      <View className='px-5 absolute bottom-0 w-full'>

        <View className="flex-row justify-start gap-2 my-4 items-center">
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index.toString()}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-5 bg-accent" : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </View>

        <View className=" items-start mb-4 gap-3">
          <Text className="text-6xl font-sans-extrabold text-foreground text-left leading-5">
            {ONBOARDING_DATA[activeIndex].title}
          </Text>
          <Text className="text-base font-sans-bold text-left  text-muted">
            {ONBOARDING_DATA[activeIndex].description}
          </Text>
        </View>
        
        {/* Call to Action Buttons */}
        <View className="pb-6 pr-4 items-end">
          <Pressable className="bg-accent py-4 px-4 rounded-full" onPress={() => router.push("/sign-up")}>
            <Image source={icons.rightarrow} className="h-5 w-5" />
          </Pressable>
          
        </View>
      </View>
    </View>
  
  
  );
}