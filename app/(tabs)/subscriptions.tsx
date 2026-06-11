import HomeSubcriptions from "@/components/HomeSubcriptions";
import { StyledSafeAreaView } from "@/components/StyledSafeAreaView";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  const filteredSubscriptions = HOME_SUBSCRIPTIONS.filter((sub) => {
    return (
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.plan?.toLowerCase().includes(searchQuery.toLowerCase()) 
      
    );
  });

  return (
    <StyledSafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View className="px-4 pt-5 pb-4">
          <Text className="text-3xl font-sans-extrabold text-foreground mb-6">
            All Subscriptions
          </Text>

          <View className="bg-card border border-border h-14 rounded-3xl px-4 justify-center shadow-sm">
            <TextInput
              placeholder="Search subscriptions..."
              placeholderTextColor="rgba(142, 142, 147, 0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              className="text-base font-sans-medium text-foreground"
            />
          </View>
        </View>

        <FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HomeSubcriptions
              {...item}
              expanded={expandedSubscriptionId === item.id}
              onPress={() =>
                setExpandedSubscriptionId((currentId) =>
                  currentId === item.id ? null : item.id,
                )
              }
            />
          )}
          contentContainerClassName=" pb-32 pt-1"
          ItemSeparatorComponent={() => <View className="h-4" />}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View className=" flex items-center justify-center ">
              <Image
                source={icons.notfound}
                className="h-60 w-60 opacity-40 mt-10"
              />
              <Text className="text-lg font-sans-semibold text-muted opacity-50">
                No Subscriptions Found
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default Subscriptions;
