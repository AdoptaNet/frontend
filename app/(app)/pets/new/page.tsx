import { RoleGuard } from "@/shared/components/guards/role-guard";
import { PetFormWizard } from "@/modules/pets/components/wizard/PetFormWizard";

export const metadata = {
  title: "Registrar Mascota — AdoptaNet",
};

export default function NewPetPage() {
  return (
    <RoleGuard allowedRole="shelter" fallbackUrl="/pets">
      <PetFormWizard />
    </RoleGuard>
  );
}
