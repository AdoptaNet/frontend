"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "cn";
import dayjs from "@/shared/utils/date";

export interface DatePickerProps {
  value?: string | null;
  onChange: (dateString: string) => void;
  minDate?: Date | string;
  maxDate?: Date | string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showQuickPresets?: boolean;
  inline?: boolean;
}

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

export function DatePicker({
  value,
  onChange,
  minDate = new Date(),
  maxDate,
  placeholder = "Seleccionar fecha...",
  disabled = false,
  className,
  showQuickPresets = true,
  inline = false,
}: DatePickerProps) {
  // Normalize value to YYYY-MM-DD
  const selectedDayjs = value ? dayjs(value) : null;
  const selectedFormatted = selectedDayjs?.isValid()
    ? selectedDayjs.format("YYYY-MM-DD")
    : null;

  // Internal month view state (start with selected month or current month)
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDayjs?.isValid()) {
      return selectedDayjs.startOf("month");
    }
    return dayjs().startOf("month");
  });

  const [isOpen, setIsOpen] = useState(inline);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync current month view when value changes from outside
  useEffect(() => {
    if (selectedDayjs?.isValid()) {
      setCurrentMonth(selectedDayjs.startOf("month"));
    }
  }, [value]);

  // Handle click outside to close dropdown when not inline
  useEffect(() => {
    if (inline) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, inline]);

  const minDayjs = minDate ? dayjs(minDate).startOf("day") : null;
  const maxDayjs = maxDate ? dayjs(maxDate).endOf("day") : null;
  const today = dayjs().startOf("day");

  // Quick Presets
  const presets = [
    { label: "Hoy", days: 0 },
    { label: "Mañana", days: 1 },
    { label: "En 3 días", days: 3 },
    { label: "En 1 semana", days: 7 },
    { label: "En 2 semanas", days: 14 },
  ];

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => prev.add(1, "month"));
  };

  const handleSelectDate = (dateStr: string) => {
    onChange(dateStr);
    if (!inline) {
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  // Generate days matrix for current month (Monday start)
  const startOfMonth = currentMonth.startOf("month");
  const daysInMonth = currentMonth.daysInMonth();
  const startDayOfWeek = (startOfMonth.day() + 6) % 7; // Monday = 0

  const calendarDays: Array<{
    dateStr: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isDisabled: boolean;
    isToday: boolean;
    isSelected: boolean;
  }> = [];

  // Previous month padding days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = startOfMonth.subtract(i + 1, "day");
    const dateStr = d.format("YYYY-MM-DD");
    const isDisabled =
      (minDayjs ? d.isBefore(minDayjs, "day") : false) ||
      (maxDayjs ? d.isAfter(maxDayjs, "day") : false);

    calendarDays.push({
      dateStr,
      dayNumber: d.date(),
      isCurrentMonth: false,
      isDisabled,
      isToday: d.isSame(today, "day"),
      isSelected: selectedFormatted === dateStr,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = startOfMonth.date(i);
    const dateStr = d.format("YYYY-MM-DD");
    const isDisabled =
      (minDayjs ? d.isBefore(minDayjs, "day") : false) ||
      (maxDayjs ? d.isAfter(maxDayjs, "day") : false);

    calendarDays.push({
      dateStr,
      dayNumber: i,
      isCurrentMonth: true,
      isDisabled,
      isToday: d.isSame(today, "day"),
      isSelected: selectedFormatted === dateStr,
    });
  }

  // Next month padding days to complete grid row
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  const lastOfMonth = startOfMonth.date(daysInMonth);
  for (let i = 1; i <= remaining; i++) {
    const d = lastOfMonth.add(i, "day");
    const dateStr = d.format("YYYY-MM-DD");
    const isDisabled =
      (minDayjs ? d.isBefore(minDayjs, "day") : false) ||
      (maxDayjs ? d.isAfter(maxDayjs, "day") : false);

    calendarDays.push({
      dateStr,
      dayNumber: d.date(),
      isCurrentMonth: false,
      isDisabled,
      isToday: d.isSame(today, "day"),
      isSelected: selectedFormatted === dateStr,
    });
  }

  // Relative badge text
  let relativeBadge: string | null = null;
  if (selectedDayjs?.isValid()) {
    const diffDays = selectedDayjs.startOf("day").diff(today, "day");
    if (diffDays === 0) relativeBadge = "Hoy";
    else if (diffDays === 1) relativeBadge = "Mañana";
    else if (diffDays === 2) relativeBadge = "Pasado mañana";
    else if (diffDays > 2 && diffDays <= 30) relativeBadge = `En ${diffDays} días`;
    else if (diffDays < 0) relativeBadge = `Hace ${Math.abs(diffDays)} días`;
  }

  // Full Spanish display name
  const formattedDisplay = selectedDayjs?.isValid()
    ? selectedDayjs.format("dddd, D [de] MMMM [de] YYYY")
    : null;

  // Check if prev button should be disabled
  const canGoPrev = minDayjs
    ? !currentMonth.subtract(1, "month").endOf("month").isBefore(minDayjs, "day")
    : true;

  return (
    <div ref={containerRef} className={cn("relative w-full space-y-2", className)}>
      {/* Trigger Button (if not strictly inline) */}
      {!inline && (
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border bg-white text-left transition-all cursor-pointer shadow-2xs group",
            isOpen
              ? "border-amber-500 ring-2 ring-amber-500/20 shadow-xs"
              : "border-stone-300 hover:border-stone-400",
            disabled && "opacity-50 cursor-not-allowed bg-stone-50"
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                "p-2 rounded-lg shrink-0 transition-colors",
                selectedDayjs?.isValid()
                  ? "bg-amber-100 text-amber-700"
                  : "bg-stone-100 text-stone-500 group-hover:text-stone-700"
              )}
            >
              <CalendarIcon className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              {formattedDisplay ? (
                <div>
                  <div className="text-sm font-semibold text-stone-900 capitalize truncate">
                    {formattedDisplay}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Fecha de entrega acordada
                  </div>
                </div>
              ) : (
                <span className="text-sm text-stone-400 font-normal">
                  {placeholder}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {relativeBadge && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {relativeBadge}
              </span>
            )}
            {selectedDayjs?.isValid() && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                className="p-1 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                title="Borrar fecha"
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
            <ChevronDown
              className={cn(
                "w-4 h-4 text-stone-400 transition-transform duration-200",
                isOpen && "rotate-180 text-amber-600"
              )}
            />
          </div>
        </button>
      )}

      {/* Quick Presets Bar */}
      {showQuickPresets && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Atajo:
          </span>
          {presets.map((preset) => {
            const targetDate = today.add(preset.days, "day").format("YYYY-MM-DD");
            const isSelected = selectedFormatted === targetDate;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectDate(targetDate)}
                disabled={disabled}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  isSelected
                    ? "bg-amber-600 text-white shadow-2xs"
                    : "bg-stone-100/80 text-stone-700 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-stone-200/80"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Dropdown / Inline Calendar Card */}
      {(isOpen || inline) && (
        <div
          className={cn(
            "bg-white rounded-2xl border border-stone-200/90 shadow-lg p-4 space-y-3 animate-in fade-in-0 zoom-in-98 duration-150",
            !inline && "relative z-30"
          )}
        >
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={!canGoPrev}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-sm font-bold text-stone-900 capitalize tracking-tight">
                {currentMonth.format("MMMM YYYY")}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((day) => (
              <span
                key={day}
                className="text-[11px] font-bold text-stone-400 uppercase py-1"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((d, idx) => {
              return (
                <button
                  key={`${d.dateStr}-${idx}`}
                  type="button"
                  disabled={d.isDisabled}
                  onClick={() => handleSelectDate(d.dateStr)}
                  className={cn(
                    "h-9 w-full rounded-xl text-xs font-medium flex items-center justify-center transition-all cursor-pointer relative",
                    // Disabled
                    d.isDisabled &&
                      "text-stone-300 opacity-40 cursor-not-allowed pointer-events-none",
                    // Outside current month
                    !d.isCurrentMonth &&
                      !d.isDisabled &&
                      "text-stone-400 hover:bg-stone-50",
                    // Current month selectable
                    d.isCurrentMonth &&
                      !d.isDisabled &&
                      !d.isSelected &&
                      "text-stone-800 hover:bg-amber-50 hover:text-amber-900 hover:font-bold",
                    // Today outline
                    d.isToday &&
                      !d.isSelected &&
                      "border border-amber-400 font-bold text-amber-900 bg-amber-50/40",
                    // Selected
                    d.isSelected &&
                      "bg-amber-600 text-white font-bold shadow-sm shadow-amber-600/30 scale-105 z-10 hover:bg-amber-700"
                  )}
                >
                  {d.dayNumber}
                  {d.isToday && !d.isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 bg-amber-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer with Helper info */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 px-1">
            <span>
              {selectedFormatted ? (
                <span className="text-stone-700 font-medium">
                  Seleccionado: <strong className="text-amber-700 font-bold">{dayjs(selectedFormatted).format("DD/MM/YYYY")}</strong>
                </span>
              ) : (
                "Elige una fecha para coordinar"
              )}
            </span>
            <button
              type="button"
              onClick={() => handleSelectDate(today.format("YYYY-MM-DD"))}
              className="text-amber-700 hover:text-amber-800 font-bold hover:underline cursor-pointer"
            >
              Seleccionar Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
