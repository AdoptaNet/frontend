import { PlaceholderPage } from "@/shared/components/PlaceholderPage";
import { Search } from "lucide-react";

export const metadata = {
  title: "Explorar Mascotas — AdoptaNet",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Catálogo de Mascotas"
      description="Explora perros y gatos disponibles para adopción en diferentes albergues del Perú con filtros avanzados por tamaño, edad y compatibilidad."
      icon={<Search className="w-8 h-8" />}
    />
  );
}
