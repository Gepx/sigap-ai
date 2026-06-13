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
import { SignUpFormData, signUpSchema } from "@/lib/schemas/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { errorHandler } from "@/lib/handler/errorHandler";
import { toast } from "sonner";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutate: createAccount, isPending } = useMutation({
    mutationFn: async (payload: SignUpFormData) => {
      const res = await api.post("/api/auth/register", payload);
      return res.data;
    },
    onError: (err: unknown) => {
      errorHandler(err);
      toast.error("Error creating account");
    },
    onSuccess: (data, variables) => {
      toast.success("Account successfully registered! Please check your email.");
      reset();

      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    createAccount(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border border-[#1A2E26]/10 bg-white/92 p-0 shadow-2xl shadow-[#00B074]/10 backdrop-blur">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
            <FieldGroup>
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-[#1A2E26]">
                  Create an account
                </h1>
                <p className="max-w-md text-sm leading-7 text-[#1A2E26]/62">
                  Enter your details to get into the Sigap analysis workspace.
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-[#B43331]">
                    {errors.name.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="test@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-[#B43331]">
                    {errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
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
                {errors.password && (
                  <p className="text-sm text-[#B43331]">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="h-11 w-full rounded-full bg-[#00B074] text-white shadow-lg shadow-[#00B074]/20 transition hover:-translate-y-0.5 hover:bg-[#079968]"
                  disabled={isPending}
                >
                  {isPending ? "Registering..." : "Register"}
                  <ArrowRight className="size-4" />
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#007A51] underline-offset-4 hover:underline"
                >
                  Log in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
