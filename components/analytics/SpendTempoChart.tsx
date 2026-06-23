import { colors } from "@/constants/theme";
import { normalizeToMonthlyPrice } from "@/lib/utils";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { Dimensions, Text, View } from "react-native";

interface SpendTempoChartProps {
  subscriptions: Subscription[];
}

interface MonthSpendData {
  month: string;
  activeSpend: number;
  unusedSpend: number;
  unintentionalSpend: number;
  total: number;
}

const SpendTempoChart: React.FC<SpendTempoChartProps> = ({ subscriptions }) => {
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 32; // padding
  const chartHeight = 200;

  const monthlyData: MonthSpendData[] = useMemo(() => {
    const data: MonthSpendData[] = [];
    const now = dayjs();

    // Generate last 12 months of data
    for (let i = 11; i >= 0; i--) {
      const month = now.subtract(i, "month");
      const monthKey = month.format("YYYY-MM");

      let activeSpend = 0;
      let unusedSpend = 0;
      let unintentionalSpend = 0;

      subscriptions.forEach((sub) => {
        if (!sub.renewalDate || !sub.createdAt) return;

        const subStartDate = dayjs(sub.createdAt);
        const renewalDate = dayjs(sub.renewalDate);

        // Check if subscription was active during this month
        const isActiveInMonth =
          subStartDate.isBefore(month.endOf("month")) &&
          (!sub.lastUsedDate ||
            dayjs(sub.lastUsedDate).isAfter(
              month.startOf("month").subtract(1, "day"),
            ));

        if (!isActiveInMonth) return;

        const monthlyPrice = normalizeToMonthlyPrice(sub);

        // Categorize spend
        if (sub.usageFrequency === "never" || !sub.lastUsedDate) {
          unintentionalSpend += monthlyPrice;
        } else if (
          sub.lastUsedDate &&
          dayjs(sub.lastUsedDate).isBefore(month.startOf("month"))
        ) {
          unusedSpend += monthlyPrice;
        } else {
          activeSpend += monthlyPrice;
        }
      });

      data.push({
        month: month.format("MMM"),
        activeSpend,
        unusedSpend,
        unintentionalSpend,
        total: activeSpend + unusedSpend + unintentionalSpend,
      });
    }

    return data;
  }, [subscriptions]);

  const maxSpend = Math.max(...monthlyData.map((d) => d.total), 100);
  const barWidth = chartWidth / monthlyData.length;
  const plotHeight = chartHeight - 40; // Reserve space for labels

  return (
    <View className="px-4 mb-6">
      <Text className="text-sm font-sans-semibold text-muted uppercase tracking-wider mb-3">
        Spend Tempo
      </Text>
      <View className="card-glass rounded-lg p-4">
        <View
          style={{
            width: chartWidth,
            height: chartHeight,
            backgroundColor: "rgba(255,255,255,0.02)",
            borderRadius: 8,
            paddingHorizontal: 4,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              width: "100%",
              height: plotHeight,
              gap: 2,
            }}
          >
            {monthlyData.map((data, idx) => {
              const totalHeight = (data.total / maxSpend) * plotHeight;
              const activeHeight = (data.activeSpend / maxSpend) * plotHeight;
              const unusedHeight = (data.unusedSpend / maxSpend) * plotHeight;

              return (
                <View
                  key={idx}
                  style={{
                    flex: 1,
                    height: totalHeight,
                    backgroundColor: "transparent",
                    justifyContent: "flex-end",
                  }}
                >
                  {/* Red - Unintentional */}
                  {data.unintentionalSpend > 0 && (
                    <View
                      style={{
                        width: "100%",
                        height:
                          (data.unintentionalSpend / maxSpend) * plotHeight,
                        backgroundColor: "#EF4444",
                      }}
                    />
                  )}
                  {/* Yellow - Unused */}
                  {data.unusedSpend > 0 && (
                    <View
                      style={{
                        width: "100%",
                        height: unusedHeight,
                        backgroundColor: "#F59E0B",
                      }}
                    />
                  )}
                  {/* Purple - Active */}
                  {data.activeSpend > 0 && (
                    <View
                      style={{
                        width: "100%",
                        height: activeHeight,
                        backgroundColor: "#8B5CF6",
                      }}
                    />
                  )}
                </View>
              );
            })}
          </View>

          {/* Month labels */}
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              paddingHorizontal: 4,
              marginTop: 4,
            }}
          >
            {monthlyData.map((data, idx) => (
              <Text
                key={idx}
                style={{
                  flex: 1,
                  fontSize: 9,
                  color: colors.muted,
                  textAlign: "center",
                }}
              >
                {data.month}
              </Text>
            ))}
          </View>
        </View>

        {/* Legend */}
        <View style={{ marginTop: 12, gap: 8 }}>
          <LegendItem
            color="#8B5CF6"
            label="Active Usage"
            subtext="Used during month"
          />
          <LegendItem
            color="#F59E0B"
            label="Unused"
            subtext="Subscription existed but unused"
          />
          <LegendItem
            color="#EF4444"
            label="Unintentional"
            subtext="Auto-renewed without use"
          />
        </View>
      </View>
    </View>
  );
};

const LegendItem = ({
  color,
  label,
  subtext,
}: {
  color: string;
  label: string;
  subtext: string;
}) => (
  <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
    <View
      style={{
        width: 12,
        height: 12,
        backgroundColor: color,
        borderRadius: 2,
      }}
    />
    <View style={{ flex: 1 }}>
      <Text
        style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: 10, color: colors.muted }}>{subtext}</Text>
    </View>
  </View>
);

export default SpendTempoChart;
