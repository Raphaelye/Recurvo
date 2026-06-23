import { formatCurrency } from "@/lib/utils";
import { getForecastRenewal } from "@/utils/subscriptionHealth";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

interface ForecastRailProps {
  subscriptions: Subscription[];
}

const ForecastRail: React.FC<ForecastRailProps> = ({ subscriptions }) => {
  const forecast = useMemo(() => {
    return getForecastRenewal(subscriptions, 90);
  }, [subscriptions]);

  return (
    <View className="px-4 mb-6">
      <Text className="text-sm font-sans-semibold text-muted uppercase tracking-wider mb-3">
        90-Day Forecast
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16, gap: 8 }}
      >
        {forecast.length === 0 ? (
          <View className="card-glass rounded-lg p-6 min-w-[200] items-center justify-center">
            <Text className="text-muted text-sm">No renewals scheduled</Text>
          </View>
        ) : (
          forecast.map((week, idx) => (
            <ForecastWeekCard key={idx} week={week} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const ForecastWeekCard = ({
  week,
}: {
  week: {
    week: string;
    total: number;
    services: Subscription[];
    isHeavyWeek: boolean;
  };
}) => {
  const bgColor = week.isHeavyWeek ? "bg-destructive/10" : "bg-card";
  const borderColor = week.isHeavyWeek
    ? "border-destructive/30"
    : "border-border";

  return (
    <View
      className={`${bgColor} border ${borderColor} rounded-lg p-3 min-w-[160] gap-2`}
    >
      <View>
        <Text
          className="text-xs font-sans-semibold text-muted uppercase"
          numberOfLines={1}
        >
          {week.week}
        </Text>
        {week.isHeavyWeek && (
          <Text className="text-xs text-destructive font-sans-semibold mt-0.5">
            🔴 Heavy Week
          </Text>
        )}
      </View>

      <Text className="text-lg font-sans-bold text-foreground">
        {formatCurrency(week.total, "USD")}
      </Text>

      <View className="gap-1 mt-1">
        {week.services.slice(0, 3).map((service) => (
          <Text
            key={service.id}
            className="text-xs text-muted font-sans-light"
            numberOfLines={1}
          >
            • {service.name}
          </Text>
        ))}
        {week.services.length > 3 && (
          <Text className="text-xs text-muted font-sans-light">
            +{week.services.length - 3} more
          </Text>
        )}
      </View>
    </View>
  );
};

export default ForecastRail;
