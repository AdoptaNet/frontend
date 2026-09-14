"use client";

import { useState } from "react";
import {
  User,
  Shield,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DevRoleSwitcher } from "./DevRoleSwitcher";
import { PersonalDataForm } from "./PersonalDataForm";
import { SecurityForm } from "./SecurityForm";
import { AdopterProfileForm } from "./AdopterProfileForm";
import { ShelterProfileForm } from "./ShelterProfileForm";
import { useProfile } from "../hooks/useProfile";

export function ProfilePage() {
  const {
    user,
    role,
    isLoading,
    feedback,
    setMockRole,
    updatePersonalData,
    updateAvatar,
    removeAvatar,
    changePassword,
    updateAdopterProfile,
    updateShelterProfile,
  } = useProfile();

  const [activeTab, setActiveTab] = useState<string>("personal");

  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6">
      {/* Dev Mode Switcher */}
      <DevRoleSwitcher currentRole={role} onRoleChange={setMockRole} />

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
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-tinta-900">
            Mi Perfil y Ajustes
          </h1>
          <p className="text-sm text-tinta-600 mt-1">
            Administra tus datos de cuenta, seguridad y configuración personalizada en AdoptaNet.
          </p>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as string)}
        className="w-full space-y-6"
      >
        <TabsList className="bg-superficie border border-line p-1 rounded-xl h-auto flex flex-wrap gap-1 shadow-2xs">
          <TabsTrigger
            value="personal"
            className="flex items-center gap-2 h-10 px-4 rounded-lg text-xs sm:text-sm font-semibold data-active:bg-verde-700 data-active:text-white cursor-pointer transition-all"
          >
            <User className="w-4 h-4" />
            <span>Datos personales</span>
          </TabsTrigger>

          <TabsTrigger
            value="security"
            className="flex items-center gap-2 h-10 px-4 rounded-lg text-xs sm:text-sm font-semibold data-active:bg-verde-700 data-active:text-white cursor-pointer transition-all"
          >
            <Shield className="w-4 h-4" />
            <span>Seguridad</span>
          </TabsTrigger>

          {role === "adopter" ? (
            <TabsTrigger
              value="role-specific"
              className="flex items-center gap-2 h-10 px-4 rounded-lg text-xs sm:text-sm font-semibold data-active:bg-verde-700 data-active:text-white cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-ambar-500 data-[state=active]:text-white" />
              <span>Preferencias de adopción</span>
            </TabsTrigger>
          ) : (
            <TabsTrigger
              value="role-specific"
              className="flex items-center gap-2 h-10 px-4 rounded-lg text-xs sm:text-sm font-semibold data-active:bg-verde-700 data-active:text-white cursor-pointer transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>Datos del albergue</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab 1: Datos Personales */}
        <TabsContent value="personal" className="mt-0 focus-visible:outline-none">
          <PersonalDataForm
            user={user}
            onUpdatePersonalData={updatePersonalData}
            onUploadAvatar={updateAvatar}
            onRemoveAvatar={removeAvatar}
            isLoading={isLoading}
          />
        </TabsContent>

        {/* Tab 2: Seguridad */}
        <TabsContent value="security" className="mt-0 focus-visible:outline-none">
          <SecurityForm
            onChangePassword={changePassword}
            isLoading={isLoading}
          />
        </TabsContent>

        {/* Tab 3: Rol Específico */}
        <TabsContent value="role-specific" className="mt-0 focus-visible:outline-none">
          {role === "adopter" ? (
            <AdopterProfileForm
              profile={user.adopterProfile}
              onSave={updateAdopterProfile}
              isLoading={isLoading}
            />
          ) : (
            <ShelterProfileForm
              profile={user.shelterProfile}
              onSave={updateShelterProfile}
              isLoading={isLoading}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
