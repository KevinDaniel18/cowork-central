import { colors } from "@/constants/colors";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useNavigation } from "@/hooks/useNavigation";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { User, Mail, EyeOff, Eye, UserPlus, Link, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export function RegisterForm() {
  const router = useNavigation();
  const [data, setData] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onChange<K extends keyof RegisterPayload>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setData((p) => ({ ...p, [key]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/register", data);
      const result = res.data;
      if (result?.success) {
        router.replace("/auth/login");
      } else {
        setError(result?.error ?? "We couldn't register your account");
      }
    } catch {
      setError(
        "There was a problem registering your account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const passwordWeak = data.password.length > 0 && data.password.length < 8;

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
          Create your account
        </CardTitle>
        <CardDescription
          className="text-sm"
          style={{ color: colors.neutral[500] }}
        >
          Start managing your space reservations
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error ? (
          <Alert
            variant="destructive"
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
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-70" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                value={data.name}
                onChange={onChange("name")}
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
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-70" />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="tucorreo@empresa.com"
                required
                value={data.email}
                onChange={onChange("email")}
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
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                required
                value={data.password}
                onChange={onChange("password")}
                className="pl-9 pr-10 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#10b981]"
                style={{
                  borderColor: colors.border.light,
                  backgroundColor: colors.surface.light,
                  color: colors.foreground.light,
                }}
                aria-invalid={passwordWeak ? "true" : "false"}
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
            <div
              className="h-1 rounded transition-colors"
              style={{
                backgroundColor:
                  data.password.length === 0
                    ? colors.neutral[200]
                    : passwordWeak
                    ? "#ef4444"
                    : colors.brand.primary[500],
              }}
              aria-hidden="true"
            />
            {passwordWeak && (
              <p className="text-xs" style={{ color: "#7f1d1d" }}>
                The password must be at least 8 characters.
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2 text-white"
            style={{ backgroundColor: colors.brand.primary[500] }}
          >
            <UserPlus className="h-4 w-4" />
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>
        <Link
          href="/auth/login"
          className="ml-2 font-medium underline underline-offset-4"
          style={{ color: colors.brand.accent[500] }}
        >
          Register
        </Link>
      </CardFooter>
    </Card>
  );
}
