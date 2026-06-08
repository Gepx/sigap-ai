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
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/lib/schemas/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { errorHandler } from "@/lib/handler/errorHandler";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff, Mailbox } from "lucide-react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: async (payload: ForgotPasswordFormData) => {
      const res = await api.post("/api/auth/forgot-password", payload);
      return res.data;
    },
    onError: (err: any) => {
      errorHandler(err);
      toast.error("Error changing password");
    },
    onSuccess: () => {
      toast.success("Password changed!");
      reset();
      router.push("/login");
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    changePassword(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border border-[#1A2E26]/10 bg-white/92 p-0 shadow-2xl shadow-[#00B074]/10 backdrop-blur">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
            <FieldGroup>
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-[#1A2E26]">
                  Reset password
                </h1>
                <p className="max-w-md text-sm leading-7 text-[#1A2E26]/62">
                  Please kindly set your new password
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-[#B43331]">{errors.email.message}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    {...register("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-[#B43331]">
                    {errors.newPassword.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-[#B43331]">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="h-11 w-full rounded-full bg-[#00B074] text-white shadow-lg shadow-[#00B074]/20 transition hover:-translate-y-0.5 hover:bg-[#079968]"
                  disabled={isPending}
                >
                  {isPending ? "Changing..." : "Reset password"}
                </Button>
              </Field>

              <FieldDescription className="text-center mt-4">
                <Link
                  href="/login"
                  className="font-semibold text-[#007A51] underline-offset-4 hover:underline"
                >
                  Back to Login
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
