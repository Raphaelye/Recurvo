import { formatCurrency } from "@/lib/utils";
import React from "react";
import { ScrollView, Text, View } from "react-native";

interface PortfolioVitalsProps {
  healthScore: number;
  monthlyLeak: number;
  bestValueSub: Subscription | null;
  cutCandidateSub: Subscription | null;
}

const VitalCard = ({
  label,
  value,
  subtext,
  accentColor,
}: {
  label: string;
  value: string;
  subtext?: string;
  accentColor?: string;
}) => (
  <View className="px-2">
    <View className="card-glass rounded-lg p-4 min-w-[140]">
      <Text className="text-xs text-muted font-sans-medium mb-1">{label}</Text>
      <Text className="text-lg font-sans-bold text-foreground">{value}</Text>
      {subtext && (
        <Text className="text-xs text-muted mt-1 font-sans-light">
          {subtext}
        </Text>
      )}
    </View>
  </View>
);

const PortfolioVitalsStrip: React.FC<PortfolioVitalsProps> = ({
  healthScore,
  monthlyLeak,
  bestValueSub,
  cutCandidateSub,
}) => {
  return (
    <View className="px-4 mb-6">
      <Text className="text-sm font-sans-semibold text-muted uppercase tracking-wider mb-3">
        Portfolio Vitals
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 8 }}
        scrollEventThrottle={16}
      >
        <VitalCard
          label="Health Score"
          value={`${healthScore}/100`}
          accentColor="#10B981"
        />
        <VitalCard
          label="Monthly Leak"
          value={formatCurrency(monthlyLeak, "USD")}
          subtext="At-risk spend"
        />
        <VitalCard
          label="Best Value"
          value={bestValueSub?.name || "—"}
          subtext={
            bestValueSub ? `$${bestValueSub.price}/${bestValueSub.billing}` : ""
          }
        />
        <VitalCard
          label="Cut Candidate"
          value={cutCandidateSub?.name || "—"}
          subtext={
            cutCandidateSub
              ? `$${cutCandidateSub.price}/${cutCandidateSub.billing}`
              : ""
          }
        />
      </ScrollView>
    </View>
  );
};

export default PortfolioVitalsStrip;
