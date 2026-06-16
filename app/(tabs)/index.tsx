import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import HomeHeader from "@/components/HomeHeader";
import HomeSubcriptions from "@/components/HomeSubcriptions";
import ListHeading from "@/components/ListHeading";
import { StyledSafeAreaView } from "@/components/StyledSafeAreaView";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import {colors} from "@/constants/theme";

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState(HOME_SUBSCRIPTIONS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  const handleAddSubscription = (newSub: Subscription) => {
    HOME_SUBSCRIPTIONS.unshift(newSub); // Mutate constant for other screens
    setSubscriptions([newSub, ...subscriptions]); // Update local state for immediate UI refresh
  };

  return (
    <>
      <StyledSafeAreaView className="flex-1 bg-background">
        <HomeHeader onAddPress={() => setIsModalVisible(true)} />
        <FlatList
          ListHeaderComponent={() => (
            <View className="px-4">
              <View className="home-balance-card">
                <Text className="home-balance-label">Total Monthly Spend</Text>
                <Text className="home-balance-amount">
                  {formatCurrency(subscriptions.reduce((total, sub) => total + sub.price, 0), "USD")}
                </Text>
              </View>

              <View className="home-stats-container">
                <View className="home-stats-card">
                  <View className="home-stats-row">
                    <View className="home-stats-icon">
                      <Image source={icons.barchart} className="w-4 h-4" style={{ tintColor: colors.accent }}/>
                    </View>
                    <Text className= "home-stats-label">ACTIVE</Text>
                  </View>

                  <Text className="home-stats-value">
                    {subscriptions.filter((sub) => sub.status === "active").length}
                  </Text>
                </View>
                <View className="home-stats-card">
                  <View className="home-stats-row">
                    <View className="home-stats-icon">
                      <Image source={icons.trend} className="w-4 h-4" style={{ tintColor: colors.accent }}/>
                    </View>
                    <Text className= "home-stats-label">AVG. COST</Text>
                  </View>

                  <Text className="home-stats-value">
                    {formatCurrency(
                      subscriptions.reduce((total, sub) => total + sub.price, 0) / subscriptions.length || 0,
                      "USD"
                    )}
                  </Text>
                </View>

              </View>

              <View className="list-head">
                <Text className="list-title">Upcoming Subscriptions</Text>
              </View>


              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="mb-2"
                ListEmptyComponent={
                  <View className="home-empty-state-container">
                    <Image source={icons.uptodate} className="home-empty-state-icon" />
                    <Text className="home-empty-state">
                      NO UPCOMING SUBSCRIPTIONS!!
                    </Text>
                  </View>
                }
              />
              <View className="h-2" />
              <ListHeading
                title="Active Subscriptions"
                onPress={() => router.push("/subscriptions")}
              />
            </View>
          )}
          data={subscriptions.filter((sub) => sub.status === "active").slice(0, 3)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HomeSubcriptions
              {...item}
              expanded={expandedSubscriptionId === item.id}
              onPress={() =>
                setExpandedSubscriptionId((currentId) =>
                  currentId === item.id ? null : item.id,
                )
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="home-empty-state-container">
              <Image source={icons.uptodate} className="home-empty-state-icon" />
              <Text className="home-empty-state">NO ACTIVE SUBSCRIPTION!!</Text>
            </View>
          }
          // ItemSeparatorComponent={() => <View className="h-2" />}
          contentContainerClassName="pb-30"
          extraData={expandedSubscriptionId}
        />
      </StyledSafeAreaView>
      <CreateSubscriptionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={handleAddSubscription}
      />
    </>
  );
}
