import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { formatCurrency, formatStatusLabel, formatSubscriptionDateTime } from "@/lib/utils";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const HomeSubcriptions = ({
  icon,
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
    return (
        <View className="px-4">
            <View  className="sub-card border-b border-border "> 
                <View className="sub-head">
                    <View className="img-container">
                        <Image source={icon} className="sub-icon" />
                    </View>
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
                                (renewalDate ? formatSubscriptionDateTime(renewalDate) : "Not Provided")}
                            </Text>
                        </View>
                        
                        <View className="ml-3 flex items-end justify-end">
                            <Text className="sub-price">{formatCurrency(price, currency)}</Text>
                            <Text className="sub-meta">{billing}</Text>
                        </View>
                    </View>
                    <Pressable onPress={onPress} className = "p-1 bg-border ml-2 rounded-md">
                        <Image 
                            source={icons.menu} 
                            style = {{
                                tintColor: colors.foreground,
                            }}
                            className = "h-5 w-5"
                        /> 
                    </Pressable>
                </View>

                {expanded && 
                    <View className="sub-body">
                        <View className="sub-details">
                            <View className="sub-row">
                                <View className="sub-row-copy">
                                    <Text className="sub-label">Payment Method:</Text>
                                    <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                                        {paymentMethod?.trim() || "Not Provided"}
                                    </Text>
                                </View>
                            </View>
                            <View className="sub-row">
                                <View className="sub-row-copy">
                                    <Text className="sub-label">Category:</Text>
                                    <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                                        {category?.trim() || plan?.trim() || "Not Provided"}
                                    </Text>
                                </View>
                            </View>
                            <View className="sub-row">
                                <View className="sub-row-copy">
                                    <Text className="sub-label">Start Date:</Text>
                                    <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                                        {startDate ? formatSubscriptionDateTime(startDate) : "Not Provided"}
                                    </Text>
                                </View>
                            </View>
                            <View className="sub-row">
                                <View className="sub-row-copy">
                                    <Text className="sub-label">Renewal Date:</Text>
                                    <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                                        {renewalDate ? formatSubscriptionDateTime(renewalDate) : "Not Provided"}
                                    </Text>
                                </View>
                            </View>
                            <View className="sub-row">
                                <View className="sub-row-copy">
                                    <Text className="sub-label">Status:</Text>
                                    <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                                        {status ? formatStatusLabel(status): '' }
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                }
            </View>
        </View>
    );
};

export default HomeSubcriptions;
