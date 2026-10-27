export const normalizeSpecies = (val?: string | null): "dog" | "cat" | null => {
  if (!val) return null;
  const lower = val.toLowerCase().trim();
  if (lower === "dog" || lower === "perro") return "dog";
  if (lower === "cat" || lower === "gato") return "cat";
  return null;
};

export const normalizeFur = (
  val?: string | null,
): "short" | "long" | "hairless" | null => {
  if (!val) return null;
  const lower = val.toLowerCase().trim();
  if (lower === "short" || lower === "corto") return "short";
  if (lower === "long" || lower === "largo") return "long";
  if (lower === "hairless" || lower === "sin pelo" || lower === "calvo")
    return "hairless";
  return null;
};

export const normalizeSize = (
  val?: string | null,
): "small" | "medium" | "large" | null => {
  if (!val) return null;
  const lower = val.toLowerCase().trim();
  if (lower === "small" || lower === "pequeno" || lower === "pequeño")
    return "small";
  if (lower === "medium" || lower === "mediano") return "medium";
  if (lower === "large" || lower === "grande") return "large";
  return null;
};

const COLOR_DISPLAY_NAMES: Record<string, string> = {
  negro: "Negro",
  marron: "Marrón",
  marrón: "Marrón",
  crema: "Crema",
  gris: "Gris",
  blanco: "Blanco",
};

export const formatColorName = (val?: string | null): string => {
  if (!val) return "";
  const lower = val.toLowerCase().trim();
  if (COLOR_DISPLAY_NAMES[lower]) return COLOR_DISPLAY_NAMES[lower];
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

export const formatColorList = (colors?: string[] | null): string => {
  if (!Array.isArray(colors) || colors.length === 0) return "";
  return colors.map(formatColorName).filter(Boolean).join(", ");
};
