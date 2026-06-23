import ForecastRail from "@/components/analytics/ForecastRail";
import HealthMap from "@/components/analytics/HealthMap";
import InsightCardsFeed from "@/components/analytics/InsightCardsFeed";
import PortfolioVitalsStrip from "@/components/analytics/PortfolioVitalsStrip";
import SpendTempoChart from "@/components/analytics/SpendTempoChart";
import { StyledSafeAreaView } from "@/components/StyledSafeAreaView";
import { useSubscriptionsStore } from "@/lib/useSubscriptionsStore";
import { computeSubscriptionHealth } from "@/utils/subscriptionHealth";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

const AnalyticsScreen = () => {
  const subscriptions = useSubscriptionsStore((state) => state.subscriptions);

  const analyticsData = useMemo(() => {
    const activeSubscriptions = subscriptions.filter(
      (sub) => sub.status === "active",
    );

    // Compute health for all subscriptions
    const healthDataMap: Record<string, SubscriptionHealth> = {};
    activeSubscriptions.forEach((sub) => {
      healthDataMap[sub.id] = computeSubscriptionHealth(sub);
    });

    // Portfolio Vitals
    const healthScores = Object.values(healthDataMap).map((h) => h.healthScore);
    const averageHealthScore =
      healthScores.length > 0
        ? Math.round(
            healthScores.reduce((a, b) => a + b, 0) / healthScores.length,
          )
        : 0;

    // Monthly Leak - sum of subscriptions with health < 40
    const monthlyLeak = activeSubscriptions
      .filter(
        (sub) =>
          healthDataMap[sub.id] && healthDataMap[sub.id].healthScore < 40,
      )
      .reduce((total, sub) => total + sub.price, 0);

    // Best Value - highest health score
    const bestValueSub = activeSubscriptions.reduce(
      (best, current) => {
        if (!best) return current;
        const bestHealth = healthDataMap[best.id]?.healthScore || 0;
        const currentHealth = healthDataMap[current.id]?.healthScore || 0;
        return currentHealth > bestHealth ? current : best;
      },
      null as Subscription | null,
    );

    // Cut Candidate - lowest health score
    const cutCandidateSub = activeSubscriptions.reduce(
      (worst, current) => {
        if (!worst) return current;
        const worstHealth = healthDataMap[worst.id]?.healthScore || 100;
        const currentHealth = healthDataMap[current.id]?.healthScore || 100;
        return currentHealth < worstHealth ? current : worst;
      },
      null as Subscription | null,
    );

    return {
      averageHealthScore,
      monthlyLeak,
      bestValueSub,
      cutCandidateSub,
    };
  }, [subscriptions]);

  return (
    <StyledSafeAreaView className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-3xl font-sans-extrabold text-foreground">
            Analytics
          </Text>
          <Text className="text-sm text-muted mt-1">
            Subscription Health Overview
          </Text>
        </View>

        {/* Section 1: Portfolio Vitals Strip */}
        <PortfolioVitalsStrip
          healthScore={analyticsData.averageHealthScore}
          monthlyLeak={analyticsData.monthlyLeak}
          bestValueSub={analyticsData.bestValueSub}
          cutCandidateSub={analyticsData.cutCandidateSub}
        />

        {/* Section 2: Health Map */}
        <HealthMap subscriptions={subscriptions} />

        {/* Section 3: Spend Tempo Chart */}
        <SpendTempoChart subscriptions={subscriptions} />

        {/* Section 4: Insight Cards Feed */}
        <InsightCardsFeed subscriptions={subscriptions} />

        {/* Section 5: Forecast Rail */}
        <ForecastRail subscriptions={subscriptions} />
      </ScrollView>
    </StyledSafeAreaView>
  );
};

export default AnalyticsScreen;
