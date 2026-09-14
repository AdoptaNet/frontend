export const ENV = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Adoptanet",
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
} as const;
