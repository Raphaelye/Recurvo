import { StyledSafeAreaView } from "@/components/StyledSafeAreaView";
import { image } from "@/constants/images";
import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const posthog = usePostHog();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [errorsVisible, setErrorsVisible] = React.useState(false);

  // Handle error timeout
  React.useEffect(() => {
    if (errors?.fields && Object.keys(errors.fields).length > 0) {
      setErrorsVisible(true);
      const timer = setTimeout(() => {
        setErrorsVisible(false);
      }, 2000); // Errors disappear after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleSignUpNavigate = async ({
    session,
    decorateUrl,
  }: {
    session?: { currentTask?: unknown };
    decorateUrl: (path: string) => string;
  }) => {
    if (session?.currentTask) {
      if (__DEV__) console.log(session?.currentTask);
      return;
    }

    const url = decorateUrl("/");
    if (url.startsWith("http")) {
      await Linking.openURL(url);
    } else {
      router.push(url as Href);
    }
  };

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    });
    if (error) {
      if (__DEV__) console.error(JSON.stringify(error, null, 2));
      return;
    }

    try {
      await signUp.verifications.sendEmailCode();
    } catch (err) {
      if (__DEV__) {
        console.error(
          "Error sending verification code:",
          JSON.stringify(err, null, 2),
        );
      }
      console.warn("Failed to send verification code. Please try again.");
      return;
    }
  };

  const handleVerify = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({
      code,
    });
    if (error) {
      if (__DEV__) console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signUp.status === "complete") {
      posthog.capture("user_signed_up");
      await signUp.finalize({
        navigate: handleSignUpNavigate,
      });
    } else {
      if (__DEV__) console.error("Sign-up attempt not complete:", signUp);
    }
  };

  const renderAuthCard = (
    title: string,
    subtitle: string,
    children: React.ReactNode,
  ) => (
    <View className="mx-4 mt-10 rounded-4xl border border-border bg-card p-6 shadow-xl/40">
      <Text className="text-3xl font-sans-extrabold text-foreground">
        {title}
      </Text>
      <Text className="mt-2 max-w-70 text-base font-sans-medium text-muted-foreground">
        {subtitle}
      </Text>
      {children}
    </View>
  );

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <StyledSafeAreaView className="flex-1 bg-background">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            keyboardShouldPersistTaps="handled"
          >
            {renderAuthCard(
              "Verify your account",
              "Enter the code sent to your account to finish signing up.",
              <View className="mt-8 gap-4">
                <TextInput
                  className="h-14 rounded-3xl border border-border bg-background p-4 text-base text-foreground placeholder:text-muted-foreground"
                  value={code}
                  placeholder="Enter your verification code"
                  placeholderTextColor="rgba(142, 142, 147, 0.7)"
                  onChangeText={setCode}
                  keyboardType="numeric"
                />
                {errorsVisible && errors.fields.code && (
                  <Text className="text-sm font-sans-medium text-destructive">
                    {errors.fields.code.message}
                  </Text>
                )}
                <Pressable
                  className={`rounded-3xl py-4 items-center justify-center ${
                    !code || fetchStatus === "fetching"
                      ? "opacity-50 bg-accent"
                      : "bg-accent"
                  }`}
                  onPress={handleVerify}
                  disabled={!code || fetchStatus === "fetching"}
                >
                  <Text className="auth-button-text">Verify</Text>
                </Pressable>
                <Pressable
                  className="rounded-3xl border border-border px-4 py-4 items-center justify-center"
                  onPress={async () => {
                    try {
                      await signUp.verifications.sendEmailCode();
                    } catch (err) {
                      if (__DEV__) {
                        console.error(
                          "Error resending verification code:",
                          JSON.stringify(err, null, 2),
                        );
                      }
                      console.warn(
                        "Failed to resend verification code. Please try again.",
                      );
                    }
                  }}
                >
                  <Text className="text-sm font-sans-semibold text-primary">
                    Resend code
                  </Text>
                </Pressable>
              </View>,
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </StyledSafeAreaView>
    );
  }

  return (
    <StyledSafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="auth-scroll"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-brand-block">
            <View>
              <Image source={image.recurvoLogo} className="auth-logo-mark" />
            </View>
            <View>
              <Text className="auth-wordmark">Recurvo</Text>
              <Text className="auth-wordmark-sub">Smart Billing</Text>
            </View>
          </View>

          <View className="auth-title-container">
            <Text className="auth-title">Create account</Text>
            <Text className="auth-subtitle">
              Join Recurvo to start managing your subscriptions easily.
            </Text>
          </View>

          <View className="auth-content">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Email address</Text>
                <TextInput
                  className="auth-input"
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter email"
                  placeholderTextColor="rgba(142, 142, 147, 0.7)"
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                />
              </View>
              {errorsVisible && errors.fields.emailAddress && (
                <Text className="auth-error">
                  {errors.fields.emailAddress.message
                    .toLowerCase()
                    .includes("invalid")
                    ? "Invalid Email"
                    : errors.fields.emailAddress.message}
                </Text>
              )}

              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  className="auth-input"
                  value={password}
                  placeholder="Enter password"
                  placeholderTextColor="rgba(142, 142, 147, 0.7)"
                  secureTextEntry
                  onChangeText={setPassword}
                />
              </View>
              {errorsVisible && errors.fields.password && (
                <Text className="auth-error">
                  {errors.fields.password.message}
                </Text>
              )}

              <Pressable
                className={`auth-button ${
                  !emailAddress || !password || fetchStatus === "fetching"
                    ? "opacity-50"
                    : ""
                }`}
                onPress={handleSubmit}
                disabled={
                  !emailAddress || !password || fetchStatus === "fetching"
                }
              >
                <Text className="auth-button-text">Sign Up</Text>
              </Pressable>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account? </Text>
              <Link href="/sign-in" className="auth-link">
                Sign In
              </Link>
            </View>

            <View nativeID="clerk-captcha" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
}
