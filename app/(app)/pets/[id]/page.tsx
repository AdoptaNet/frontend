import { PetDetailPage } from "@/modules/pets/components/detail/PetDetailPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Ficha Técnica de Mascota — AdoptaNet",
  description:
    "Conoce las características de salud, comportamiento, historia y galería de esta mascota en adopción responsable.",
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <PetDetailPage petId={id} />;
}
