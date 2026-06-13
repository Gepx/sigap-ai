"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormData, signInSchema } from "@/lib/schemas/authSchema";
import { AuthError } from "next-auth";
import { signIn } from "next-auth/react";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(";").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        if (key) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    if (cookies.logged_out === "1") {
      toast.success("Signout successfully");
      document.cookie =
        "logged_out=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } else if (cookies.session_expired === "1") {
      toast.error("Session has ended. Please relogin.");
      document.cookie =
        "session_expired=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }: SignInFormData) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        // Handle custom CredentialsSignin codes
        if (res.code === "Unverified Email" || res.error === "UnverifiedEmailError" || res.error === "Unverified Email") {
          toast.error("Please verify your email address to continue.");
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        } else {
          toast.error(res.code ?? "Invalid credentials. Please try again.");
        }
      } else {
        toast.success("Login Success");
        router.push(callbackUrl ?? "/app");
      }
    } catch (error: unknown) {
      if (error instanceof AuthError) {
        if (error.name === "UnverifiedEmailError" || error.message.includes("Unverified Email")) {
          toast.error("Please verify your email address to continue.");
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        } else {
          toast.error(error.name.replace("Error", ""));
        }
      } else {
        toast.error("An unexpected error occurred during login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border border-[#1A2E26]/10 bg-white/92 p-0 shadow-2xl shadow-[#00B074]/10 backdrop-blur">
        <CardContent className="p-0">
          <form className="p-6 sm:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-[#1A2E26]">
                  Welcome back
                </h1>
                <p className="max-w-md text-sm leading-7 text-[#1A2E26]/62">
                  Sign in to continue into the sentiment workspace and review
                  pipeline.
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="test@example.com"
                  required
                  {...register("email")}
                />
                {errors.email ? (
                  <p className="text-sm text-[#B43331]">
                    {errors.email.message}
                  </p>
                ) : null}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm font-medium text-[#007A51] underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#1A2E26]/45 transition hover:text-[#1A2E26]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-sm text-[#B43331]">
                    {errors.password.message}
                  </p>
                ) : null}
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="h-11 w-full cursor-pointer rounded-full bg-[#00B074] text-white shadow-lg shadow-[#00B074]/20 transition hover:-translate-y-0.5 hover:bg-[#079968]"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                  <ArrowRight className="size-4" />
                </Button>
              </Field>
              <FieldDescription className="text-center text-sm text-[#1A2E26]/62">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#007A51] underline-offset-4 hover:underline"
                >
                  Register
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
