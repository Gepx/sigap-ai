"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { ArrowRight, Mail } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function VerifyEmailForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await api.post("/api/auth/verify-email", { email, code });
      if (res.data.success) {
        toast.success("Email verified successfully! Please log in.");
        router.push("/login");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to verify email. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const onResend = async () => {
    setIsResending(true);
    try {
      const res = await api.post("/api/auth/resend-verification", { email });
      if (res.data.success) {
        toast.success("Verification code resent to your email.");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to resend code."
      );
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <Card className="overflow-hidden border border-[#1A2E26]/10 bg-white/92 p-0 shadow-2xl shadow-[#00B074]/10 backdrop-blur">
        <CardContent className="p-6 text-center sm:p-8">
          <p>No email provided. Please sign in or register.</p>
          <Button
            className="mt-4"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border border-[#1A2E26]/10 bg-white/92 p-0 shadow-2xl shadow-[#00B074]/10 backdrop-blur">
        <CardContent className="p-0">
          <form className="flex flex-col items-center p-6 text-center sm:p-8" onSubmit={onSubmit}>
            <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-[#E8FFF4]">
              <Mail className="size-8 text-[#00B074]" />
            </div>
            
            <h1 className="mb-2 text-3xl font-black tracking-tight text-[#1A2E26]">
              Check your email
            </h1>
            <p className="mb-8 max-w-sm text-sm leading-7 text-[#1A2E26]/62">
              We&apos;ve sent a 6-digit verification code to <span className="font-semibold text-[#1A2E26]">{email}</span>. Please enter it below.
            </p>

            <div className="mb-8 flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(val) => setCode(val)}
                className="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-full bg-[#00B074] text-white shadow-lg shadow-[#00B074]/20 transition hover:-translate-y-0.5 hover:bg-[#079968]"
              disabled={isVerifying || code.length !== 6}
            >
              {isVerifying ? "Verifying..." : "Verify Email"}
              <ArrowRight className="size-4 ml-2" />
            </Button>

            <p className="mt-6 text-sm text-[#1A2E26]/62">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={onResend}
                disabled={isResending}
                className="font-semibold text-[#007A51] underline-offset-4 hover:underline disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend"}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
