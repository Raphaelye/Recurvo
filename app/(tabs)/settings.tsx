import { StyledSafeAreaView } from "@/components/StyledSafeAreaView";
import { HOME_USER } from "@/constants/data";
// import { useSubscriptionsStore } from "@/lib/useSubscriptionsStore";
import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { Alert, Image, Pressable, Text, View } from "react-native";

const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const posthog = usePostHog();
  // const archivedSubscriptions = useSubscriptionsStore((state) =>
  //   state.subscriptions.filter((subscription) => subscription.status === "archived"),
  // );

  const handleSignOut = async () => {
    try {
      await signOut();
      posthog.capture("user_signed_out");
      posthog.reset(); // Clear user identity on sign out
      router.replace("/(auth)/welcome");
    } catch (error) {
      Alert.alert("Sign out failed", "Please try again.");
      console.error("Error signing out:", error);
    }
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-background">
      <View className="px-6 pt-10">
        <Text className="text-3xl font-sans-extrabold text-foreground mb-8">
          Settings
        </Text>

        {/* Profile Card */}
        <View className="bg-card border border-border rounded-4xl p-6 mb-8 shadow-sm">
          <View className="flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-full bg-accent items-center justify-center overflow-hidden">
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="w-full h-full"
                />
              ) : (
                <Text className="text-2xl font-sans-bold text-background">
                  {user?.firstName?.charAt(0) || "U"}
                </Text>
              )}
            </View>
            <View>
              <Text className="text-xl font-sans-bold text-foreground">
                {user?.fullName || HOME_USER.name}
              </Text>
              <Text className="text-sm font-sans-medium text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress || HOME_USER.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="gap-4">
          <Pressable onPress={handleSignOut} className="auth-button">
            <Text className="auth-button-text">Sign Out</Text>
          </Pressable>
        </View>
      </View>
    </StyledSafeAreaView>
  );
};

export default Settings;
