"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface AdminInfoTooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function AdminInfoTooltip({
  content,
  children,
  side = "top",
  className = "",
}: AdminInfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        type="button"
        className={`inline-flex items-center text-tinta-400 hover:text-verde-700 transition-colors cursor-help focus:outline-none ${className}`}
        aria-label="Más información"
      >
        {children || <HelpCircle className="w-3.5 h-3.5 opacity-70 hover:opacity-100" />}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        className="max-w-xs text-xs p-3 leading-relaxed bg-tinta-900 text-white shadow-lg rounded-xl border border-tinta-800"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
