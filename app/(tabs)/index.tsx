import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import HomeHeader from "@/components/HomeHeader";
import HomeSubcriptions from "@/components/HomeSubcriptions";
import ListHeading from "@/components/ListHeading";
import { StyledSafeAreaView } from "@/components/StyledSafeAreaView";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { useSubscriptionsStore } from "@/lib/useSubscriptionsStore";
import { formatCurrency, normalizeToMonthlyPrice } from "@/lib/utils";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const subscriptions = useSubscriptionsStore((state) => state.subscriptions);
  const addSubscription = useSubscriptionsStore(
    (state) => state.addSubscription,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  const upcomingSubscriptions: UpcomingSubscription[] = subscriptions
    .filter((sub) => sub.renewalDate && sub.status === "active")
    .map((sub) => ({
      id: sub.id,
      name: sub.name,
      price: sub.price,
      currency: sub.currency || "USD",
      daysLeft: Math.max(0, dayjs(sub.renewalDate!).diff(dayjs(), "day")),
    }))
    .filter((u) => u.daysLeft < 5);

  return (
    <>
      <StyledSafeAreaView className="flex-1 pb-10 bg-background">
        <HomeHeader onAddPress={() => setIsModalVisible(true)} />
        <FlatList
          extraData={subscriptions}
          ListHeaderComponent={() => (
            <View className="px-4 mt-4">
              <View className="home-balance-card">
                <Text className="home-balance-label">Total Spend</Text>
                <Text className="home-balance-amount">
                  {formatCurrency(
                    subscriptions.reduce((total, sub) => total + sub.price, 0), "USD"
                  )}
                </Text>
              </View>

              <View className="home-stats-container">
                <View className="home-stats-card">
                  <View className="home-stats-row">
                    <View className="home-stats-icon">
                      <Image
                        source={icons.barchart}
                        className="w-4 h-4"
                        style={{ tintColor: colors.accent }}
                      />
                    </View>
                    <Text className="home-stats-label">ACTIVE</Text>
                  </View>

                  <Text className="home-stats-value">
                    {
                      subscriptions.filter((sub) => sub.status === "active")
                        .length
                    }
                  </Text>
                </View>
                <View className="home-stats-card">
                  <View className="home-stats-row">
                    <View className="home-stats-icon">
                      <Image
                        source={icons.trend}
                        className="w-4 h-4"
                        style={{ tintColor: colors.accent }}
                      />
                    </View>
                    <Text className="home-stats-label">AVG. COST</Text>
                  </View>

                  <Text className="home-stats-value">
                    {formatCurrency(
                      subscriptions.reduce(
                        (total, sub) => total + normalizeToMonthlyPrice(sub),
                        0,
                      ) / subscriptions.length || 0,
                      "USD",
                    )}
                  </Text>
                </View>
              </View>

              <View className="list-head">
                <Text className="list-title ">Upcoming Subscriptions</Text>
              </View>

              <FlatList
                data={upcomingSubscriptions}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="mb-2"
                ListEmptyComponent={
                  <View className="home-empty-state-container">
                    <Image
                      source={icons.uptodate}
                      className="home-empty-state-icon"
                    />
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
          data={subscriptions
            .filter((sub) => sub.status === "active")
            .slice(0, 3)}
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
              <Image
                source={icons.uptodate}
                className="home-empty-state-icon"
              />
              <Text className="home-empty-state">NO ACTIVE SUBSCRIPTION!!</Text>
            </View>
          }
          contentContainerClassName="pb-30"
        />
      </StyledSafeAreaView>
      <CreateSubscriptionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={addSubscription}
      />
    </>
  );
}
