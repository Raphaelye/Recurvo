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

    interface SubscriptionCardProps extends Omit<Subscription, "id"> {
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

    interface UpcomingSubscriptionCardProps
        extends Omit<UpcomingSubscription, "id"> {}

        
    interface ListHeadingProps {
        title: string;
        onPress: () => void;

    }

    interface HomeHeaderProps {
        onAddPress: () => void;
    }

    interface Onboarding{
        id: string;
        image: ImageSourcePropType;
        title: string;
        description: string;
    }

    interface CreateSubscriptionModal{
        visible: boolean;
        onClose: () => void;
        onAdd: (sub: Subscription) => void;
    }
    
    interface SubscriptionsStore {
        subscriptions: Subscription[];
        addSubscription: (subscription: Subscription) => void;
    }
}

export {};