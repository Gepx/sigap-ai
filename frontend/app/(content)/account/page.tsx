"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Building2, ChevronDown, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

export default function AccountPage() {
  const { data: session } = useSession();

  const name = session?.user?.name ?? "Testing User";
  const email = session?.user?.email ?? "test@example.com";
  const avatar = session?.user?.avatar ?? "";

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const [fullName, setFullName] = useState(name);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const businessTypes = [
    "Retail",
    "E-commerce",
    "SaaS / Technology",
    "Food & Beverage",
    "Healthcare",
    "Financial Services",
    "Education",
    "Other",
  ];

  return (
    <div className="relative min-h-[calc(100svh-2rem)] overflow-hidden bg-[#F4F9F6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,176,116,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(26,46,38,0.08),transparent_28%)]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#1A2E26] sm:text-4xl">
              Account Settings
            </h1>
            <p className="mt-2 text-sm font-medium text-[#1A2E26]/55">
              Manage your profile details, upload your avatar, and update your
              security settings.
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="rounded-full border-[#1A2E26]/10 bg-white text-[#1A2E26] shadow-sm hover:bg-[#E8FFF4] hover:text-[#007A51]"
          >
            <Link href="/app">
              <ArrowLeft className="mr-2 size-4" />
              Back to App
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: Profile Information */}
          <div className="rounded-[1.75rem] border border-[#1A2E26]/10 bg-white/90 p-6 shadow-sm backdrop-blur">
            <h2 className="text-xl font-black tracking-tight text-[#1A2E26]">
              Profile Information
            </h2>
            <p className="mt-1 text-sm text-[#1A2E26]/55">
              Update your account details and upload your profile avatar.
            </p>

            {/* Avatar */}
            <div className="mt-6 flex items-center gap-5">
              <div className="rounded-full bg-gradient-to-br from-[#00B074] to-[#1A2E26] p-[2px]">
                <Avatar className="size-20 border-4 border-white">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback className="bg-[#00B074] text-xl font-black text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="font-bold text-[#1A2E26]">Profile Avatar Image</p>
                <p className="mt-1 text-xs text-[#1A2E26]/50">
                  Drag and drop an image here, or click to browse.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 rounded-full border-[#00B074]/20 text-[#007A51] hover:bg-[#E8FFF4]"
                >
                  Choose File
                </Button>
              </div>
            </div>

            {/* Email */}
            <div className="mt-6 space-y-2">
              <label className="text-sm font-bold text-[#1A2E26]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#1A2E26]/30" />
                <Input
                  value={email}
                  disabled
                  className="pl-10 text-[#1A2E26]/60"
                />
              </div>
              <p className="text-xs text-[#1A2E26]/40">
                Email address cannot be changed.
              </p>
            </div>

            {/* Full Name */}
            <div className="mt-4 space-y-2">
              <label className="text-sm font-bold text-[#1A2E26]">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#1A2E26]/30" />
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Business Name */}
            <div className="mt-4 space-y-2">
              <label className="text-sm font-bold text-[#1A2E26]">
                Business Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#1A2E26]/30" />
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your business name"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Business Type */}
            <div className="mt-4 space-y-2">
              <label className="text-sm font-bold text-[#1A2E26]">
                Business Type
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#1A2E26]/30" />
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="flex h-9 w-full appearance-none rounded-md border border-input bg-transparent py-1 pl-10 pr-9 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="" disabled>Select business type</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#1A2E26]/30" />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button className="rounded-full bg-[#1A2E26] text-white hover:bg-[#1A2E26]/90">
                Save Changes
              </Button>
            </div>
          </div>

          {/* RIGHT: Security & Password */}
          <div className="rounded-[1.75rem] border border-[#1A2E26]/10 bg-white/90 p-6 shadow-sm backdrop-blur">
            <h2 className="text-xl font-black tracking-tight text-[#1A2E26]">
              Security & Password
            </h2>
            <p className="mt-1 text-sm text-[#1A2E26]/55">
              Ensure your account is using a secure and robust password.
            </p>

            {/* Current Password */}
            <div className="mt-6 space-y-2">
              <label className="text-sm font-bold text-[#1A2E26]">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#1A2E26]/30" />
                <Input
                  type={showCurrentPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A2E26]/40 hover:text-[#1A2E26]"
                >
                  {showCurrentPw ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="mt-4 space-y-2">
              <label className="text-sm font-bold text-[#1A2E26]">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#1A2E26]/30" />
                <Input
                  type={showNewPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A2E26]/40 hover:text-[#1A2E26]"
                >
                  {showNewPw ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="mt-4 space-y-2">
              <label className="text-sm font-bold text-[#1A2E26]">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#1A2E26]/30" />
                <Input
                  type={showConfirmPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A2E26]/40 hover:text-[#1A2E26]"
                >
                  {showConfirmPw ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button className="rounded-full bg-[#1A2E26] text-white hover:bg-[#1A2E26]/90">
                Update Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
