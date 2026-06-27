import HomeSubcriptions from "@/components/HomeSubcriptions";
import { StyledSafeAreaView } from "@/components/StyledSafeAreaView";
import { icons } from "@/constants/icons";
import { useSubscriptionsStore } from "@/lib/useSubscriptionsStore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Subscriptions = () => {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Monthly");
  const subscriptions = useSubscriptionsStore((state) => state.subscriptions);

  const tabs = ["Monthly", "Yearly", "Cancelled"];

  const handleSubscriptionPress = (itemId: string) => {
    const isSameCardSelected = expandedSubscriptionId === itemId;

    setExpandedSubscriptionId(itemId);
    setMenuVisible(isSameCardSelected ? !menuVisible : true);
  };

  useEffect(() => {
    setExpandedSubscriptionId(null);
    setMenuVisible(false);
  }, [activeTab]);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    return activeTab === "Cancelled"
      ? sub.status === "cancelled"
      : sub.billing === activeTab && sub.status !== "cancelled";
  });

  return (
    <StyledSafeAreaView className="flex-1 pb-10 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View className="px-4 pt-8 pb-2">
          <Text className="text-3xl font-sans-extrabold text-foreground mb-10">
            All Subscriptions
          </Text>

          <View className="flex-row">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`flex-1 py-2 items-center rounded-md border ${
                  activeTab === tab ? "bg-accent border-accent" : "bg-card "
                }`}
              >
                <Text
                  className={`font-sans-semibold ${
                    activeTab === tab
                      ? "text-background"
                      : "text-muted-foreground"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HomeSubcriptions
              {...item}
              expanded={expandedSubscriptionId === item.id}
              onPress={() => handleSubscriptionPress(item.id)}
              menuVisible={menuVisible}
              setMenuVisible={setMenuVisible}
            />
          )}
          contentContainerClassName=" pb-32 pt-4"
          ItemSeparatorComponent={() => <View className="h-4" />}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View className=" flex items-center justify-center ">
              <Image
                source={icons.uptodate}
                className="h-50 w-50 opacity-40 mt-10"
              />
              <Text className="text-lg font-sans text-muted opacity-90">
                No {activeTab} Subscriptions.
              </Text>
              <Text className="text-sm font-sans-light px-18 mt-1 text-muted opacity-50 text-center">
                You do not have any {activeTab.toLowerCase()} subscriptions yet.
                Create one to track it here.
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default Subscriptions;
