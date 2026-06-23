import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { create } from "zustand";

export const useSubscriptionsStore = create<SubscriptionsStore>((set) => ({
  subscriptions: HOME_SUBSCRIPTIONS,
  addSubscription: (subscription) =>
    set((state) => ({ subscriptions: [subscription, ...state.subscriptions] })),
  updateSubscription: (id, updates) =>
    set((state) => ({
      subscriptions: state.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, ...updates } : sub,
      ),
    })),
}));
