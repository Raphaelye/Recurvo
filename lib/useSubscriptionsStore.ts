import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { create } from "zustand";



export const useSubscriptionsStore = create<SubscriptionsStore>((set) => ({
  subscriptions: HOME_SUBSCRIPTIONS,
  addSubscription: (subscription) => set((state) => ({ subscriptions: [subscription, ...state.subscriptions] })),
}));
