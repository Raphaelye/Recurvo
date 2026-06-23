import { colors } from "@/constants/theme";
import { computeSubscriptionHealth } from "@/utils/subscriptionHealth";
import React, { useState } from "react";
import {
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HealthMapProps {
  subscriptions: Subscription[];
}

const USAGE_FREQUENCY_POSITIONS: Record<string, number> = {
  never: 1,
  rarely: 2,
  monthly: 3,
  weekly: 4,
  daily: 5,
};

const getHealthColor = (healthScore: number): string => {
  if (healthScore >= 80) return "#10B981"; // green
  if (healthScore >= 50) return "#F59E0B"; // yellow
  return "#EF4444"; // red
};

const HealthMap: React.FC<HealthMapProps> = ({ subscriptions }) => {
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 32; // padding
  const chartHeight = 300;
  const padding = 40;

  // Calculate layout dimensions
  const plotWidth = chartWidth - padding * 2;
  const plotHeight = chartHeight - padding * 2;

  const subscriptionsWithHealth = subscriptions
    .filter((sub) => sub.status === "active")
    .map((sub) => ({
      sub,
      health: computeSubscriptionHealth(sub),
    }));

  const maxPrice = Math.max(
    ...subscriptionsWithHealth.map((s) => s.sub.price),
    100,
  );

  const getX = (frequency: string | undefined): number => {
    const pos = USAGE_FREQUENCY_POSITIONS[frequency || "monthly"] || 3;
    return padding + ((pos - 1) / 4) * plotWidth;
  };

  const getY = (price: number): number => {
    return chartHeight - padding - (price / maxPrice) * plotHeight;
  };

  const bubbleSize = (price: number): number => {
    return Math.max(20, Math.min(60, (price / maxPrice) * 60));
  };

  return (
    <>
      <View className="px-4 mb-6">
        <Text className="text-sm font-sans-semibold text-muted uppercase tracking-wider mb-3">
          Health Map
        </Text>
        <View className="card-glass rounded-lg p-2 overflow-hidden">
          {/* Chart Container */}
          <View
            style={{
              width: chartWidth,
              height: chartHeight,
              backgroundColor: "rgba(255,255,255,0.02)",
              borderRadius: 8,
              position: "relative",
            }}
          >
            {/* Y-axis label */}
            <Text
              style={{
                position: "absolute",
                left: 4,
                top: 8,
                fontSize: 10,
                color: colors.muted,
              }}
            >
              Cost
            </Text>

            {/* Bubbles */}
            {subscriptionsWithHealth.map(({ sub, health }) => {
              const x = getX(sub.usageFrequency);
              const y = getY(sub.price);
              const size = bubbleSize(sub.price);
              const bubbleColor = getHealthColor(health.healthScore);

              return (
                <Pressable
                  key={sub.id}
                  onPress={() => setSelectedSub(sub)}
                  style={{
                    position: "absolute",
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: bubbleColor,
                    opacity: 0.7,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 8,
                      fontWeight: "600",
                      color: "#fff",
                      textAlign: "center",
                      paddingHorizontal: 2,
                    }}
                    numberOfLines={2}
                  >
                    {sub.name.split(" ")[0]}
                  </Text>
                </Pressable>
              );
            })}

            {/* X-axis labels */}
            <View
              style={{
                position: "absolute",
                bottom: padding - 20,
                left: padding,
                width: plotWidth,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 8,
              }}
            >
              {["Never", "Rarely", "Monthly", "Weekly", "Daily"].map(
                (label) => (
                  <Text
                    key={label}
                    style={{
                      fontSize: 9,
                      color: colors.muted,
                      textAlign: "center",
                    }}
                  >
                    {label}
                  </Text>
                ),
              )}
            </View>

            {/* Legend */}
            <View
              style={{
                position: "absolute",
                bottom: 4,
                right: 8,
                flexDirection: "row",
                gap: 8,
              }}
            >
              {[
                { color: "#10B981", label: "80+" },
                { color: "#F59E0B", label: "50–79" },
                { color: "#EF4444", label: "<50" },
              ].map(({ color, label }) => (
                <View
                  key={label}
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: color,
                    }}
                  />
                  <Text style={{ fontSize: 8, color: colors.muted }}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <Text
            style={{
              fontSize: 10,
              color: colors.muted,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Tap a bubble to see details
          </Text>
        </View>
      </View>

      {/* Detail Modal */}
      <Modal
        visible={selectedSub !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedSub(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              paddingTop: 20,
              paddingBottom: insets.bottom + 20,
              paddingHorizontal: 16,
              maxHeight: "80%",
            }}
          >
            {selectedSub &&
              (() => {
                const health = computeSubscriptionHealth(selectedSub);
                return (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "600",
                          color: colors.foreground,
                        }}
                      >
                        {selectedSub.name}
                      </Text>
                      <Pressable onPress={() => setSelectedSub(null)}>
                        <Text style={{ fontSize: 24, color: colors.muted }}>
                          ✕
                        </Text>
                      </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View style={{ gap: 12 }}>
                        <HealthBreakdownRow
                          label="Health Score"
                          value={`${health.healthScore}/100`}
                          color={getHealthColor(health.healthScore)}
                        />
                        <HealthBreakdownRow
                          label="Usage"
                          value={`${health.usageScore}/100`}
                          subtext={
                            selectedSub.usageFrequency || "Not specified"
                          }
                        />
                        <HealthBreakdownRow
                          label="Value Rating"
                          value={`${health.valueScore}/100`}
                          subtext={
                            selectedSub.userRating
                              ? `${selectedSub.userRating}★`
                              : "Not rated"
                          }
                        />
                        <HealthBreakdownRow
                          label="Risk Status"
                          value={`${health.riskScore}/100`}
                          subtext={
                            health.daysUnused
                              ? `Unused ${health.daysUnused} days`
                              : "Actively used"
                          }
                        />
                        <HealthBreakdownRow
                          label="Cost Per Use"
                          value={`$${health.costPerUse.toFixed(2)}`}
                        />
                        <HealthBreakdownRow
                          label="Lifetime Spend"
                          value={`$${health.totalSpentLifetime.toFixed(2)}`}
                        />
                        <HealthBreakdownRow
                          label="Recommendation"
                          value={
                            health.recommendation.charAt(0).toUpperCase() +
                            health.recommendation.slice(1)
                          }
                          color={
                            health.recommendation === "keep"
                              ? "#10B981"
                              : health.recommendation === "review"
                                ? "#F59E0B"
                                : "#EF4444"
                          }
                        />
                      </View>
                    </ScrollView>
                  </>
                );
              })()}
          </View>
        </View>
      </Modal>
    </>
  );
};

const HealthBreakdownRow = ({
  label,
  value,
  subtext,
  color,
}: {
  label: string;
  value: string;
  subtext?: string;
  color?: string;
}) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    }}
  >
    <Text style={{ color: colors.muted, fontSize: 13 }}>{label}</Text>
    <View style={{ alignItems: "flex-end" }}>
      <Text
        style={{
          color: color || colors.foreground,
          fontSize: 14,
          fontWeight: "600",
        }}
      >
        {value}
      </Text>
      {subtext && (
        <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
          {subtext}
        </Text>
      )}
    </View>
  </View>
);

export default HealthMap;
