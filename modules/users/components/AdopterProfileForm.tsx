"use client";

import { useState } from "react";
import {
  Home,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  Loader2,
  Phone,
  MapPin,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { OptionToggleGroup } from "./OptionToggleGroup";
import type {
  AdopterProfile,
  UpdateAdopterProfileDto,
} from "../models/adopter-profile.types";
import {
  ZoneType,
  HousingType,
  OutdoorSpace,
  TenureType,
  HouseholdSize,
  ChildrenAgeRange,
  AllergyType,
  CurrentPets,
  PetSociability,
  HoursAlone,
  WorkSchedule,
  ActivityLevel,
  WalkTime,
  MonthlyBudget,
  VetBudget,
  ExperienceLevel,
  PreferredSpecies,
  PreferredSize,
  PreferredAge,
  PreferredSex,
  PreferredTemperament,
  FurPreference,
  NoiseTolerance,
  SpecialNeedsAcceptance,
  AdoptionMotivation,
  FollowUpAcceptance,
  AdopterAgeRange,
} from "../models/adopter-profile.types";

const PERU_DEPARTMENTS = [
  "Lima",
  "Arequipa",
  "Cusco",
  "La Libertad",
  "Piura",
  "Lambayeque",
  "Áncash",
  "Junín",
  "Ica",
  "San Martín",
  "Cajamarca",
  "Loreto",
  "Ucayali",
  "Tacna",
  "Huánuco",
  "Ayacucho",
  "Puno",
  "Moquegua",
  "Tumbes",
  "Amazonas",
  "Apurímac",
  "Huancavelica",
  "Madre de Dios",
  "Pasco",
  "Callao",
];

const SECTIONS = [
  { id: 1, label: "1. Vivienda", fullLabel: "Vivienda y Entorno", icon: Home },
  { id: 2, label: "2. Convivencia", fullLabel: "Hogar y Convivencia", icon: Users },
  { id: 3, label: "3. Rutina", fullLabel: "Rutina y Recursos", icon: Clock },
  { id: 4, label: "4. Preferencias", fullLabel: "Preferencias de Mascota", icon: Sparkles },
];

interface AdopterProfileFormProps {
  profile: AdopterProfile | null | undefined;
  onSave: (dto: UpdateAdopterProfileDto) => Promise<void>;
  isLoading?: boolean;
}

export function AdopterProfileForm({
  profile,
  onSave,
  isLoading = false,
}: AdopterProfileFormProps) {
  // El perfil se considera completado si ya tiene registradas las respuestas en la base de datos
  const isProfileCompleted = Boolean(profile && profile.housingType);
  const isNewProfile = !isProfileCompleted;

  const [formData, setFormData] = useState<UpdateAdopterProfileDto>({
    department: profile?.department || "Lima",
    zoneType: profile?.zoneType || ZoneType.URBAN_QUIET,
    housingType: profile?.housingType || HousingType.APARTMENT,
    outdoorSpace: profile?.outdoorSpace || OutdoorSpace.BALCONY,
    isFenced: profile?.isFenced ?? true,
    tenureType: profile?.tenureType || TenureType.OWNED,

    householdSize: profile?.householdSize || HouseholdSize.TWO_THREE,
    childrenAgeRange: profile?.childrenAgeRange || ChildrenAgeRange.NONE,
    hasElderly: profile?.hasElderly ?? false,
    allergyType: profile?.allergyType || AllergyType.NONE,
    currentPets: profile?.currentPets || CurrentPets.NONE,
    currentPetsSociability:
      profile?.currentPetsSociability || PetSociability.NOT_APPLICABLE,

    hoursAlone: profile?.hoursAlone || HoursAlone.TWO_TO_4,
    workSchedule: profile?.workSchedule || WorkSchedule.HYBRID,
    activityLevel: profile?.activityLevel || ActivityLevel.MODERATE,
    walkTime: profile?.walkTime || WalkTime.THIRTY_TO_60,
    monthlyBudget: profile?.monthlyBudget || MonthlyBudget.HUNDRED_TO_200,
    vetBudget: profile?.vetBudget || VetBudget.EMERGENCIES,
    experienceLevel: profile?.experienceLevel || ExperienceLevel.MODERATE,

    preferredSpecies: profile?.preferredSpecies || PreferredSpecies.DOG,
    preferredSize: profile?.preferredSize || PreferredSize.MEDIUM,
    preferredAge: profile?.preferredAge || PreferredAge.YOUNG,
    preferredSex: profile?.preferredSex || PreferredSex.ANY,
    preferredTemperament:
      profile?.preferredTemperament || PreferredTemperament.BALANCED,
    furPreference: profile?.furPreference || FurPreference.SHORT,
    noiseTolerance: profile?.noiseTolerance || NoiseTolerance.MODERATE,
    specialNeedsAcceptance:
      profile?.specialNeedsAcceptance || SpecialNeedsAcceptance.NO,
    sterilizationCommitment: profile?.sterilizationCommitment ?? true,
    adoptionMotivation:
      profile?.adoptionMotivation || AdoptionMotivation.COMPANIONSHIP,
    followUpAcceptance:
      profile?.followUpAcceptance || FollowUpAcceptance.FULLY_ACCEPT,
    adopterAgeRange: profile?.adopterAgeRange || AdopterAgeRange.TWENTY_SIX_TO_35,
    phoneNumber: profile?.phoneNumber || "",
  });

  const [activeSection, setActiveSection] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = <K extends keyof UpdateAdopterProfileDto>(
    field: K,
    value: UpdateAdopterProfileDto[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const progressPercentage = Math.round((activeSection / 4) * 100);

  return (
    <Card className="bg-white border-line shadow-sm">
      <CardHeader className="pb-4 space-y-4">
        {/* Banner de Invitación o Encabezado de Edición */}
        {isNewProfile ? (
          <div className="bg-gradient-to-br from-[#FAF9F6] via-[#EDF5F2] to-[#FDFBF7] border border-verde-200 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ambar-700 bg-ambar-100 px-3 py-1 rounded-full">
                Paso 1 para adoptar
              </span>
              <Badge variant="reason" className="text-[11px] font-semibold">
                Cuestionario pendiente
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-tinta-900 tracking-tight">
              ¿Con qué perro o gato te llevarías mejor?
            </h2>
            <p className="text-xs sm:text-sm text-tinta-600 mt-1 max-w-2xl leading-relaxed">
              Completa este cuestionario de 4 secciones (~3 min) para que nuestro recomendador con IA analice tu espacio y rutina, encontrando a tus mascotas más afines.
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl font-heading text-tinta-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-ambar-500" />
                Preferencias de Adopción y Cuestionario ML
              </CardTitle>
              <CardDescription className="text-sm text-tinta-600 mt-1 max-w-2xl">
                Tus respuestas están activas. Puedes navegar libremente entre secciones para actualizar cualquier dato.
              </CardDescription>
            </div>
            <Badge variant="disponible" className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold self-start sm:self-auto shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Cuestionario completado (100%)
            </Badge>
          </div>
        )}

        {/* Barra de Progreso Motivacional */}
        <div className="w-full bg-superficie-2 border border-line rounded-xl p-3.5 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-verde-700 bg-verde-200/60 px-2 py-0.5 rounded">
                Sección {activeSection} de 4
              </span>
              <span className="text-xs sm:text-sm font-semibold text-tinta-900">
                {SECTIONS[activeSection - 1].fullLabel}
              </span>
            </div>
            <span className="text-xs font-bold text-ambar-700">
              {isNewProfile ? `${progressPercentage}% completado` : "100% configurado"}
            </span>
          </div>

          <div className="w-full h-2.5 bg-line rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out ${
                isNewProfile ? "bg-ambar-500" : "bg-verde-700"
              }`}
              style={{ width: `${isNewProfile ? progressPercentage : 100}%` }}
            />
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-b border-line">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            const isCompleted = activeSection > sec.id || !isNewProfile;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`h-10 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "bg-verde-700 text-white hover:bg-verde-hover hover:text-white shadow-xs"
                    : "text-tinta-600 hover:text-tinta-900 hover:bg-superficie-2"
                }`}
              >
                {isCompleted && !isActive ? (
                  <CheckCircle2 className="w-4 h-4 text-verde-700 shrink-0" />
                ) : (
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-tinta-400"}`} />
                )}
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>


      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-7">
          {/* SECCIÓN 1: VIVIENDA Y UBICACIÓN */}
          {activeSection === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-line">
                <Home className="w-5 h-5 text-verde-700" />
                <h3 className="font-heading font-semibold text-base text-tinta-900">
                  Sección 1 — Vivienda y Entorno
                </h3>
              </div>

              {/* Departamento */}
              <div className="space-y-1.5">
                <Label htmlFor="department" className="text-sm font-semibold text-tinta-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-verde-700" />
                  Departamento del Perú
                </Label>
                <select
                  id="department"
                  value={formData.department || "Lima"}
                  onChange={(e) => updateField("department", e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg border border-line bg-white text-sm text-tinta-900 focus:outline-none focus:ring-2 focus:ring-anillo"
                >
                  {PERU_DEPARTMENTS.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo de Zona */}
              <OptionToggleGroup
                label="Tipo de zona donde vives"
                description="Nos ayuda a identificar el nivel de estímulos y ruidos del vecindario."
                value={formData.zoneType}
                onChange={(val) => updateField("zoneType", val as ZoneType)}
                options={[
                  { value: ZoneType.URBAN_TRAFFIC, label: "Urbana con tráfico", hint: "Avenidas principales" },
                  { value: ZoneType.URBAN_QUIET, label: "Urbana tranquila", hint: "Calles residenciales" },
                  { value: ZoneType.PERIURBAN, label: "Periurbana", hint: "Zonas alejadas" },
                  { value: ZoneType.RURAL, label: "Rural o campo" },
                ]}
              />

              {/* Tipo de Vivienda */}
              <OptionToggleGroup
                label="Tipo de vivienda"
                value={formData.housingType}
                onChange={(val) => updateField("housingType", val as HousingType)}
                options={[
                  { value: HousingType.APARTMENT, label: "Departamento" },
                  { value: HousingType.HOUSE_NO_YARD, label: "Casa sin patio" },
                  { value: HousingType.HOUSE_WITH_YARD, label: "Casa con patio / jardín" },
                  { value: HousingType.QUINTA, label: "Quinta o condominio" },
                ]}
              />

              {/* Espacio exterior */}
              <OptionToggleGroup
                label="Espacio exterior disponible"
                value={formData.outdoorSpace}
                onChange={(val) => updateField("outdoorSpace", val as OutdoorSpace)}
                options={[
                  { value: OutdoorSpace.NONE, label: "Ninguno" },
                  { value: OutdoorSpace.BALCONY, label: "Balcón" },
                  { value: OutdoorSpace.SMALL_YARD, label: "Patio pequeño" },
                  { value: OutdoorSpace.LARGE_GARDEN, label: "Jardín amplio" },
                ]}
              />

              {/* Exterior cercado */}
              <OptionToggleGroup
                label="¿El exterior o las ventanas cuentan con protección segura o rejas?"
                description="Crucial para evitar caídas o escapes accidentales de gatos y perros curiosos."
                value={formData.isFenced ? "yes" : "no"}
                onChange={(val) => updateField("isFenced", val === "yes")}
                options={[
                  { value: "yes", label: "Sí, está cercado de forma segura" },
                  { value: "no", label: "No cuenta con cercado completo" },
                ]}
              />

              {/* Régimen de tenencia */}
              <OptionToggleGroup
                label="Régimen de tenencia del inmueble"
                value={formData.tenureType}
                onChange={(val) => updateField("tenureType", val as TenureType)}
                options={[
                  { value: TenureType.OWNED, label: "Vivienda propia" },
                  { value: TenureType.RENTED_WITH_PERMISSION, label: "Alquilada (con permiso de mascotas)" },
                  { value: TenureType.RENTED_UNCERTAIN, label: "Alquilada (en consulta)" },
                  { value: TenureType.RENTED_NO_PERMISSION, label: "Sin permiso explícito" },
                ]}
              />
            </div>
          )}

          {/* SECCIÓN 2: HOGAR Y CONVIVENCIA */}
          {activeSection === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-line">
                <Users className="w-5 h-5 text-verde-700" />
                <h3 className="font-heading font-semibold text-base text-tinta-900">
                  Sección 2 — Convivencia en el Hogar
                </h3>
              </div>

              {/* Cantidad de personas */}
              <OptionToggleGroup
                label="Personas que habitan en casa"
                value={formData.householdSize}
                onChange={(val) => updateField("householdSize", val as HouseholdSize)}
                options={[
                  { value: HouseholdSize.ALONE, label: "Vivo solo/a" },
                  { value: HouseholdSize.TWO_THREE, label: "2 a 3 personas" },
                  { value: HouseholdSize.FOUR_FIVE, label: "4 a 5 personas" },
                  { value: HouseholdSize.SIX_PLUS, label: "6 a más" },
                ]}
              />

              {/* Rango de edad de niños */}
              <OptionToggleGroup
                label="Presencia de niños en el hogar"
                value={formData.childrenAgeRange}
                onChange={(val) => updateField("childrenAgeRange", val as ChildrenAgeRange)}
                options={[
                  { value: ChildrenAgeRange.NONE, label: "No viven niños" },
                  { value: ChildrenAgeRange.UNDER_5, label: "Menores de 5 años" },
                  { value: ChildrenAgeRange.FIVE_TO_12, label: "De 5 a 12 años" },
                  { value: ChildrenAgeRange.TEENAGERS, label: "Adolescentes (13+)" },
                ]}
              />

              {/* Adultos mayores */}
              <OptionToggleGroup
                label="¿Conviven personas adultas mayores?"
                value={formData.hasElderly ? "yes" : "no"}
                onChange={(val) => updateField("hasElderly", val === "yes")}
                options={[
                  { value: "yes", label: "Sí, viven adultos mayores" },
                  { value: "no", label: "No viven adultos mayores" },
                ]}
              />

              {/* Alergias */}
              <OptionToggleGroup
                label="¿Alguien en casa sufre de alergias a animales?"
                value={formData.allergyType}
                onChange={(val) => updateField("allergyType", val as AllergyType)}
                options={[
                  { value: AllergyType.NONE, label: "Ninguna alergia conocida" },
                  { value: AllergyType.CATS, label: "Alergia a gatos" },
                  { value: AllergyType.DOGS, label: "Alergia a perros" },
                  { value: AllergyType.UNCERTAIN, label: "No lo sabemos con certeza" },
                ]}
              />

              {/* Mascotas actuales */}
              <OptionToggleGroup
                label="Mascotas actuales en casa"
                value={formData.currentPets}
                onChange={(val) => updateField("currentPets", val as CurrentPets)}
                options={[
                  { value: CurrentPets.NONE, label: "No tenemos mascotas" },
                  { value: CurrentPets.DOGS, label: "Solo perros" },
                  { value: CurrentPets.CATS, label: "Solo gatos" },
                  { value: CurrentPets.BOTH, label: "Perros y gatos" },
                ]}
              />

              {/* Sociabilidad de mascotas actuales */}
              <OptionToggleGroup
                label="Sociabilidad de tus mascotas actuales con otros animales"
                value={formData.currentPetsSociability}
                onChange={(val) => updateField("currentPetsSociability", val as PetSociability)}
                options={[
                  { value: PetSociability.NOT_APPLICABLE, label: "No aplica (sin mascotas)" },
                  { value: PetSociability.VERY_SOCIABLE, label: "Muy sociable y juguetón" },
                  { value: PetSociability.SELECTIVE, label: "Selectivo / depende del animal" },
                  { value: PetSociability.NOT_SOCIABLE, label: "Poco sociable / territorial" },
                ]}
              />
            </div>
          )}

          {/* SECCIÓN 3: RUTINA Y RECURSOS */}
          {activeSection === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-line">
                <Clock className="w-5 h-5 text-verde-700" />
                <h3 className="font-heading font-semibold text-base text-tinta-900">
                  Sección 3 — Rutina y Recursos Disponibles
                </h3>
              </div>

              {/* Horas solo */}
              <OptionToggleGroup
                label="Horas continuas que la mascota pasaría sola en un día habitual"
                value={formData.hoursAlone}
                onChange={(val) => updateField("hoursAlone", val as HoursAlone)}
                options={[
                  { value: HoursAlone.LESS_THAN_2, label: "Menos de 2 horas" },
                  { value: HoursAlone.TWO_TO_4, label: "2 a 4 horas" },
                  { value: HoursAlone.FIVE_TO_8, label: "5 a 8 horas" },
                  { value: HoursAlone.MORE_THAN_8, label: "Más de 8 horas" },
                ]}
              />

              {/* Jornada laboral */}
              <OptionToggleGroup
                label="Modalidad de trabajo principal"
                value={formData.workSchedule}
                onChange={(val) => updateField("workSchedule", val as WorkSchedule)}
                options={[
                  { value: WorkSchedule.FROM_HOME, label: "100% Remoto (Home Office)" },
                  { value: WorkSchedule.HYBRID, label: "Híbrido (remoto + presencial)" },
                  { value: WorkSchedule.OUT_ALL_DAY, label: "Presencial fuera todo el día" },
                  { value: WorkSchedule.ROTATING, label: "Turnos rotativos" },
                ]}
              />

              {/* Nivel de actividad */}
              <OptionToggleGroup
                label="Nivel de actividad física de la familia"
                value={formData.activityLevel}
                onChange={(val) => updateField("activityLevel", val as ActivityLevel)}
                options={[
                  { value: ActivityLevel.SEDENTARY, label: "Sedentario / Muy tranquilo" },
                  { value: ActivityLevel.LOW, label: "Bajo (paseos cortos tranquilos)" },
                  { value: ActivityLevel.MODERATE, label: "Moderado (paseos diarios)" },
                  { value: ActivityLevel.ACTIVE, label: "Activo (correr, parques frecuentes)" },
                  { value: ActivityLevel.VERY_ACTIVE, label: "Muy activo (senderismo, deporte)" },
                ]}
              />

              {/* Tiempo de paseo */}
              <OptionToggleGroup
                label="Tiempo diario estimado para paseos y juego"
                value={formData.walkTime}
                onChange={(val) => updateField("walkTime", val as WalkTime)}
                options={[
                  { value: WalkTime.LESS_THAN_15, label: "Menos de 15 min" },
                  { value: WalkTime.FIFTEEN_TO_30, label: "15 a 30 min" },
                  { value: WalkTime.THIRTY_TO_60, label: "30 a 60 min" },
                  { value: WalkTime.MORE_THAN_60, label: "Más de 60 min" },
                ]}
              />

              {/* Presupuesto mensual */}
              <OptionToggleGroup
                label="Presupuesto mensual estimado para alimentación y cuidados"
                value={formData.monthlyBudget}
                onChange={(val) => updateField("monthlyBudget", val as MonthlyBudget)}
                options={[
                  { value: MonthlyBudget.UNDER_50, label: "Menos de S/ 50" },
                  { value: MonthlyBudget.FIFTY_TO_100, label: "S/ 50 - S/ 100" },
                  { value: MonthlyBudget.HUNDRED_TO_200, label: "S/ 100 - S/ 200" },
                  { value: MonthlyBudget.TWO_HUNDRED_TO_300, label: "S/ 200 - S/ 300" },
                  { value: MonthlyBudget.OVER_300, label: "Más de S/ 300" },
                ]}
              />

              {/* Disposición veterinaria */}
              <OptionToggleGroup
                label="Capacidad y disposición para atención veterinaria"
                value={formData.vetBudget}
                onChange={(val) => updateField("vetBudget", val as VetBudget)}
                options={[
                  { value: VetBudget.BASIC, label: "Básico (vacunas y desparasitación)" },
                  { value: VetBudget.EMERGENCIES, label: "Básico + Emergencias imprevistas" },
                  { value: VetBudget.CHRONIC_TREATMENT, label: "Tratamientos continuos o especiales" },
                ]}
              />

              {/* Experiencia previa */}
              <OptionToggleGroup
                label="Experiencia previa con mascotas"
                value={formData.experienceLevel}
                onChange={(val) => updateField("experienceLevel", val as ExperienceLevel)}
                options={[
                  { value: ExperienceLevel.NONE, label: "Ninguna (primera mascota)" },
                  { value: ExperienceLevel.LITTLE, label: "Poca (hace mucho tiempo)" },
                  { value: ExperienceLevel.MODERATE, label: "Moderada (he tenido antes)" },
                  { value: ExperienceLevel.EXPERIENCED, label: "Experimentado/a" },
                ]}
              />
            </div>
          )}

          {/* SECCIÓN 4: PREFERENCIAS PARA EL RECOMENDADOR */}
          {activeSection === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-line">
                <Sparkles className="w-5 h-5 text-ambar-500" />
                <h3 className="font-heading font-semibold text-base text-tinta-900">
                  Sección 4 — Preferencias y Compromisos
                </h3>
              </div>

              {/* Especie */}
              <OptionToggleGroup
                label="Especie de tu preferencia"
                value={formData.preferredSpecies}
                onChange={(val) => updateField("preferredSpecies", val as PreferredSpecies)}
                options={[
                  { value: PreferredSpecies.DOG, label: "Perro" },
                  { value: PreferredSpecies.CAT, label: "Gato" },
                  { value: PreferredSpecies.ANY, label: "Indiferente / Ambos" },
                ]}
              />

              {/* Tamaño */}
              <OptionToggleGroup
                label="Tamaño preferido"
                value={formData.preferredSize}
                onChange={(val) => updateField("preferredSize", val as PreferredSize)}
                options={[
                  { value: PreferredSize.SMALL, label: "Pequeño" },
                  { value: PreferredSize.MEDIUM, label: "Mediano" },
                  { value: PreferredSize.LARGE, label: "Grande" },
                  { value: PreferredSize.ANY, label: "Cualquier tamaño" },
                ]}
              />

              {/* Edad */}
              <OptionToggleGroup
                label="Etapa de vida / Edad preferida"
                value={formData.preferredAge}
                onChange={(val) => updateField("preferredAge", val as PreferredAge)}
                options={[
                  { value: PreferredAge.PUPPY, label: "Cachorro" },
                  { value: PreferredAge.YOUNG, label: "Joven" },
                  { value: PreferredAge.ADULT, label: "Adulto" },
                  { value: PreferredAge.SENIOR, label: "Senior / Abuelito" },
                  { value: PreferredAge.ANY, label: "Indiferente" },
                ]}
              />

              {/* Sexo */}
              <OptionToggleGroup
                label="Sexo preferido"
                value={formData.preferredSex}
                onChange={(val) => updateField("preferredSex", val as PreferredSex)}
                options={[
                  { value: PreferredSex.MALE, label: "Macho" },
                  { value: PreferredSex.FEMALE, label: "Hembra" },
                  { value: PreferredSex.ANY, label: "Indiferente" },
                ]}
              />

              {/* Temperamento */}
              <OptionToggleGroup
                label="Temperamento buscado"
                value={formData.preferredTemperament}
                onChange={(val) => updateField("preferredTemperament", val as PreferredTemperament)}
                options={[
                  { value: PreferredTemperament.CALM, label: "Tranquilo y relajado" },
                  { value: PreferredTemperament.BALANCED, label: "Equilibrado" },
                  { value: PreferredTemperament.ACTIVE, label: "Enérgico y juguetón" },
                ]}
              />

              {/* Pelaje */}
              <OptionToggleGroup
                label="Preferencia de pelaje"
                value={formData.furPreference}
                onChange={(val) => updateField("furPreference", val as FurPreference)}
                options={[
                  { value: FurPreference.SHORT, label: "Corto" },
                  { value: FurPreference.LONG, label: "Largo" },
                  { value: FurPreference.HAIRLESS, label: "Sin pelo / hipoalergénico" },
                  { value: FurPreference.ANY, label: "Indiferente" },
                ]}
              />

              {/* Tolerancia al ruido */}
              <OptionToggleGroup
                label="Tolerancia a ladridos o maullidos frecuentes"
                value={formData.noiseTolerance}
                onChange={(val) => updateField("noiseTolerance", val as NoiseTolerance)}
                options={[
                  { value: NoiseTolerance.LOW, label: "Baja (prefiero silencio)" },
                  { value: NoiseTolerance.MODERATE, label: "Moderada" },
                  { value: NoiseTolerance.HIGH, label: "Alta (no me incomoda)" },
                ]}
              />

              {/* Necesidades especiales */}
              <OptionToggleGroup
                label="Aceptación de mascotas con necesidades especiales"
                value={formData.specialNeedsAcceptance}
                onChange={(val) => updateField("specialNeedsAcceptance", val as SpecialNeedsAcceptance)}
                options={[
                  { value: SpecialNeedsAcceptance.NO, label: "No por ahora" },
                  { value: SpecialNeedsAcceptance.CHRONIC, label: "Tratamiento médico leve" },
                  { value: SpecialNeedsAcceptance.DISABILITY, label: "Discapacidad motriz o sensorial" },
                  { value: SpecialNeedsAcceptance.ANY, label: "Disposición abierta a cualquiera" },
                ]}
              />

              {/* Compromiso de esterilización */}
              <OptionToggleGroup
                label="Compromiso formal con la esterilización de la mascota"
                value={formData.sterilizationCommitment ? "yes" : "no"}
                onChange={(val) => updateField("sterilizationCommitment", val === "yes")}
                options={[
                  { value: "yes", label: "Sí, me comprometo formalmente" },
                  { value: "no", label: "No estoy seguro/a" },
                ]}
              />

              {/* Motivación */}
              <OptionToggleGroup
                label="Motivación principal para la adopción"
                value={formData.adoptionMotivation}
                onChange={(val) => updateField("adoptionMotivation", val as AdoptionMotivation)}
                options={[
                  { value: AdoptionMotivation.COMPANIONSHIP, label: "Compañía personal" },
                  { value: AdoptionMotivation.RESCUE, label: "Rescatar y dar un hogar" },
                  { value: AdoptionMotivation.FAMILY, label: "Compañero para la familia o niños" },
                  { value: AdoptionMotivation.THERAPY, label: "Soporte emocional" },
                  { value: AdoptionMotivation.OTHER, label: "Otra motivación" },
                ]}
              />

              {/* Seguimiento */}
              <OptionToggleGroup
                label="Disposición para el seguimiento post-adopción (30, 90 y 180 días)"
                description="Los albergues solicitan fotos y reportes breves para asegurar el bienestar del animal."
                value={formData.followUpAcceptance}
                onChange={(val) => updateField("followUpAcceptance", val as FollowUpAcceptance)}
                options={[
                  { value: FollowUpAcceptance.FULLY_ACCEPT, label: "Totalmente de acuerdo y dispuesto/a" },
                  { value: FollowUpAcceptance.PARTIALLY, label: "Acepto compartir fotos periódicas" },
                  { value: FollowUpAcceptance.PREFER_NOT, label: "Prefiero no tener visitas" },
                ]}
              />

              {/* Rango de edad del adoptante */}
              <OptionToggleGroup
                label="Tu rango de edad"
                value={formData.adopterAgeRange}
                onChange={(val) => updateField("adopterAgeRange", val as AdopterAgeRange)}
                options={[
                  { value: AdopterAgeRange.EIGHTEEN_TO_25, label: "18 a 25 años" },
                  { value: AdopterAgeRange.TWENTY_SIX_TO_35, label: "26 a 35 años" },
                  { value: AdopterAgeRange.THIRTY_SIX_TO_45, label: "36 a 45 años" },
                  { value: AdopterAgeRange.FORTY_SIX_TO_55, label: "46 a 55 años" },
                  { value: AdopterAgeRange.FIFTY_SIX_PLUS, label: "56 años a más" },
                ]}
              />

              {/* Teléfono sin +51 */}
              <div className="space-y-1.5 pt-2">
                <Label htmlFor="phoneNumber" className="text-sm font-semibold text-tinta-900 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-verde-700" />
                  Teléfono / Celular de contacto
                </Label>
                <p className="text-xs text-tinta-400">
                  Número móvil de 9 dígitos (se asume Perú +51) para coordinaciones de adopción por WhatsApp.
                </p>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber || ""}
                  onChange={(e) => updateField("phoneNumber", e.target.value)}
                  placeholder="Ej. 987 654 321"
                  className="h-11 border-line max-w-sm text-sm tracking-wide font-medium"
                />
              </div>
            </div>
          )}
        </CardContent>

        <Separator className="bg-line mt-4" />

        <CardFooter className="py-4 bg-superficie-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Botón Anterior o aviso */}
          <div>
            {activeSection > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveSection((prev) => Math.max(1, prev - 1))}
                className="text-xs h-10 gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Sección anterior
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-tinta-600">
                <CheckCircle2 className="w-4 h-4 text-verde-700 shrink-0" />
                <span>Las respuestas se guardan en tu perfil de adoptante</span>
              </div>
            )}
          </div>

          {/* Botón Siguiente o Finalizar */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {activeSection < 4 ? (
              <Button
                type="button"
                onClick={() => setActiveSection((prev) => Math.min(4, prev + 1))}
                className="bg-verde-700 hover:bg-verde-hover text-white font-medium text-xs sm:text-sm h-10 gap-1.5 cursor-pointer"
              >
                <span>Avanzar a {SECTIONS[activeSection].label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || isSaving}
                className={`font-semibold min-w-[200px] h-10 shadow-xs cursor-pointer ${
                  isNewProfile
                    ? "bg-ambar-500 hover:bg-[#D89102] text-verde-900 font-bold"
                    : "bg-verde-700 hover:bg-verde-hover text-white"
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : isNewProfile ? (
                  "¡Finalizar y Activar Recomendaciones! 🎉"
                ) : (
                  "Guardar preferencias"
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

