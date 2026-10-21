import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/shared/stores/auth.store";
import { AuthService } from "./auth.service";
import { LoginSchema, RegisterSchema, RoleType } from "./auth.schema";
import { SecureStoreManager, STORAGE_KEYS } from "@/shared/lib/secure-store";

export const useAuthController = () => {
  const router = useRouter();
  const { setUser, switchRole, demoLogin, biometricEnabled, setBiometricEnabled } = useAuthStore();

  const [mode, setMode] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleType>("CONSUMER");
  const [termsAccepted, setTermsAccepted] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /**
   * Handle Login Action
   */
  const handleLogin = useCallback(async () => {
    setError(null);
    setFieldErrors({});

    const validation = LoginSchema.safeParse({ email, password });
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await AuthService.login(validation.data);
      await setUser(response.user, response.token);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err?.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, router, setUser]);

  /**
   * Handle Register Action
   */
  const handleRegister = useCallback(async () => {
    setError(null);
    setFieldErrors({});

    const validation = RegisterSchema.safeParse({
      name,
      email,
      password,
      role: selectedRole,
      termsAccepted,
    });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await AuthService.register(validation.data);
      await setUser(response.user, response.token);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [name, email, password, selectedRole, termsAccepted, router, setUser]);

  /**
   * Handle 1-Click Biometric Authentication (Face ID / Fingerprint)
   */
  const handleBiometricAuth = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const success = await SecureStoreManager.authenticateWithBiometrics(
        "Scan Face ID or Fingerprint to unlock your account"
      );
      if (success) {
        const savedToken = await SecureStoreManager.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const savedUserJson = await SecureStoreManager.getItem(STORAGE_KEYS.USER_DATA);

        if (savedToken && savedUserJson) {
          const user = JSON.parse(savedUserJson);
          await setUser(user, savedToken);
          router.replace("/(tabs)");
          return;
        }
        // Fallback to active demo account if local storage is blank
        await demoLogin("CONSUMER");
        router.replace("/(tabs)");
      } else {
        setError("Biometric scan was cancelled or unrecognized.");
      }
    } catch (err: any) {
      setError(err?.message || "Biometric authentication failed");
    } finally {
      setIsLoading(false);
    }
  }, [router, setUser, demoLogin]);

  /**
   * 1-Click Demo Quick Switcher
   */
  const handleDemoLogin = useCallback(async (role: RoleType) => {
    setIsLoading(true);
    try {
      await demoLogin(role);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err?.message || "Demo login failed");
    } finally {
      setIsLoading(false);
    }
  }, [demoLogin, router]);

  return {
    mode,
    setMode,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    selectedRole,
    setSelectedRole,
    termsAccepted,
    setTermsAccepted,
    isLoading,
    error,
    fieldErrors,
    biometricEnabled,
    setBiometricEnabled,
    handleLogin,
    handleRegister,
    handleBiometricAuth,
    handleDemoLogin,
  };
};
