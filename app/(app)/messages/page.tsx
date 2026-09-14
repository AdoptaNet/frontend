import { PlaceholderPage } from "@/shared/components/PlaceholderPage";
import { MessageSquare } from "lucide-react";

export const metadata = {
  title: "Mensajes — AdoptaNet",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Mensajes y Conversaciones"
      description="Chatea en tiempo real con los albergues y adoptantes para coordinar visitas, resolver dudas y gestionar la entrega responsable."
      icon={<MessageSquare className="w-8 h-8" />}
    />
  );
}
