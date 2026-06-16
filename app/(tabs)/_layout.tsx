import { tabs } from "@/constants/data";
import { colors, components } from "@/constants/theme";
import { useAuth, useUser } from "@clerk/expo";
import { BlurView } from "expo-blur";
import { Redirect, Tabs } from "expo-router";
import { usePostHog } from "posthog-react-native";
import React from "react";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabBar = components.tabBar;

const TabIcon = ({ focused, icon }: TabIconProps) => {
  return (
    <View className="tabs-pill">
      <Image
        source={icon}
        className="tabs-glyph"
        style={{
          tintColor: focused ? colors.accent : undefined,
        }}
      />
    </View>
  );
};
const TabLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const posthog = usePostHog();

  React.useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Link Clerk user data to PostHog
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress as string,
        name: user.fullName,
      });
    } 
  }, [isLoaded, isSignedIn, user, posthog]);

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, tabBar.horizontalInset),
          height: tabBar.height,
          marginHorizontal: tabBar.horizontalInset,
          borderRadius: tabBar.radius,
          borderTopWidth:0,
          elevation: 0,
          overflow: "hidden",
          backgroundColor: colors.tabbar,
        },

        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          paddingTop: 2,
        },

        tabBarIconStyle: {
          width: 50,
          height: 50,
        },

        tabBarBackground: () => (
          <BlurView
            intensity={50}
            tint="light"
            style={{
              flex: 1,
            }}
          />
        ),
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,

            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabLayout;
