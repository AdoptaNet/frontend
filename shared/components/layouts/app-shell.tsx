"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  FileText,
  User,
  LayoutDashboard,
  PawPrint,
  ClipboardCheck,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/modules/auth/store/auth.store";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isShelter = user?.role === "shelter";

  // Desktop Navigation items
  const desktopNav = isShelter
    ? [
        { href: "/home", label: "Panel", icon: LayoutDashboard },
        { href: "/pets", label: "Mascotas", icon: PawPrint },
        { href: "/applications", label: "Solicitudes", icon: FileText },
        { href: "/follow-up", label: "Seguimiento", icon: ClipboardCheck },
      ]
    : [
        { href: "/home", label: "Inicio", icon: Home },
        { href: "/pets", label: "Explorar", icon: Search },
        { href: "/applications", label: "Solicitudes", icon: FileText },
        { href: "/messages", label: "Mensajes", icon: MessageSquare },
      ];

  // Mobile Bottom Navigation items (4 destinations with labels always visible)
  const mobileNav = isShelter
    ? [
        { href: "/home", label: "Panel", icon: LayoutDashboard },
        { href: "/pets", label: "Mascotas", icon: PawPrint },
        { href: "/applications", label: "Solicitudes", icon: FileText },
        { href: "/profile", label: "Perfil", icon: User },
      ]
    : [
        { href: "/home", label: "Para ti", icon: Home },
        { href: "/pets", label: "Explorar", icon: Search },
        { href: "/applications", label: "Solicitudes", icon: FileText },
        { href: "/profile", label: "Perfil", icon: User },
      ];

  const displayName = user?.fullName || (isShelter ? "Albergue" : "Usuario");
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-fondo text-tinta-900">
      {/* ---------- HEADER DE ESCRITORIO (>= 768px) ---------- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-line shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/home" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-verde-700 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <PawPrint className="w-5 h-5 fill-current" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-verde-700">
              Adopta<span className="text-ambar-500">Net</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {desktopNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-verde-50 text-verde-700 font-semibold shadow-2xs"
                      : "text-tinta-600 hover:text-tinta-900 hover:bg-superficie-2"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-verde-700" : "text-tinta-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: User Menu */}
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className={`flex items-center gap-2.5 p-1.5 pl-2 rounded-full border transition-all ${
                pathname === "/profile"
                  ? "border-verde-700 bg-verde-50 ring-2 ring-verde-500/20"
                  : "border-line bg-white hover:border-verde-500"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-verde-700 text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                {user?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span>{initials || "AN"}</span>
                )}
              </div>
              <span className="text-xs font-semibold text-tinta-900 hidden sm:inline pr-2 truncate max-w-[120px]">
                {displayName}
              </span>
            </Link>

            <button
              type="button"
              onClick={logout}
              title="Cerrar sesión"
              className="hidden md:flex p-2 rounded-lg text-tinta-400 hover:text-coral-600 hover:bg-coral-100/50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ---------- MAIN CONTENT WRAPPER ---------- */}
      <main className="flex-1 pb-20 md:pb-10">
        {children}
      </main>

      {/* ---------- BARRA DE NAVEGACIÓN INFERIOR (MÓVIL < 768px) ---------- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-line pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg">
        <div className="grid grid-cols-4 h-16 items-center px-1">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all ${
                  isActive
                    ? "text-verde-700 font-semibold"
                    : "text-tinta-400 hover:text-tinta-600"
                }`}
              >
                <div
                  className={`p-1 rounded-full transition-colors ${
                    isActive ? "bg-verde-50" : "bg-transparent"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] leading-tight mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
