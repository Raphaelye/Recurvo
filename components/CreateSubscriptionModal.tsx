import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { usePostHog } from "posthog-react-native";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onAdd,
}: CreateSubscriptionModal) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [category, setCategory] = useState("Entertainment");
  const posthog = usePostHog();

  const handleSubmit = () => {
    const numericPrice = parseFloat(price);
    if (!name.trim() || isNaN(numericPrice) || numericPrice <= 0) return;

    const startDate = dayjs().toISOString();
    const renewalDate = dayjs().add(1, frequency === "Monthly" ? "month" : "year").toISOString();

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      name,
      price: numericPrice,
      billing: frequency,
      paymentMethod,
      category,
      status: "active",
      startDate,
      renewalDate,
      icon: icons.wallet,
      currency: "USD",
    };

    // Track subscription creation event
    posthog.capture("subscription_created", {
      subscription_name: name,
      subscription_price: numericPrice,
      billing_frequency: frequency,
      payment_method: paymentMethod,
      category: category,
      currency: "USD",
    });

    onAdd(newSub);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setPaymentMethod("");
    setFrequency("Monthly");
    setCategory("Entertainment");
  };

  const isValid = name.trim().length > 0 && parseFloat(price) > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="modal-overlay justify-end">
        <TouchableOpacity
          className="flex-1"
          onPress={onClose}
          activeOpacity={1}
        />
        <View className="modal-container">
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <TouchableOpacity onPress={onClose} className="modal-close">
              <Image
                className="modal-close-text home-add-icon"
                style={{
                  width: 18,
                  height: 18,
                  tintColor: colors.foreground,
                }}
                source={icons.close}
              />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView contentContainerClassName="modal-body pb-35"
              showsVerticalScrollIndicator= {false}
            >
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Netflix, Spotify, etc."
                  placeholderTextColor="rgba(142, 142, 147, 0.7)"
                  className="auth-input"
                />
              </View>
              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="rgba(142, 142, 147, 0.7)"
                  className="auth-input"
                />
              </View>
              <View className="auth-field">
                <Text className="auth-label">Payment Method</Text>
                <TextInput
                  value={paymentMethod}
                  onChangeText={setPaymentMethod}
                  placeholder="Gray Visa Card"
                  placeholderTextColor="rgba(142, 142, 147, 0.7)"
                  className="auth-input"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {(["Monthly", "Yearly"] as const).map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setFrequency(opt)}
                      className={clsx(
                        "picker-option",
                        frequency === opt && "picker-option-active",
                      )}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          frequency === opt && "picker-option-text-active",
                        )}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="category-scroll"
                >
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={clsx(
                        "category-chip",
                        category === cat && "category-chip-active",
                      )}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          category === cat && "category-chip-text-active",
                        )}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isValid}
                className={clsx(
                  "auth-button mt-4",
                  !isValid && "auth-button-disabled",
                )}
              >
                <Text className="auth-button-text">Add Subscription</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

export default CreateSubscriptionModal;
