import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import {formatCurrency,  formatSubscriptionDateTime,} from "@/lib/utils";
import { BlurView } from "expo-blur";
import { useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    Text,
    View,
} from "react-native";

const logoDev = process.env.EXPO_PUBLIC_LOGO_DEV_PUBLIC_KEY;

const HomeSubcriptions = ({
    name,
    billing,
    price,
    currency,
    startDate,
    category,
    renewalDate,
    plan,
    expanded,
    status,
    paymentMethod,
    onPress,
}: SubscriptionCardProps) => {
    const [menuVisible, setMenuVisible] = useState(false);

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
                                    {category?.trim() ||
                                        plan?.trim() ||
                                        (renewalDate
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
                            onPress={() => setMenuVisible(true)}
                            className="p-1 bg-border ml-2 rounded-md"
                            accessibilityLabel={`menu-${name}`}
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
                        <View className="sub-body">
                            <Text> Sub details </Text>
                        </View>
                    )}
                </View>
            </View>

            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <BlurView
                    intensity={80}
                    tint="dark"
                    style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundAttachment:"rgba(225, 225, 225, 0.06)" }}
                >
                    <View className="sub-body">
                        <View className="sub-row">
                            <View className="flex items-center justify-start">
                                <Pressable className="icon-container"> 
                                    <Image 
                                        source= {icons.archive}
                                        className="w-4 h-4"
                                        style={{tintColor: colors.foreground}}  
                                    />
                                </Pressable>
                            </View>
                            <View className="flex-row gap-2 items-center justify-end">
                                <Pressable className="icon-container"> 
                                    <Image
                                        source= {icons.edit}
                                        className="w-4 h-4"
                                        style={{tintColor: colors.foreground}}
                                    />
                                </Pressable>
                                <Pressable className="icon-container"> 
                                    <Image
                                        source= {icons.bin}
                                        className="w-4 h-4"
                                        style={{tintColor: colors.foreground}}

                                    />
                                </Pressable>
                            </View>
                        </View>
                        <View className="flex-row items-center justify-center gap-3 mt-4">
                            <Image 
                                source={icons.spotifypotify} 
                                className="w-18 h-18"

                            />
                            <View className="flex gap-1  justify-center">
                                <Text className=" text-4xl text-foreground font-sans-bold">Activity</Text>
                                <Text className="text-xl text-muted ">$20.00 / Monthly </Text>
                            </View>
                        </View>
                    </View>
                </BlurView>
            </Modal>
        </>
    );
};

export default HomeSubcriptions;
