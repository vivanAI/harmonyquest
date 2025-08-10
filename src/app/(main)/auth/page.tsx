"use client";

import { signIn } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>Continue with your preferred provider</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full" onClick={() => signIn("google", { callbackUrl: "/" })}>
            Continue with Google
          </Button>
          <Separator className="my-2" />
          <p className="text-xs text-muted-foreground text-center">
            By continuing you agree to our Terms and acknowledge our Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
