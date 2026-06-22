import dayjs from "dayjs";

export const formatCurrency = (value: number, currency = "USD"): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
};

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not Provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid()
    ? parsedDate.format("MM/DD/YYYY")
    : "Not Provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const normalizeToMonthlyPrice = (sub: Subscription): number => {
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
};
