"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  LogIn,
  UserPlus,
  ShieldCheck,
  Cpu,
  Activity,
  Building2,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { authService } from "@/modules/auth/services/auth.service";
import { messagesService } from "@/modules/messages/services/messages.service";
import { MessageNotificationToast } from "@/modules/messages/components/MessageNotificationToast";
import { UserAvatar } from "@/shared/components/UserAvatar";

interface AppShellProps {
  children: React.ReactNode;
}

function NavLinks({
  desktopNav,
  isAdmin,
  unreadCount,
}: {
  desktopNav: Array<{ href: string; label: string; icon: any; tooltip?: string }>;
  isAdmin: boolean;
  unreadCount: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isItemActive = (href: string) => {
    if (isAdmin) {
      if (href.includes("?tab=")) {
        const tab = href.split("?tab=")[1];
        const activeTab = searchParams.get("tab") || "kpis";
        return pathname.startsWith("/admin") && activeTab === tab;
      }
      return pathname === href;
    }
    return href === "/"
      ? pathname === "/"
      : pathname === href ||
          (href !== "/home" && pathname.startsWith(`${href}/`));
  };

  return (
    <nav className="hidden md:flex items-center gap-1">
      {desktopNav.map((item) => {
        const Icon = item.icon;
        const isActive = isItemActive(item.href);

        const linkContent = (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "bg-verde-50 text-verde-700 font-semibold shadow-2xs"
                : "text-tinta-600 hover:text-tinta-900 hover:bg-superficie-2"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive ? "text-verde-700" : "text-tinta-400"
              }`}
            />
            <span>{item.label}</span>
            {item.href === "/messages" && unreadCount > 0 && (
              <span className="ml-1 bg-verde-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                {unreadCount}
              </span>
            )}
          </Link>
        );

        if (item.tooltip) {
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger>{linkContent}</TooltipTrigger>
              <TooltipContent className="text-xs p-2.5 max-w-xs leading-relaxed bg-tinta-900 text-white rounded-lg shadow-md">
                {item.tooltip}
              </TooltipContent>
            </Tooltip>
          );
        }

        return linkContent;
      })}
    </nav>
  );
}

function MobileNavLinks({
  mobileNav,
  isAdmin,
}: {
  mobileNav: Array<{ href: string; label: string; icon: any }>;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isItemActive = (href: string) => {
    if (isAdmin) {
      if (href.includes("?tab=")) {
        const tab = href.split("?tab=")[1];
        const activeTab = searchParams.get("tab") || "kpis";
        return pathname.startsWith("/admin") && activeTab === tab;
      }
      return pathname === href;
    }
    return href === "/"
      ? pathname === "/"
      : pathname === href ||
          (href !== "/home" && pathname.startsWith(href));
  };

  return (
    <div className="grid grid-cols-4 h-16 items-center px-1">
      {mobileNav.map((item) => {
        const Icon = item.icon;
        const isActive = isItemActive(item.href);

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
  );
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout: storeLogout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    storeLogout();
    if (
      pathname === "/pets" ||
      (pathname.startsWith("/pets/") &&
        !pathname.endsWith("/new") &&
        !pathname.endsWith("/edit"))
    ) {
      router.refresh();
    } else {
      router.push("/login");
    }
  };

  const isAdmin = user?.role === "admin";
  const isShelter = user?.role === "shelter";

  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    if (!user || isAdmin) return;
    let isSubscribed = true;
    const fetchUnread = async () => {
      try {
        const res = await messagesService.getUnreadCount();
        if (isSubscribed) setUnreadCount(res.unreadCount);
      } catch {
        // ignore
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [user, isAdmin]);

  // Desktop Navigation items
  const desktopNav = user
    ? isAdmin
      ? [
          {
            href: "/admin/dashboard?tab=kpis",
            label: "KPIs de Adopción",
            icon: LayoutDashboard,
            tooltip: "Métricas consolidadas de mascotas, efectividad de adopciones y embudo",
          },
          {
            href: "/admin/dashboard?tab=ml",
            label: "Telemetría ML",
            icon: Cpu,
            tooltip: "Métricas de interacción, CTR, conversión y ratio híbrido vs fallback",
          },
          {
            href: "/admin/dashboard?tab=health",
            label: "Salud de Servicios",
            icon: Activity,
            tooltip: "Sondas de conectividad y latencias para PostgreSQL, Socket.io y FastAPI ML",
          },
          {
            href: "/admin/dashboard?tab=shelters",
            label: "Albergues",
            icon: Building2,
            tooltip: "Directorio de albergues registrados y acreditación comunitaria",
          },
        ]
      : isShelter
      ? [
          { href: "/home", label: "Panel", icon: LayoutDashboard },
          { href: "/pets", label: "Mascotas", icon: PawPrint },
          { href: "/applications", label: "Solicitudes", icon: FileText },
          { href: "/messages", label: "Mensajes", icon: MessageSquare },
          { href: "/follow-up", label: "Seguimiento", icon: ClipboardCheck },
        ]
      : [
          { href: "/home", label: "Inicio", icon: Home },
          { href: "/pets", label: "Explorar", icon: Search },
          { href: "/applications", label: "Solicitudes", icon: FileText },
          { href: "/messages", label: "Mensajes", icon: MessageSquare },
        ]
    : [
        { href: "/", label: "Inicio", icon: Home },
        { href: "/pets", label: "Explorar Mascotas", icon: Search },
      ];

  // Mobile Bottom Navigation items (4 destinations with labels always visible)
  const mobileNav = user
    ? isAdmin
      ? [
          {
            href: "/admin/dashboard?tab=kpis",
            label: "KPIs",
            icon: LayoutDashboard,
          },
          {
            href: "/admin/dashboard?tab=ml",
            label: "ML",
            icon: Cpu,
          },
          {
            href: "/admin/dashboard?tab=health",
            label: "Salud",
            icon: Activity,
          },
          {
            href: "/admin/dashboard?tab=shelters",
            label: "Albergues",
            icon: Building2,
          },
        ]
      : isShelter
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
        ]
    : [
        { href: "/", label: "Inicio", icon: Home },
        { href: "/pets", label: "Explorar", icon: Search },
        { href: "/login", label: "Acceder", icon: LogIn },
        { href: "/register", label: "Registro", icon: UserPlus },
      ];

  const displayName =
    user?.fullName ||
    (isAdmin ? "Administrador" : isShelter ? "Albergue" : "Usuario");

  const brandHref = user ? (isAdmin ? "/admin/dashboard" : "/home") : "/";

  return (
    <div className="min-h-screen flex flex-col bg-fondo text-tinta-900">
      {/* ---------- HEADER DE ESCRITORIO (>= 768px) ---------- */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-xs transition-colors ${
          isAdmin
            ? "bg-white/95 border-neutral-200"
            : "bg-white/95 border-line"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href={brandHref} className="flex items-center gap-2.5 group">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                isAdmin
                  ? "bg-neutral-900 text-emerald-400"
                  : "bg-verde-700 text-white"
              }`}
            >
              {isAdmin ? (
                <ShieldCheck className="w-5 h-5 fill-current" />
              ) : (
                <PawPrint className="w-5 h-5 fill-current" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-tight text-verde-700">
                Adopta<span className="text-ambar-500">Net</span>
              </span>
              {isAdmin && (
                <Tooltip>
                  <TooltipTrigger>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-neutral-900 text-emerald-400 border border-neutral-700 cursor-help">
                      Admin
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs p-2 max-w-xs bg-tinta-900 text-white rounded-lg shadow-md">
                    Sesión activa con rol de Administrador de AdoptaNet
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <Suspense
            fallback={<div className="hidden md:flex h-8 w-64 animate-pulse" />}
          >
            <NavLinks
              desktopNav={desktopNav}
              isAdmin={isAdmin}
              unreadCount={unreadCount}
            />
          </Suspense>

          {/* Right Action: User Menu or Auth Buttons */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className={`flex items-center gap-2.5 p-1.5 pl-2 rounded-full border transition-all ${
                    pathname === "/profile"
                      ? "border-verde-700 bg-verde-50 ring-2 ring-verde-500/20"
                      : "border-line bg-white hover:border-verde-500"
                  }`}
                >
                  <UserAvatar
                    src={user.avatarUrl}
                    name={displayName}
                    sizeClassName="w-7 h-7"
                    textClassName="text-[10px] font-bold text-verde-700"
                  />
                  <span className="text-xs font-semibold text-tinta-900 hidden sm:inline pr-2 truncate max-w-[120px]">
                    {displayName}
                  </span>
                  {isAdmin && (
                    <span className="hidden sm:inline-block mr-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-neutral-100 text-neutral-700">
                      Panel
                    </span>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                  className="flex p-2 rounded-lg text-tinta-400 hover:text-coral-600 hover:bg-coral-100/50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href={`/login?redirect=${encodeURIComponent(pathname)}`}
                  className={buttonVariants({
                    variant: "ghost",
                    className:
                      "h-8 sm:h-9 px-2.5 sm:px-3 text-xs font-semibold text-tinta-700 hover:text-verde-700",
                  })}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({
                    className:
                      "h-8 sm:h-9 px-2.5 sm:px-3.5 text-xs font-semibold bg-verde-700 hover:bg-verde-800 text-white shadow-2xs",
                  })}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ---------- MAIN CONTENT WRAPPER ---------- */}
      <main className="flex-1 pb-20 md:pb-10">
        {user && !isAdmin && (
          <React.Suspense fallback={null}>
            <MessageNotificationToast
              onUnreadIncrement={() => setUnreadCount((prev) => prev + 1)}
            />
          </React.Suspense>
        )}
        {children}
      </main>

      {/* ---------- BARRA DE NAVEGACIÓN INFERIOR (MÓVIL < 768px) ---------- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-line pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg">
        <Suspense
          fallback={<div className="h-16 w-full animate-pulse bg-white" />}
        >
          <MobileNavLinks mobileNav={mobileNav} isAdmin={isAdmin} />
        </Suspense>
      </nav>
    </div>
  );
}
