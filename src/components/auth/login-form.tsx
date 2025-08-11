"use client";

import type React from "react";
import axios, { isAxiosError } from "axios";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import { colors } from "@/constants/colors";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import { Button } from "../ui/button";

type LoginPayload = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useNavigation();
  const [data, setData] = useState<LoginPayload>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/login", data);
      const result = res.data;
      if (result?.success) {
        router.replace("/");
      } else {
        setError(result?.error ?? "Invalid credentials");
      }
    } catch (error) {
      // console.log(error);
      if (isAxiosError(error)) {
        setError(
          error?.response?.data?.error ??
            "We couldn't log you in. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card
      className="w-full max-w-md border"
      style={{ borderColor: colors.border.light }}
    >
      <CardHeader className="space-y-1">
        <CardTitle
          className="text-2xl"
          style={{ color: colors.foreground.light }}
        >
          Sign in
        </CardTitle>
        <CardDescription
          className="text-sm"
          style={{ color: colors.neutral[500] }}
        >
          Manage your coworking reservations
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error ? (
          <Alert
            variant={"destructive"}
            className="mb-4"
            role="alert"
            aria-live="polite"
            style={{
              backgroundColor: "#fee2e2",
              color: "#7f1d1d",
              borderColor: "#fecaca",
            }}
          >
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-70" />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="yourmail@company.com"
                required
                value={data.email}
                onChange={handleInput}
                className="pl-9 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#10b981]"
                style={{
                  borderColor: colors.border.light,
                  backgroundColor: colors.surface.light,
                  color: colors.foreground.light,
                }}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-70" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                value={data.password}
                onChange={handleInput}
                className="pl-9 pr-10 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#10b981]"
                style={{
                  borderColor: colors.border.light,
                  backgroundColor: colors.surface.light,
                  color: colors.foreground.light,
                }}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide Password" : "Show Password"}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border"
                style={{ borderColor: colors.border.light }}
              />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <Link
              href="/auth/forgot"
              className="underline underline-offset-4"
              style={{ color: colors.brand.secondary[600] }}
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2 text-white"
            style={{
              backgroundColor: colors.brand.primary[500],
            }}
          >
            <LogIn className="h-4 w-4" />
            {isLoading ? "Entering..." : "Login"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center text-sm">
        <span className="text-muted-foreground">
          Don&apos;t have an account?
        </span>
        <Link
          href="/auth/register"
          className="ml-2 font-medium underline underline-offset-4"
          style={{ color: colors.brand.accent[500] }}
        >
          Login
        </Link>
      </CardFooter>
    </Card>
  );
}
