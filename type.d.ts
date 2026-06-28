import type { ImageSourcePropType } from "react-native";

declare global {
  interface AppTab {
    name: string;
    title: string;
    icon: ImageSourcePropType;
  }

  interface TabIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
  }

  interface Subscription {
    id: string;
    name: string;
    category?: string;
    paymentMethod?: string;
    status?: string;
    startDate?: string;
    price: number;
    currency?: string;
    billing: string;
    renewalDate?: string;
    color?: string;
  }

  interface SubscriptionCardProps extends Subscription {
    expanded: boolean;
    onPress: () => void;
    onCancelPress?: () => void;
    isCancelling?: boolean;
    menuVisible: boolean;
    setMenuVisible: (visible: boolean) => void;
  }

  interface UpcomingSubscription {
    id: string;
    name: string;
    price: number;
    currency?: string;
    daysLeft: number;
  }

  interface UpcomingSubscriptionCardProps extends Omit<
    UpcomingSubscription,
    "id"
  > {}

  interface ListHeadingProps {
    title: string;
    onPress: () => void;
  }

  interface HomeHeaderProps {
    onAddPress: () => void;
  }

  interface Onboarding {
    id: string;
    image: ImageSourcePropType;
    title: string;
    description: string;
  }

  type CreateSubscriptionModalBase = {
    visible: boolean;
    onClose: () => void;
  };

  type CreateSubscriptionModalCreate = CreateSubscriptionModalBase & {
    onAdd: (sub: Subscription) => void;
    initialValues?: never;
    onUpdate?: never;
  };

  type CreateSubscriptionModalEdit = CreateSubscriptionModalBase & {
    initialValues: Subscription | null;
    onUpdate: (sub: Subscription) => void;
    onAdd?: never;
  };

  type CreateSubscriptionModal = CreateSubscriptionModalCreate | CreateSubscriptionModalEdit;

  interface SubscriptionsStore {
    subscriptions: Subscription[];
    addSubscription: (subscription: Subscription) => void;
    deleteSubscription: (id: string) => void;
    archiveSubscription: (id: string) => void;
    cancelSubscription: (id: string) => void;
    reactivateSubscription: (id: string) => void;
    updateSubscription: (id: string, updates: Partial<Subscription>) => void;
    isSubscriptionActiveForInsights: (subscription: Subscription) => boolean;
    getSpendRelevantSubscriptions: () => Subscription[];
  }
}

export { };

