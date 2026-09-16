import { RoleGuard } from "@/shared/components/guards/role-guard";
import { EditPetPage } from "@/modules/pets/components/wizard/EditPetPage";

export const metadata = {
  title: "Editar Ficha de Mascota — AdoptaNet",
};

interface EditPetRouteProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: EditPetRouteProps) {
  const { id } = await params;

  return (
    <RoleGuard allowedRole="shelter" fallbackUrl="/pets">
      <EditPetPage petId={id} />
    </RoleGuard>
  );
}
