import React, { useState } from "react";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { LinkText } from "@/components/ui/link";
import Link from "@unitools/link";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeOffIcon,
  Icon,
} from "@/components/ui/icon";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react-native";
import { GoogleIcon } from "./assets/icons/google";
import { AppleIcon } from "./assets/icons/apple";
import { FacebookIcon } from "./assets/icons/facebook";
import { InstagramIcon } from "./assets/icons/instagram";
import { Pressable } from "@/components/ui/pressable";
import { useRouter } from "expo-router";
import { AuthLayout } from "./layout";
import { useSession } from "./authContext";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

const LoginWithLeftBackground = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });
  const toast = useToast();
  const router = useRouter();
  const { signIn, signInWithGoogle, signInWithApple, signInWithFacebook, signInWithInstagram, devMockLogin } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="success">
              <ToastTitle>Login successful!</ToastTitle>
            </Toast>
          );
        },
      });
      reset();
      router.replace("/(tabs)/dashboard");
    } catch (error: any) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="error">
              <ToastTitle>{error.message || "Login failed. Please try again."}</ToastTitle>
            </Toast>
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook' | 'instagram') => {
    setIsLoading(true);
    try {
      switch (provider) {
        case 'google':
          await signInWithGoogle();
          break;
        case 'apple':
          await signInWithApple();
          break;
        case 'facebook':
          await signInWithFacebook();
          break;
        case 'instagram':
          await signInWithInstagram();
          break;
      }
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="success">
              <ToastTitle>Login successful!</ToastTitle>
            </Toast>
          );
        },
      });
      router.replace("/(tabs)/dashboard");
    } catch (error: any) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="error">
              <ToastTitle>{error.message || `${provider} login failed. Please try again.`}</ToastTitle>
            </Toast>
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  const handleDevMockLogin = async () => {
    if (!devMockLogin) return;

    setIsLoading(true);
    try {
      await devMockLogin();
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="success">
              <ToastTitle>Dev login successful!</ToastTitle>
            </Toast>
          );
        },
      });
      router.replace("/(tabs)/dashboard");
    } catch (error: any) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="error">
              <ToastTitle>{error.message || "Dev login failed. Please try again."}</ToastTitle>
            </Toast>
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack className="max-w-[440px] w-full" space="md">
      <VStack className="md:items-center" space="md">
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/");
            }
          }}
        >
          <Icon
            as={ArrowLeftIcon}
            className="md:hidden stroke-background-800"
            size="xl"
          />
        </Pressable>
        <VStack>
          <Heading className="md:text-center" size="3xl">
            Welcome back
          </Heading>
          <Text>Sign in to continue tracking your health</Text>
        </VStack>
      </VStack>
      <VStack className="w-full">
        <VStack space="xl" className="w-full">
          <FormControl isInvalid={!!errors.email}>
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="email"
              defaultValue=""
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    className="text-sm"
                    placeholder="Email"
                    type="text"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="next"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="md" as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.email?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <FormControlLabel>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="password"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    className="text-sm"
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                    type={showPassword ? "text" : "password"}
                  />
                  <InputSlot onPress={handleState} className="pr-3">
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="sm" as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.password?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        </VStack>

        <VStack className="w-full my-7" space="lg">
          <Button
            className="w-full"
            onPress={handleSubmit(onSubmit)}
            isDisabled={isLoading}
          >
            <ButtonText className="font-medium">
              {isLoading ? "Signing in..." : "Sign in"}
            </ButtonText>
          </Button>

          <VStack space="sm" className="w-full">
            <Button
              variant="outline"
              action="secondary"
              className="w-full gap-1"
              onPress={() => handleSocialLogin('google')}
              isDisabled={isLoading}
            >
              <ButtonText className="font-medium">
                Continue with Google
              </ButtonText>
              <ButtonIcon as={GoogleIcon} />
            </Button>

            <Button
              variant="outline"
              action="secondary"
              className="w-full gap-1"
              onPress={() => handleSocialLogin('apple')}
              isDisabled={isLoading}
            >
              <ButtonText className="font-medium">
                Continue with Apple
              </ButtonText>
              <ButtonIcon as={AppleIcon} />
            </Button>

            <Button
              variant="outline"
              action="secondary"
              className="w-full gap-1"
              onPress={() => handleSocialLogin('facebook')}
              isDisabled={isLoading}
            >
              <ButtonText className="font-medium">
                Continue with Facebook
              </ButtonText>
              <ButtonIcon as={FacebookIcon} />
            </Button>

            <Button
              variant="outline"
              action="secondary"
              className="w-full gap-1"
              onPress={() => handleSocialLogin('instagram')}
              isDisabled={isLoading}
            >
              <ButtonText className="font-medium">
                Continue with Instagram
              </ButtonText>
              <ButtonIcon as={InstagramIcon} />
            </Button>
          </VStack>

          {/* Development-only quick login */}
          {__DEV__ && devMockLogin && (
            <VStack className="mt-4 pt-4 border-t border-typography-200" space="sm">
              <Text className="text-xs text-typography-400 text-center">
                Development Mode
              </Text>
              <Button
                variant="outline"
                action="secondary"
                className="w-full"
                onPress={handleDevMockLogin}
                isDisabled={isLoading}
              >
                <ButtonText className="font-medium text-typography-600">
                  🚀 Quick Dev Login
                </ButtonText>
              </Button>
            </VStack>
          )}
        </VStack>

        <HStack className="self-center">
          <Text size="md">Don't have an account?</Text>
          <Link href="/signup">
            <LinkText
              className="font-medium text-primary-700 ml-1 group-hover/link:text-primary-600 group-hover/pressed:text-primary-700"
              size="md"
            >
              Sign up
            </LinkText>
          </Link>
        </HStack>
      </VStack>
    </VStack>
  );
};

export const Login = () => {
  return (
    <AuthLayout>
      <LoginWithLeftBackground />
    </AuthLayout>
  );
};

export default Login;

