import { z } from "zod";

export const petPhotoItemSchema = z.object({
  id: z.string().optional(),
  url: z
    .string({ required_error: "La URL de la foto es requerida" })
    .url("URL de imagen inválida"),
  publicId: z
    .string({ required_error: "El identificador de la foto es requerido" })
    .min(1, "El identificador de la foto es requerido"),
  isPrimary: z.boolean({
    required_error: "Debe especificarse si es foto principal",
  }),
  order: z
    .number({ invalid_type_error: "El orden debe ser un número" })
    .int("El orden debe ser un número entero")
    .min(0, "El orden no puede ser negativo")
    .optional(),
});

export const step1BasicInfoSchema = z.object({
  name: z
    .string({ required_error: "El nombre de la mascota es obligatorio" })
    .min(1, "El nombre de la mascota es obligatorio")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  species: z.enum(["dog", "cat"], {
    errorMap: () => ({ message: "Selecciona una especie (perro o gato)" }),
  }),
  breed: z.string().max(100, "La raza no puede superar los 100 caracteres"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Selecciona el sexo de la mascota" }),
  }),
  ageMonths: z
    .number({
      required_error: "La edad en meses es obligatoria",
      invalid_type_error: "Ingresa un número válido para la edad",
    })
    .int("La edad debe ser un número entero")
    .min(0, "La edad en meses no puede ser negativa"),
  photos: z
    .array(petPhotoItemSchema, {
      required_error: "Debes subir al menos 1 fotografía",
    })
    .min(1, "Debes subir al menos 1 fotografía")
    .max(6, "Puedes subir como máximo 6 fotografías")
    .refine(
      (photos) => photos.filter((p) => p.isPrimary).length === 1,
      "Debes seleccionar exactamente una foto como portada principal",
    ),
});

export const step2HealthPhysicalSchema = z.object({
  size: z.enum(["small", "medium", "large"], {
    errorMap: () => ({ message: "Selecciona el tamaño de la mascota" }),
  }),
  furLength: z.enum(["short", "long", "hairless"], {
    errorMap: () => ({ message: "Selecciona el tipo de pelaje" }),
  }),
  isSterilized: z.boolean({
    required_error: "Indica si la mascota está esterilizada",
  }),
  isVaccinated: z.boolean({
    required_error: "Indica si la mascota cuenta con vacunas",
  }),
  healthStatus: z.enum(["healthy", "chronic_condition", "disability"], {
    errorMap: () => ({ message: "Selecciona el estado de salud" }),
  }),
  healthNotes: z
    .string()
    .max(500, "Las notas de salud no pueden exceder 500 caracteres")
    .nullable()
    .optional(),
});

export const step3PersonalitySchema = z.object({
  energyLevel: z
    .number({
      required_error: "El nivel de energía es obligatorio",
      invalid_type_error: "Ingresa un nivel de energía válido",
    })
    .int("Debe ser un número entero")
    .min(1, "El nivel de energía mínimo es 1")
    .max(5, "El nivel de energía máximo es 5"),
  vocalizationLevel: z
    .number({
      required_error: "El nivel de vocalización es obligatorio",
      invalid_type_error: "Ingresa un nivel de vocalización válido",
    })
    .int("Debe ser un número entero")
    .min(1, "El nivel de vocalización mínimo es 1")
    .max(5, "El nivel de vocalización máximo es 5"),
  goodWithChildren: z.boolean().nullable().optional(),
  goodWithDogs: z.boolean().nullable().optional(),
  goodWithCats: z.boolean().nullable().optional(),
  trainingLevel: z.enum(["none", "basic", "litterbox", "advanced"], {
    errorMap: () => ({ message: "Selecciona el nivel de adiestramiento" }),
  }),
  timeAloneToleranceHours: z
    .number({ invalid_type_error: "Ingresa un número válido de horas" })
    .int("Debe ser un número entero de horas")
    .min(0, "Las horas de soledad no pueden ser negativas")
    .max(24, "El máximo permitido son 24 horas")
    .nullable()
    .optional(),
});

export const step4StoryStatusSchema = z.object({
  shelterStayMonths: z
    .number({ invalid_type_error: "Ingresa un número válido de meses" })
    .int("Debe ser un número entero")
    .min(0, "El tiempo en el albergue no puede ser negativo"),
  description: z
    .string({ required_error: "La historia y descripción es obligatoria" })
    .min(
      15,
      "Escribe una descripción de al menos 15 caracteres para conocer a la mascota",
    )
    .max(1500, "La descripción no puede superar los 1500 caracteres"),
  status: z.enum(["draft", "available", "in_process", "adopted", "hidden"], {
    errorMap: () => ({ message: "Selecciona un estado de publicación válido" }),
  }),
});

export const completePetFormSchema = z
  .object({
    ...step1BasicInfoSchema.shape,
    ...step2HealthPhysicalSchema.shape,
    ...step3PersonalitySchema.shape,
    ...step4StoryStatusSchema.shape,
  })
  .refine((data) => data.photos && data.photos.filter((p) => p.isPrimary).length === 1, {
    message: "Debes seleccionar exactamente una foto como portada principal",
    path: ["photos"],
  });

export type CompletePetFormData = z.infer<typeof completePetFormSchema>;

export function getAgeCategoryLabel(ageMonths: number): {
  category: "puppy" | "young" | "adult" | "senior";
  label: string;
  badgeColor: string;
} {
  if (ageMonths < 12) {
    return {
      category: "puppy",
      label: "Cachorro / Gatito (< 1 año)",
      badgeColor: "bg-ambar-50 text-ambar-700 border-ambar-200",
    };
  }
  if (ageMonths < 36) {
    return {
      category: "young",
      label: "Joven (1 a 2 años)",
      badgeColor: "bg-verde-50 text-verde-700 border-verde-200",
    };
  }
  if (ageMonths < 96) {
    return {
      category: "adult",
      label: "Adulto (3 a 7 años)",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    };
  }
  return {
    category: "senior",
    label: "Senior (8+ años)",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  };
}
