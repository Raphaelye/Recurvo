import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { useSubscriptionsStore } from "@/lib/useSubscriptionsStore";
import { formatCurrency, formatStatusLabel, formatSubscriptionDateTime, } from "@/lib/utils";
import { useState } from "react";
import {
    Alert,
    Image,

    Modal,

    Pressable,
    Text,
    View,
} from "react-native";


const HomeSubcriptions = ({
    id,
    name,
    billing,
    price,
    currency,
    startDate,
    category,
    renewalDate,
    expanded,
    status,
    paymentMethod,
    onPress,
    menuVisible,
    setMenuVisible
}: SubscriptionCardProps) => {
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
    const deleteSubscription = useSubscriptionsStore((state) => state.deleteSubscription);
    const archiveSubscription = useSubscriptionsStore((state) => state.archiveSubscription);
    const cancelSubscription = useSubscriptionsStore((state) => state.cancelSubscription);
    const reactivateSubscription = useSubscriptionsStore((state) => state.reactivateSubscription);
    const updateSubscription = useSubscriptionsStore((state) => state.updateSubscription);

    const logoDev = process.env.EXPO_PUBLIC_LOGO_DEV_PUBLIC_KEY;

    const closeDetails = () => setMenuVisible(false);

    const confirmAction = (title: string, message: string, onConfirm: () => void) => {
        Alert.alert(title, message, [
            { text: "Cancel", style: "cancel" },
            { text: "Continue", style: "destructive", onPress: onConfirm },
        ]);
    };

    const handleArchive = () => {
        confirmAction(
            "Archive subscription",
            `Archive ${name}? It will be moved to your settings screen.`,
            () => {
                archiveSubscription(id);
                closeDetails();
            },
        );
    };

    const handleDelete = () => {
        confirmAction(
            "Delete subscription",
            `Delete ${name} permanently?`,
            () => {
                deleteSubscription(id);
                closeDetails();
            },
        );
    };

    const handleCancel = () => {
        confirmAction(
            "Cancel subscription",
            `Cancel ${name}? It will stay in your list but stop contributing to active spend.`,
            () => {
                cancelSubscription(id);
                closeDetails();
            },
        );
    };

    const handleReactivate = () => {
        confirmAction(
            "Reactivate subscription",
            `Reactivate ${name}?`,
            () => {
                reactivateSubscription(id);
                closeDetails();
            },
        );
    };

    const handleEdit = () => {
        setEditingSubscription({
            id,
            name,
            category,
            paymentMethod,
            status,
            startDate,
            price,
            currency,
            billing,
            renewalDate,
        });
        setEditModalVisible(true);
        closeDetails();
    };

    const handleUpdate = (updatedSubscription: Subscription) => {
        updateSubscription(updatedSubscription.id, updatedSubscription);
        setEditModalVisible(false);
        setEditingSubscription(null);
    };



    return (
        <>
            <View className="px-4">
                <View className="sub-card border-b border-border ">
                    <View className="sub-head">
                        <Image
                            source={{
                                uri: `https://img.logo.dev/name/${name}?token=${logoDev}`,
                            }}
                            className="sub-icon"
                        />

                        <View className="sub-main">
                            <View>
                                <Text
                                    className="sub-text-head"
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {name}
                                </Text>
                                <Text className="sub-meta">
                                    {category?.trim() || (renewalDate
                                            ? formatSubscriptionDateTime(renewalDate)
                                            : "Not Provided")}
                                </Text>
                            </View>

                            <View className="ml-3 flex items-end justify-end">
                                <Text className="sub-price">
                                    {formatCurrency(price, currency)}
                                </Text>
                                <Text className="sub-meta">{billing}</Text>
                            </View>
                        </View>
                        <Pressable
                            onPress={onPress}
                            className="p-2 ml-2 rounded-md"
                        >
                            <Image
                                source={icons.menu}
                                style={{
                                    tintColor: colors.foreground,
                                }}
                                className="h-5 w-5"
                            />
                        </Pressable>
                    </View>

                    {expanded && (
                        <Modal
                            visible={menuVisible}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setMenuVisible(false)}
                        >
                            <View
                                
                                style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor:"rgb(0, 0, 0)" }}
                            >
                                <View className="sub-body">
                                    <View className="sub-row">
                                        <View className="flex items-center justify-start">
                                            <Pressable className="icon-container" onPress={handleArchive}> 
                                                <Image 
                                                    source= {icons.archive}
                                                    className="w-4 h-4"
                                                    style={{tintColor: colors.foreground}}  
                                                />
                                            </Pressable>
                                        </View>
                                        <View className="flex-row gap-2 items-center justify-end">
                                            <Pressable className="icon-container" onPress={handleEdit}> 
                                                <Image
                                                    source= {icons.edit}
                                                    className="w-4 h-4"
                                                    style={{tintColor: colors.foreground}}
                                                />
                                            </Pressable>
                                            <Pressable className="icon-container" onPress={handleDelete}> 
                                                <Image
                                                    source= {icons.bin}
                                                    className="w-4 h-4"
                                                    style={{tintColor: "#dc2626"}}

                                                />
                                            </Pressable>
                                        </View>
                                    </View>
                                    <View className="flex-row flex px-14 items-center justify-center gap-3 mt-5">
                                        <Image 
                                            source={{uri: `https://img.logo.dev/name/${name}?token=${logoDev}`}} 
                                            className="w-15 h-15 rounded-xl"
                                            

                                        />
                                        <View className="flex gap-1 justify-center">
                                            <Text className=" text-3xl text-foreground font-sans-bold  " numberOfLines={1} ellipsizeMode="tail">{name}</Text>
                                            <Text className="text-lg text-muted ">{formatCurrency(price, currency)} / {billing} </Text>
                                        </View>


                                    </View>

                                    <View className="flex-row items-center gap-3 my-6">
                                        <View>
                                            <Image source={icons.calendar}
                                                className="w-5 h-5"
                                                style={{tintColor: colors.foreground}}
                                            />
                                        </View>
                                        <View>
                                            <Text className="text-sm text-muted font-sans-semibold">Next Renewal</Text>
                                            
                                            <Text
                                                className="text-lg text-accent font-sans-bold"
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >
                                            {renewalDate
                                                ? formatSubscriptionDateTime(renewalDate)
                                                : "Not Provided"}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="sub-details">
                                        <View className="sub-details-row">
                                            <View>
                                                <Text className="sub-label">Category</Text> 
                                            </View>
                                            <View>
                                                <Text
                                                    className="sub-value"
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                >
                                                    {category?.trim()  || "Not Provided"}
                                                </Text> 
                                            </View>
                                        </View>

                                        <View className="sub-details-row">
                                            <View>
                                                <Text className="sub-label">Start Date</Text> 
                                            </View>
                                            <View>
                                                <Text
                                                className="sub-value"
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                                >
                                                {startDate
                                                    ? formatSubscriptionDateTime(startDate)
                                                    : "Not Provided"}
                                                </Text> 
                                            </View>
                                        </View>

                                        <View className="sub-details-row">
                                            <View>
                                                <Text className="sub-label">Payment Method</Text> 
                                            </View>
                                            <View>
                                                <Text
                                                    className="sub-value"
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                >
                                                    {paymentMethod || "Not Provided"}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="sub-details-row">
                                            <View>
                                                <Text className="sub-label">Status</Text> 
                                            </View>
                                            <View>
                                                <Text
                                                    className="sub-value"
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                >
                                                    {status ? formatStatusLabel(status) : ""}
                                                </Text> 
                                            </View>
                                        </View>

                                    </View>

                                    <Pressable className='p-2 bg-accent rounded-lg mx-3 mt-6 items-center justify-center'
                                        android_ripple={{ color: 'rgba(255,255,255,0.5)' }}
                                        style={({ pressed }) => [
                                            { opacity: pressed ? 0.75 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
                                        ]}
                                        onPress={status === "cancelled" ? handleReactivate : handleCancel}
                                    >
                                        <Text className='auth-button-text'>
                                            {status === "cancelled" ? "Reactivate Subscription" : "Cancel Subscription"}
                                        </Text>
                                    </Pressable>
                                    <Pressable onPress={()=> setMenuVisible(false)}
                                        className='p-2 mx-3 bg-card rounded-lg border border-border mt-2 items-center justify-center'
                                        android_ripple={{ color: 'rgba(255,255,255,0.5)' }}
                                        style={({ pressed }) => [
                                            { opacity: pressed ? 0.75 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
                                        ]}
                                    >
                                        <Text className='auth-button-text'>Close</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>
                    )}
                </View>
            </View>

            <CreateSubscriptionModal
                visible={editModalVisible}
                onClose={() => {
                    setEditModalVisible(false);
                    setEditingSubscription(null);
                }}
                onAdd={() => {}}
                initialValues={editingSubscription}
                onUpdate={handleUpdate}
            />
        </>
    );
};

export default HomeSubcriptions;
