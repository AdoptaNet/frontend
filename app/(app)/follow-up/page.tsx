import { PlaceholderPage } from "@/shared/components/PlaceholderPage";
import { ClipboardCheck } from "lucide-react";

export const metadata = {
  title: "Seguimiento — AdoptaNet",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Seguimiento Post-Adopción"
      description="Monitorea la adaptación de los animales adoptados a los 30, 90 y 180 días con fotos periódicas y reportes de bienestar."
      icon={<ClipboardCheck className="w-8 h-8" />}
    />
  );
}
