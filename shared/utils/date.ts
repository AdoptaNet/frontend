import dayjs from "dayjs";
import "dayjs/locale/es";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";

// Constants for Peruvian locale configuration
export const TIMEZONE_PERU = "America/Lima";

// Extend Day.js plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(customParseFormat);

// Set Spanish locale with Monday as the first day of the week
dayjs.locale("es");
dayjs.updateLocale("es", {
  weekStart: 1, // La semana empieza el lunes
});

// Set default timezone to America/Lima (UTC-5)
dayjs.tz.setDefault(TIMEZONE_PERU);

export type DateInput = string | number | Date | dayjs.Dayjs;

/**
 * Returns a Day.js object set to America/Lima timezone.
 */
export function getLimaDate(date?: DateInput): dayjs.Dayjs {
  return date ? dayjs(date).tz(TIMEZONE_PERU) : dayjs().tz(TIMEZONE_PERU);
}

/**
 * Formats a date in full Spanish text.
 * Example: "13 de septiembre de 2026"
 */
export function formatDate(
  date: DateInput,
  format = "D [de] MMMM [de] YYYY"
): string {
  if (!date) return "";
  const d = getLimaDate(date);
  return d.isValid() ? d.format(format) : "";
}

/**
 * Formats a date in short numeric format.
 * Example: "13/09/2026"
 */
export function formatShortDate(date: DateInput): string {
  return formatDate(date, "DD/MM/YYYY");
}

/**
 * Formats time in 12-hour format with am/pm (hora peruana).
 * Example: "06:30 pm", "10:15 am"
 */
export function formatTime(date: DateInput): string {
  return formatDate(date, "hh:mm a");
}

/**
 * Formats both date and time (12-hour format am/pm).
 * Example: "13/09/2026 06:30 pm"
 */
export function formatDateTime(date: DateInput): string {
  return formatDate(date, "DD/MM/YYYY hh:mm a");
}

/**
 * Returns relative time in Spanish.
 * Example: "hace 2 horas", "hace 3 días", "en 5 minutos"
 */
export function formatRelativeTime(date: DateInput): string {
  if (!date) return "";
  const d = getLimaDate(date);
  return d.isValid() ? d.fromNow() : "";
}

/**
 * Validates if the input is a valid date.
 */
export function isValidDate(date: unknown): boolean {
  if (!date) return false;
  return dayjs(date as DateInput).isValid();
}

export { dayjs };
export default dayjs;
