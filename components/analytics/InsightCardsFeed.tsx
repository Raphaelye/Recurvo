import { useSubscriptionsStore } from "@/lib/useSubscriptionsStore";
import {
    computeSubscriptionHealth,
    generateInsights,
} from "@/utils/subscriptionHealth";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface InsightCardsFeedProps {
  subscriptions: Subscription[];
}

const InsightCardsFeed: React.FC<InsightCardsFeedProps> = ({
  subscriptions,
}) => {
  const updateSubscription = useSubscriptionsStore(
    (state) => state.updateSubscription,
  );

  const insightsList = useMemo(() => {
    const healthData: Record<string, SubscriptionHealth> = {};
    subscriptions.forEach((sub) => {
      healthData[sub.id] = computeSubscriptionHealth(sub);
    });
    return generateInsights(subscriptions, healthData);
  }, [subscriptions]);

  if (insightsList.length === 0) {
    return (
      <View className="px-4 mb-6">
        <Text className="text-sm font-sans-semibold text-muted uppercase tracking-wider mb-3">
          Insights
        </Text>
        <View className="card-glass rounded-lg p-8 items-center justify-center">
          <Text className="text-center text-muted text-sm">
            Great job! No critical insights at the moment.
          </Text>
        </View>
      </View>
    );
  }

  const handleAction = (subscriptionId: string, actionType: string) => {
    // Handle action based on type
    // For now, just mark as a potential update point
    console.log(`Action ${actionType} for subscription ${subscriptionId}`);

    // Example: if canceling, could update status
    if (actionType === "cancel") {
      updateSubscription(subscriptionId, { status: "cancelled" });
    }
  };

  return (
    <View className="px-4 mb-6">
      <Text className="text-sm font-sans-semibold text-muted uppercase tracking-wider mb-3">
        Insights
      </Text>
      <ScrollView
        vertical
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        style={{ gap: 8 }}
        contentContainerStyle={{ gap: 8 }}
      >
        {insightsList.map((insight) => {
          const subscription = subscriptions.find(
            (s) => s.id === insight.subscriptionId,
          );
          if (!subscription) return null;

          return (
            <View
              key={`${insight.type}-${insight.subscriptionId}`}
              className="card-glass rounded-lg p-4"
            >
              <View className="flex-row items-start gap-3 mb-2">
                <Text style={{ fontSize: 20 }}>{insight.emoji}</Text>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-foreground text-sm">
                    {subscription.name}
                  </Text>
                  <Text className="text-muted text-xs mt-1">
                    {insight.message}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-2 mt-3">
                {insight.actions.map((action, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() =>
                      handleAction(insight.subscriptionId, action.type)
                    }
                    className={`flex-1 py-2 px-3 rounded items-center ${
                      action.type === "cancel"
                        ? "bg-destructive/20"
                        : "bg-foreground/10"
                    }`}
                  >
                    <Text
                      className={`text-xs font-sans-semibold ${
                        action.type === "cancel"
                          ? "text-destructive"
                          : "text-foreground"
                      }`}
                    >
                      {action.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default InsightCardsFeed;
