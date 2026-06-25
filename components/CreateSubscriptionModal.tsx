import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { useSubscriptionsStore } from "@/lib/useSubscriptionsStore";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { usePostHog } from "posthog-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
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

type BillingFrequency =
  | "Weekly"
  | "Bi-weekly"
  | "Monthly"
  | "Quarterly"
  | "Semi-yearly"
  | "Yearly";

const BILLING_FREQUENCY_MAP: Record<
  BillingFrequency,
  { value: number; unit: "week" | "month" | "year" }
> = {
  Weekly: { value: 1, unit: "week" },
  "Bi-weekly": { value: 2, unit: "week" },
  Monthly: { value: 1, unit: "month" },
  Quarterly: { value: 3, unit: "month" },
  "Semi-yearly": { value: 6, unit: "month" },
  Yearly: { value: 1, unit: "year" },
};

const calculateRenewalDate = (frequency: BillingFrequency) => {
  const config = BILLING_FREQUENCY_MAP[frequency];
  return dayjs().add(config.value, config.unit).toISOString();
};

const FREQUENCY_OPTIONS: BillingFrequency[] = [
  "Weekly",
  "Bi-weekly",
  "Monthly",
  "Quarterly",
  "Semi-yearly",
  "Yearly",
];

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onAdd,
}: CreateSubscriptionModal) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [frequency, setFrequency] = useState<BillingFrequency>("Monthly");
  const [category, setCategory] = useState("Entertainment");
  const posthog = usePostHog();

  const resetForm = () => {
    setName("");
    setPrice("");
    setPaymentMethod("");
    setFrequency("Monthly");
    setCategory("Entertainment");
  };

  const generateId = () =>
    `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  const handleSubmit = () => {
    const numericPrice = parseFloat(price);
    
    if (
      !name.trim() ||
      isNaN(numericPrice) ||
      numericPrice <= 0 ||
      !paymentMethod.trim()
    )
      return;

    const existing = useSubscriptionsStore
      .getState()
      .subscriptions.some((sub) => sub.name.trim().toLowerCase() === name.trim().toLowerCase()
    );

    const submit = () => {
      const startDate = dayjs().toISOString();
      const renewalDate = calculateRenewalDate(frequency);

      const newSub: Subscription = {
        id: generateId(),
        name,
        price: numericPrice,
        billing: frequency,
        paymentMethod,
        category,
        status: "active",
        startDate,
        renewalDate,
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
      handleClose();
    };

    if (existing) {
      Alert.alert(
        "Duplicate subscription",
        `${name.trim()} already exists. Do you want to add it anyway?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Continue",
            onPress: submit,
          },
        ],
      );
      return;
    }

    submit();
  };

  const isValid =
    name.trim().length > 0 &&
    parseFloat(price) > 0 &&
    paymentMethod.trim().length > 0;

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
          onPress={handleClose}
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
            <ScrollView
              contentContainerClassName="modal-body pb-35"
              showsVerticalScrollIndicator={false}
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
                <View className="flex-row flex-1 items-center justify-between gap-5">
                  <TextInput
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="rgba(142, 142, 147, 0.7)"
                    className="auth-input flex-[0.8]"
                  />
                  <Text className="flex-[0.2] text-lg text-foreground font-sans-bold ">
                    USD $
                  </Text>
                </View>
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
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="category-scroll"
                >
                  {FREQUENCY_OPTIONS.map((opt) => (
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
                </ScrollView>
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
                <Text
                  className={clsx(
                    "auth-button-text",
                    !isValid && "auth-button-text-disabled",
                  )}
                >
                  Add Subscription
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

export default CreateSubscriptionModal;
