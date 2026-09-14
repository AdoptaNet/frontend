import { PlaceholderPage } from "@/shared/components/PlaceholderPage";
import { Home } from "lucide-react";

export const metadata = {
  title: "Inicio — AdoptaNet",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Inicio / Panel Principal"
      description="Aquí podrás ver tus recomendaciones personalizadas de animales rescatados o el panel de gestión de tu albergue."
      icon={<Home className="w-8 h-8" />}
    />
  );
}
