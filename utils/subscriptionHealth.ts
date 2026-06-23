import dayjs from "dayjs";

const USAGE_FREQUENCY_MULTIPLIERS: Record<string, number> = {
  daily: 30,
  weekly: 4,
  monthly: 1,
  rarely: 0.25,
  never: 0.1,
};

const USAGE_FREQUENCY_SCORES: Record<string, number> = {
  daily: 100,
  weekly: 80,
  monthly: 50,
  rarely: 20,
  never: 0,
};

/**
 * Compute comprehensive health metrics for a subscription.
 * Returns a detailed health breakdown and recommendations.
 */
export function computeSubscriptionHealth(
  subscription: Subscription,
): SubscriptionHealth {
  // 1. Usage Score (0-100)
  const usageScore =
    USAGE_FREQUENCY_SCORES[subscription.usageFrequency || "monthly"] || 50;

  // 2. Value Score (0-100) - based on user rating if provided
  const valueScore = subscription.userRating
    ? subscription.userRating * 20
    : 60;

  // 3. Risk Score (0-100) - penalize for disuse
  let riskScore = 100;
  if (subscription.lastUsedDate) {
    const daysUnused = dayjs().diff(dayjs(subscription.lastUsedDate), "day");
    // Deduct 1 point per day unused, capped at -50
    riskScore = Math.max(50, 100 - Math.min(daysUnused * 0.5, 50));
  }

  // 4. Health Score - weighted average
  const healthScore = usageScore * 0.5 + valueScore * 0.3 + riskScore * 0.2;

  // 5. Cost Per Use
  const frequencyMultiplier =
    USAGE_FREQUENCY_MULTIPLIERS[subscription.usageFrequency || "monthly"] || 1;
  const costPerUse =
    frequencyMultiplier > 0
      ? subscription.price / frequencyMultiplier
      : subscription.price;

  // 6. Total Spent Lifetime
  const monthsSinceCreation = subscription.createdAt
    ? dayjs().diff(dayjs(subscription.createdAt), "month", true)
    : 0;

  // Normalize billing cycle to monthly for calculation
  const monthlyPrice = normalizeToMonthlyPrice(subscription);
  const totalSpentLifetime = monthlyPrice * Math.max(monthsSinceCreation, 0);

  // 7. Recommendation
  let recommendation: "keep" | "review" | "cancel" = "review";
  if (healthScore >= 70) {
    recommendation = "keep";
  } else if (healthScore < 40) {
    recommendation = "cancel";
  }

  const daysUnused = subscription.lastUsedDate
    ? dayjs().diff(dayjs(subscription.lastUsedDate), "day")
    : undefined;

  return {
    subscriptionId: subscription.id,
    healthScore: Math.round(healthScore),
    usageScore: Math.round(usageScore),
    valueScore: Math.round(valueScore),
    riskScore: Math.round(riskScore),
    costPerUse: Math.round(costPerUse * 100) / 100,
    totalSpentLifetime: Math.round(totalSpentLifetime * 100) / 100,
    recommendation,
    daysUnused,
  };
}

/**
 * Normalize subscription price to monthly equivalent
 */
function normalizeToMonthlyPrice(sub: Subscription): number {
  switch (sub.billing) {
    case "Weekly":
      return sub.price * 4.33;
    case "Bi-weekly":
      return sub.price * 2.17;
    case "Monthly":
      return sub.price;
    case "Quarterly":
      return sub.price / 3;
    case "Semi-yearly":
      return sub.price / 6;
    case "Yearly":
      return sub.price / 12;
    default:
      return sub.price;
  }
}

/**
 * Generate insights from subscription health data
 */
export function generateInsights(
  subscriptions: Subscription[],
  healthData: Record<string, SubscriptionHealth>,
) {
  const insights: Array<{
    type:
      | "high-cost"
      | "price-increase"
      | "overlap"
      | "long-unused"
      | "good-value";
    subscriptionId: string;
    message: string;
    emoji: string;
    actions: Array<{ label: string; type: string }>;
  }> = [];

  // 1. High cost-per-use
  subscriptions.forEach((sub) => {
    const health = healthData[sub.id];
    if (health && health.costPerUse > sub.price * 2) {
      insights.push({
        type: "high-cost",
        subscriptionId: sub.id,
        message: `${sub.name} costs $${health.costPerUse.toFixed(2)} per use. Consider downgrading.`,
        emoji: "💸",
        actions: [
          { label: "Downgrade", type: "downgrade" },
          { label: "Cancel", type: "cancel" },
        ],
      });
    }
  });

  // 2. Long unused (>30 days)
  subscriptions.forEach((sub) => {
    if (sub.lastUsedDate) {
      const daysUnused = dayjs().diff(dayjs(sub.lastUsedDate), "day");
      if (daysUnused > 30) {
        insights.push({
          type: "long-unused",
          subscriptionId: sub.id,
          message: `${sub.name} hasn't been used in ${daysUnused} days. Time to reassess?`,
          emoji: "🔁",
          actions: [
            { label: "Cancel", type: "cancel" },
            { label: "Keep", type: "keep" },
          ],
        });
      }
    }
  });

  // 3. Subscription overlap (same category)
  const categoryCounts = new Map<string, Subscription[]>();
  subscriptions.forEach((sub) => {
    const cat = sub.category || "Other";
    if (!categoryCounts.has(cat)) {
      categoryCounts.set(cat, []);
    }
    categoryCounts.get(cat)!.push(sub);
  });

  categoryCounts.forEach((subs, category) => {
    if (subs.length > 1) {
      subs.forEach((sub) => {
        const others = subs.filter((s) => s.id !== sub.id);
        insights.push({
          type: "overlap",
          subscriptionId: sub.id,
          message: `You have ${subs.length} ${category} subscriptions. Consider consolidating.`,
          emoji: "🔁",
          actions: [
            { label: "Compare", type: "compare" },
            { label: "Cancel", type: "cancel" },
          ],
        });
      });
    }
  });

  // 4. Good value (health score >= 80)
  subscriptions.forEach((sub) => {
    const health = healthData[sub.id];
    if (health && health.healthScore >= 80) {
      insights.push({
        type: "good-value",
        subscriptionId: sub.id,
        message: `${sub.name} is a great value! Keep it up.`,
        emoji: "✅",
        actions: [{ label: "Keep", type: "keep" }],
      });
    }
  });

  // Remove duplicates (e.g., same insight generated multiple times)
  const uniqueInsights = Array.from(
    new Map(
      insights.map((insight) => [
        `${insight.type}-${insight.subscriptionId}`,
        insight,
      ]),
    ).values(),
  );

  return uniqueInsights;
}

/**
 * Get forecast of renewals for the next N days
 */
export function getForecastRenewal(
  subscriptions: Subscription[],
  daysAhead: number = 90,
) {
  const forecastByWeek = new Map<
    string,
    { week: string; total: number; services: Subscription[] }
  >();

  subscriptions.forEach((sub) => {
    if (!sub.renewalDate || sub.status !== "active") return;

    let currentDate = dayjs(sub.renewalDate);
    const endDate = dayjs().add(daysAhead, "day");

    while (currentDate.isBefore(endDate)) {
      const weekStart = currentDate.startOf("week");
      const weekEnd = weekStart.add(6, "day");
      const weekKey = weekStart.format("YYYY-MM-DD");
      const weekLabel = `${weekStart.format("MMM DD")}–${weekEnd.format("DD")}`;

      if (!forecastByWeek.has(weekKey)) {
        forecastByWeek.set(weekKey, {
          week: weekLabel,
          total: 0,
          services: [],
        });
      }

      const weekData = forecastByWeek.get(weekKey)!;
      weekData.total += sub.price;
      if (!weekData.services.find((s) => s.id === sub.id)) {
        weekData.services.push(sub);
      }

      // Advance by billing cycle
      const billingCycleMap: Record<string, number> = {
        Weekly: 7,
        "Bi-weekly": 14,
        Monthly: 30,
        Quarterly: 90,
        "Semi-yearly": 180,
        Yearly: 365,
      };
      const daysToAdd = billingCycleMap[sub.billing] || 30;
      currentDate = currentDate.add(daysToAdd, "day");
    }
  });

  // Calculate average weekly spend to identify "Heavy Weeks"
  const weeklyTotals = Array.from(forecastByWeek.values()).map((w) => w.total);
  const averageWeeklySpend =
    weeklyTotals.length > 0
      ? weeklyTotals.reduce((a, b) => a + b, 0) / weeklyTotals.length
      : 0;
  const heavyWeekThreshold = averageWeeklySpend * 1.3; // 30% above average

  return Array.from(forecastByWeek.entries())
    .map(([, week]) => ({
      ...week,
      isHeavyWeek: week.total > heavyWeekThreshold,
    }))
    .sort((a, b) => a.week.localeCompare(b.week));
}
