import { PlaceholderPage } from "@/shared/components/PlaceholderPage";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Solicitudes — AdoptaNet",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Bandeja de Solicitudes"
      description="Haz seguimiento a tus solicitudes de adopción enviadas o administra las solicitudes entrantes que reciben tus animales rescatados."
      icon={<FileText className="w-8 h-8" />}
    />
  );
}
