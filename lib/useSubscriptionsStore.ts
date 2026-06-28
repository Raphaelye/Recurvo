import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { create } from "zustand";

const isSpendRelevant = (subscription: Subscription) =>
  subscription.status === "active" || !subscription.status;

export const useSubscriptionsStore = create<SubscriptionsStore>((set, get) => ({
  subscriptions: HOME_SUBSCRIPTIONS,
  addSubscription: (subscription) =>
    set((state) => ({ subscriptions: [subscription, ...state.subscriptions] })),
  deleteSubscription: (id) =>
    set((state) => ({
      subscriptions: state.subscriptions.filter(
        (subscription) => subscription.id !== id,
      ),
    })),
  archiveSubscription: (id) =>
    set((state) => ({
      subscriptions: state.subscriptions.map((subscription) =>
        subscription.id === id
          ? { ...subscription, status: "archived" }
          : subscription,
      ),
    })),
  cancelSubscription: (id) =>
    set((state) => ({
      subscriptions: state.subscriptions.map((subscription) =>
        subscription.id === id
          ? { ...subscription, status: "cancelled" }
          : subscription,
      ),
    })),
  reactivateSubscription: (id) =>
    set((state) => ({
      subscriptions: state.subscriptions.map((subscription) =>
        subscription.id === id
          ? { ...subscription, status: "active" }
          : subscription,
      ),
    })),
  updateSubscription: (id, updates) =>
    set((state) => ({
      subscriptions: state.subscriptions.map((subscription) =>
        subscription.id === id ? { ...subscription, ...updates } : subscription,
      ),
    })),
  isSubscriptionActiveForInsights: (subscription) =>
    isSpendRelevant(subscription),
  getSpendRelevantSubscriptions: () =>
    get().subscriptions.filter((subscription) => isSpendRelevant(subscription)),
}));
