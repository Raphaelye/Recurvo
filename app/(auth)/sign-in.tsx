import { StyledSafeAreaView } from "@/components/StyledSafeAreaView";
import { image } from "@/constants/images";
import { useSignIn } from "@clerk/expo";
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
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const posthog = usePostHog();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [selectedFactor, setSelectedFactor] = React.useState<any>(null);
  const [mfaCode, setMfaCode] = React.useState("");
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

  const handleSignInNavigate = async ({
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
    const { error } = await signIn.password({ emailAddress, password });
    if (error) {
      if (__DEV__) console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      posthog.capture("user_signed_in", { method: "password" });
      await signIn.finalize({ navigate: handleSignInNavigate });
      return;
    }

    if (signIn.status === "needs_second_factor") {
      const factor = signIn.supportedSecondFactors?.[0] ?? null;
      setSelectedFactor(factor);

      if (factor?.strategy === "email_code") {
        try {
          await signIn.mfa.sendEmailCode();
        } catch (mfaError) {
          if (__DEV__) {
            console.error(
              "Error sending email MFA code:",
              JSON.stringify(mfaError, null, 2),
            );
          }
          console.warn(
            "Failed to send email verification code. Please try again.",
          );
          return;
        }
      } else if (factor?.strategy === "phone_code") {
        try {
          await signIn.mfa.sendPhoneCode();
        } catch (mfaError) {
          if (__DEV__) {
            console.error(
              "Error sending phone MFA code:",
              JSON.stringify(mfaError, null, 2),
            );
          }
          console.warn(
            "Failed to send phone verification code. Please try again.",
          );
          return;
        }
      }
      return;
    }

    if (signIn.status === "needs_client_trust") {
      // The Clerk SDK automatically sends the email code when transitioning to needs_client_trust
      // if an email factor is available. No explicit call to sendEmailCode is needed here.
      // However, if there was an explicit call, it would need a try/catch.
      // The "Resend code" button in the UI below handles explicit sending.
      if (
        signIn.supportedSecondFactors?.some(
          (factor) => factor.strategy === "email_code",
        )
      ) {
        // If Clerk's internal logic for needs_client_trust implicitly calls sendEmailCode and it fails,
        // the error would typically be reflected in the `errors` object.
        // No explicit await call here to wrap, as per Clerk's typical flow for needs_client_trust.
      }
      return;
    }

    if (__DEV__) console.error("Sign-in attempt not complete:", signIn);
  };

  const handleVerify = async () => {
    const { error } = await signIn.mfa.verifyEmailCode({ code });
    if (error) {
      if (__DEV__) console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: handleSignInNavigate });
      return;
    }

    if (__DEV__) console.error("Sign-in attempt not complete:", signIn);
  };
  const handleMfaSubmit = async () => {
    if (!selectedFactor) {
      return;
    }

    const mfaResult =
      selectedFactor.strategy === "email_code"
        ? await signIn.mfa.verifyEmailCode({ code: mfaCode })
        : selectedFactor.strategy === "phone_code"
          ? await signIn.mfa.verifyPhoneCode({ code: mfaCode })
          : selectedFactor.strategy === "otp" ||
              selectedFactor.strategy === "totp"
            ? await signIn.mfa.verifyTOTP({ code: mfaCode })
            : selectedFactor.strategy === "backup_code"
              ? await signIn.mfa.verifyBackupCode({ code: mfaCode })
              : undefined;

    if (!mfaResult) {
      console.error("Unsupported MFA strategy:", selectedFactor.strategy);
      return;
    }

    if (mfaResult.error) {
      if (__DEV__) console.error(JSON.stringify(mfaResult.error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: handleSignInNavigate });
      return;
    }

    if (__DEV__) console.error("Sign-in attempt not complete:", signIn);
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

  if (signIn.status === "needs_second_factor" && selectedFactor) {
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
              "Verify your identity",
              "Enter the code from your chosen second factor to continue.",
              <View className="mt-8 gap-4">
                <Text className="text-sm font-sans-medium text-muted-foreground">
                  {selectedFactor.strategy === "email_code" && "Email"}
                </Text>
                <TextInput
                  className="h-14 rounded-3xl border border-border bg-background p-4 text-base text-foreground placeholder:text-muted-foreground"
                  value={mfaCode}
                  placeholder="Enter verification code"
                  placeholderTextColor="rgba(142, 142, 147, 0.7)"
                  onChangeText={setMfaCode}
                  keyboardType={
                    selectedFactor?.strategy === "backup_code"
                      ? "default"
                      : "numeric"
                  }
                />

                {errorsVisible && errors.fields.code && (
                  <Text className="text-sm font-sans-medium text-destructive">
                    {errors.fields.code.message}
                  </Text>
                )}
                <Pressable
                  className={`rounded-3xl py-4 items-center justify-center ${
                    !mfaCode || fetchStatus === "fetching"
                      ? "opacity-50 bg-accent"
                      : "bg-accent"
                  }`}
                  onPress={handleMfaSubmit}
                  disabled={!mfaCode || fetchStatus === "fetching"}
                >
                  <Text className="text-base font-sans-bold text-background">
                    Verify
                  </Text>
                </Pressable>
                {selectedFactor.strategy === "email_code" && (
                  <Pressable
                    className="rounded-3xl border border-border px-4 py-4 items-center justify-center" // Add try/catch for resend
                    onPress={async () => {
                      try {
                        await signIn.mfa.sendEmailCode();
                      } catch (mfaError) {
                        if (__DEV__) {
                          console.error(
                            "Error resending email MFA code:",
                            JSON.stringify(mfaError, null, 2),
                          );
                        }
                        console.warn(
                          "Failed to resend email verification code. Please try again.",
                        );
                        // Optionally, update a state to show a message in the UI
                      }
                    }}
                  >
                    <Text className="text-sm font-sans-semibold text-primary">
                      Resend code
                    </Text>
                  </Pressable>
                )}
                <Pressable
                  className="rounded-3xl border border-border px-4 py-4 items-center justify-center"
                  onPress={() => {
                    signIn.reset();
                    setSelectedFactor(null);
                    setMfaCode("");
                  }}
                >
                  <Text className="text-sm font-sans-semibold text-primary">
                    Start over
                  </Text>
                </Pressable>
              </View>,
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </StyledSafeAreaView>
    );
  }

  if (signIn.status === "needs_client_trust") {
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
              "Enter the code sent to your account to finish signing in.",
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
                    fetchStatus === "fetching"
                      ? "opacity-50 bg-accent"
                      : "bg-accent"
                  }`}
                  onPress={handleVerify}
                  disabled={fetchStatus === "fetching"}
                >
                  <Text className="auth-button-text">Verify</Text>
                </Pressable>
                <Pressable
                  className="rounded-3xl border border-border px-4 py-4 items-center justify-center"
                  onPress={async () => {
                    try {
                      await signIn.mfa.sendEmailCode();
                    } catch (mfaError) {
                      if (__DEV__) {
                        console.error(
                          "Error resending email code for client trust:",
                          JSON.stringify(mfaError, null, 2),
                        );
                      }
                      console.warn(
                        "Failed to resend email verification code for client trust. Please try again.",
                      );
                      // Optionally, update a state to show a message in the UI
                    }
                  }}
                >
                  <Text className="text-sm font-sans-semibold text-primary">
                    Resend code
                  </Text>
                </Pressable>
                <Pressable
                  className="rounded-3xl border border-border px-4 py-4 items-center justify-center"
                  onPress={() => signIn.reset()}
                >
                  <Text className="text-sm font-sans-semibold text-primary">
                    Go back
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
        className= 'flex-1'
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-brand-block">
            <View>
              <Image source={image.recurvoLogo} className="auth-logo-mark" />
            </View>
            <View>
              <Text className="auth-wordmark">Recurvo</Text>
              <Text className="auth-wordmark-sub">Manage Recurring Bills</Text>
            </View>
          </View>


          <View className="auth-title-container">
            <Text className="auth-title">Welcome Back</Text>
            <Text className="auth-subtitle">
              Sign in to continue managing your subscriptions.
            </Text>
          </View>

          <View className="auth-content">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label ">Email </Text>
                <TextInput
                  className="auth-input"
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(142, 142, 147, 0.7)"
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                />
              </View>
              {errorsVisible && errors.fields.identifier && (
                <Text className="auth-error">
                  {errors.fields.identifier.message
                    .toLowerCase()
                    .includes("invalid")
                    ? "Invalid Email"
                    : errors.fields.identifier.message}
                </Text>
              )}
              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  className="auth-input"
                  value={password}
                  placeholder="Enter your password"
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
                <Text className="auth-button-text">Sign In</Text>
              </Pressable>
            </View>
            <View className="auth-link-row">
              <Text className="auth-link-copy">New to Recurvo?</Text>
              <Link href="/sign-up" className="auth-link">
                Create Account
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
}
