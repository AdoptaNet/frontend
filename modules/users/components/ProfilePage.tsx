"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Shield,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader2,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PersonalDataForm } from "./PersonalDataForm";
import { SecurityForm } from "./SecurityForm";
import { AdopterProfileForm } from "./AdopterProfileForm";
import { ShelterProfileForm } from "./ShelterProfileForm";
import { useProfile } from "../hooks/useProfile";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { authService } from "@/modules/auth/services/auth.service";

export function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const {
    user,
    role,
    isInitialLoading,
    isSaving,
    feedback,
    updatePersonalData,
    updateAvatar,
    removeAvatar,
    changePassword,
    updateAdopterProfile,
    updateShelterProfile,
  } = useProfile();

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<string>(() => {
    return tabParam && ["personal", "security", "role-specific"].includes(tabParam)
      ? tabParam
      : "personal";
  });
  const [prevTabParam, setPrevTabParam] = useState(tabParam);

  if (tabParam !== prevTabParam) {
    setPrevTabParam(tabParam);
    if (tabParam && ["personal", "security", "role-specific"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    logout();
    router.push("/login");
  };

  const isPersonalActive = activeTab === "personal";
  const isSecurityActive = activeTab === "security";
  const isRoleActive = activeTab === "role-specific";

  if (isInitialLoading && !user) {
    return (
      <div className="w-full max-w-5xl mx-auto py-24 px-4 sm:px-6 flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-verde-700" />
        <p className="text-sm font-medium text-tinta-600">Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full max-w-5xl mx-auto py-24 px-4 sm:px-6 text-center">
        <AlertCircle className="w-10 h-10 text-coral-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-tinta-900">No se pudo cargar la información del perfil</h2>
        <p className="text-sm text-tinta-600 mt-1">Por favor verifica tu sesión e intenta recargar la página.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6">


      {/* Global Feedback Banner */}
      {feedback.message && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 transition-all duration-200 shadow-xs ${
            feedback.type === "success"
              ? "bg-verde-50 border-verde-200 text-verde-900"
              : feedback.type === "error"
              ? "bg-coral-100 border-coral-600/30 text-coral-600"
              : "bg-superficie-2 border-line text-tinta-900"
          }`}
        >
          {feedback.type === "success" && (
            <CheckCircle2 className="w-5 h-5 text-verde-700 shrink-0" />
          )}
          {feedback.type === "error" && (
            <AlertCircle className="w-5 h-5 text-coral-600 shrink-0" />
          )}
          {feedback.type === "info" && (
            <Info className="w-5 h-5 text-verde-700 shrink-0" />
          )}
          <span className="text-sm font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-tinta-900">
            Mi Perfil y Ajustes
          </h1>
          <p className="text-sm text-tinta-600 mt-1">
            Administra tus datos de cuenta, seguridad y configuración personalizada en AdoptaNet.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          {role === "shelter" && user.id && (
            <Link
              href={`/shelters/${user.id}`}
              target="_blank"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className:
                  "text-xs h-9 border-line gap-1.5",
              })}
            >
              <ExternalLink className="w-3.5 h-3.5 text-verde-700" />
              <span>Ver mi ficha pública</span>
            </Link>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-xs h-9 border-coral-200 text-coral-600 hover:bg-coral-50 hover:text-coral-700 gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar sesión</span>
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as string)}
        className="w-full space-y-6"
      >

            <TabsList className="bg-superficie border border-line p-1 rounded-xl !h-auto min-h-[48px] w-full sm:w-auto flex flex-wrap items-center gap-1 shadow-2xs">
              <TabsTrigger
                value="personal"
                className={`flex items-center gap-2 !h-10 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isPersonalActive
                    ? "!bg-verde-700 !text-white hover:!bg-verde-hover hover:!text-white shadow-xs"
                    : "text-tinta-600 hover:text-tinta-900 hover:bg-superficie-2"
                }`}
              >
                <User className={`w-4 h-4 ${isPersonalActive ? "text-white" : "text-tinta-400"}`} />
                <span>Datos personales</span>
              </TabsTrigger>

              <TabsTrigger
                value="security"
                className={`flex items-center gap-2 !h-10 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSecurityActive
                    ? "!bg-verde-700 !text-white hover:!bg-verde-hover hover:!text-white shadow-xs"
                    : "text-tinta-600 hover:text-tinta-900 hover:bg-superficie-2"
                }`}
              >
                <Shield className={`w-4 h-4 ${isSecurityActive ? "text-white" : "text-tinta-400"}`} />
                <span>Seguridad</span>
              </TabsTrigger>

              {role === "adopter" ? (
                <TabsTrigger
                  value="role-specific"
                  className={`flex items-center gap-2 !h-10 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isRoleActive
                      ? "!bg-verde-700 !text-white hover:!bg-verde-hover hover:!text-white shadow-xs"
                      : "text-tinta-600 hover:text-tinta-900 hover:bg-superficie-2"
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${isRoleActive ? "text-white" : "text-ambar-500"}`} />
                  <span>Preferencias de adopción</span>
                  {!user.adopterProfile?.isSurveyCompleted &&
                    !user.adopterProfile?.housingType && (
                      <span
                        className="w-2 h-2 rounded-full bg-ambar-500 shrink-0"
                        title="Cuestionario pendiente"
                      />
                    )}
                </TabsTrigger>
              ) : (
                <TabsTrigger
                  value="role-specific"
                  className={`flex items-center gap-2 !h-10 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isRoleActive
                      ? "!bg-verde-700 !text-white hover:!bg-verde-hover hover:!text-white shadow-xs"
                      : "text-tinta-600 hover:text-tinta-900 hover:bg-superficie-2"
                  }`}
                >
                  <Building2 className={`w-4 h-4 ${isRoleActive ? "text-white" : "text-tinta-400"}`} />
                  <span>Datos del albergue</span>
                </TabsTrigger>
              )}
            </TabsList>


        {/* Tab 1: Datos Personales */}
        <TabsContent value="personal" className="mt-0 focus-visible:outline-none">
          <PersonalDataForm
            key={user.id + (user.fullName ?? "")}
            user={user}
            onUpdatePersonalData={updatePersonalData}
            onUploadAvatar={updateAvatar}
            onRemoveAvatar={removeAvatar}
            isLoading={isSaving}
          />
        </TabsContent>

        {/* Tab 2: Seguridad */}
        <TabsContent value="security" className="mt-0 focus-visible:outline-none">
          <SecurityForm
            user={user}
            onChangePassword={changePassword}
            isLoading={isSaving}
          />
        </TabsContent>

        {/* Tab 3: Rol Específico */}
        <TabsContent value="role-specific" className="mt-0 focus-visible:outline-none">
          {role === "adopter" ? (
            <AdopterProfileForm
              key={`${user.adopterProfile?.id}-${Boolean(user.adopterProfile?.housingType)}`}
              profile={user.adopterProfile}
              onSave={updateAdopterProfile}
              isLoading={isSaving}
            />
          ) : (
            <ShelterProfileForm
              key={user.shelterProfile?.id || "new-shelter"}
              profile={user.shelterProfile}
              onSave={updateShelterProfile}
              isLoading={isSaving}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
