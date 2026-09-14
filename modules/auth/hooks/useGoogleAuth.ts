"use client";

import { useState } from "react";
import { ENV } from "@/shared/config/env";
import { API_ROUTES } from "@/shared/config/api-routes";

export function useGoogleAuth() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const startGoogleAuth = () => {
    setIsRedirecting(true);
    const backendGoogleUrl = `${ENV.API_URL}${API_ROUTES.AUTH.GOOGLE}`;
    window.location.href = backendGoogleUrl;
  };

  return {
    startGoogleAuth,
    isRedirecting,
  };
}
