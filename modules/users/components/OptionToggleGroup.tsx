"use client";

import React from "react";

export interface OptionItem<T extends string = string> {
  value: T;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
}

interface OptionToggleGroupProps<T extends string = string> {
  label: string;
  description?: string;
  options: OptionItem<T>[];
  value: T | null | undefined;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export function OptionToggleGroup<T extends string = string>({
  label,
  description,
  options,
  value,
  onChange,
  disabled = false,
}: OptionToggleGroupProps<T>) {
  return (
    <div className="space-y-2">
      <div>
        <label className="text-sm font-semibold text-tinta-900 block">
          {label}
        </label>
        {description && (
          <p className="text-xs text-tinta-600 mt-0.5">{description}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className={`h-11 min-h-[44px] px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 border flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anillo active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${
                isSelected
                  ? "bg-verde-700 border-verde-700 text-white font-semibold shadow-xs"
                  : "bg-white border-line text-tinta-600 hover:border-verde-700 hover:text-tinta-900 hover:bg-verde-50/50"
              }`}
            >
              {opt.icon && (
                <span
                  className={`shrink-0 ${
                    isSelected ? "text-white" : "text-verde-700"
                  }`}
                >
                  {opt.icon}
                </span>
              )}
              <span>{opt.label}</span>
              {opt.hint && (
                <span
                  className={`text-[11px] opacity-75 hidden md:inline ml-1 ${
                    isSelected ? "text-white" : "text-tinta-400"
                  }`}
                >
                  ({opt.hint})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
