"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useStatsStore } from "@/lib/stats-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const { login, register, lastError, clearError, user, token } = useAuthStore();
  const { loadUserProgress } = useStatsStore();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    if (!loginEmail || !loginPassword) {
      // Handle validation errors locally since they're not from the API
      setIsLoading(false);
      return;
    }

    const success = await login(loginEmail, loginPassword);
    
    if (success) {
      // Load user progress from backend after successful login
      const authStore = useAuthStore.getState();
      if (authStore.user && authStore.token) {
        console.log('Loading progress for user:', authStore.user.name);
        await loadUserProgress(authStore.user.id, authStore.token);
        console.log('Progress loading completed');
      }
      router.push("/");
    }
    // Error is now handled in the auth store
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    if (!registerName || !registerEmail || !registerPassword || !confirmPassword) {
      // Handle validation errors locally since they're not from the API
      setIsLoading(false);
      return;
    }

    if (registerPassword !== confirmPassword) {
      // Handle validation errors locally since they're not from the API
      setIsLoading(false);
      return;
    }

    if (registerPassword.length < 6) {
      // Handle validation errors locally since they're not from the API
      setIsLoading(false);
      return;
    }

    const success = await register(registerName, registerEmail, registerPassword);
    
    if (success) {
      // Load user progress from backend after successful registration
      const authStore = useAuthStore.getState();
      if (authStore.user && authStore.token) {
        console.log('Loading progress for new user:', authStore.user.name);
        await loadUserProgress(authStore.user.id, authStore.token);
        console.log('Progress loading completed for new user');
      }
      router.push("/");
    }
    // Error is now handled in the auth store
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Harmony Quest</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one to continue your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            {lastError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{lastError}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Username</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Enter your username"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
