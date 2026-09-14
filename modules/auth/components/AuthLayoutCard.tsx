"use client";

import * as React from "react";
import Link from "next/link";
import { PawPrint } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ENV } from "@/shared/config/env";
import { cn } from "cn";

interface AuthLayoutCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  maxWidthClassName?: string;
}

export function AuthLayoutCard({
  title,
  subtitle,
  children,
  maxWidthClassName = "max-w-xl",
}: AuthLayoutCardProps) {
  return (
    <div className={cn("w-full mx-auto px-4 py-8", maxWidthClassName)}>
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 group transition-opacity hover:opacity-90 mb-4"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
            <PawPrint className="size-5.5 fill-current" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
            {ENV.APP_NAME}
          </span>
        </Link>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardContent className="p-6 sm:p-8">{children}</CardContent>
      </Card>
    </div>
  );
}
