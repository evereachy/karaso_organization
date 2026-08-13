import { factorFor, getVehicleClass } from "@/config/vehicle";
import type { Service, ServiceVariant } from "@/types";

/**
 * Расчёт стоимости и времени с учётом класса машины.
 *
 * Округление до полусотни намеренное: 1 487 Kč выглядит как результат
 * машинного умножения и подрывает доверие к цифре сильнее,
 * чем честное «около 1 500».
 */
export function roundPrice(value: number) {
  return Math.round(value / 50) * 50;
}

/** Время округляем до получаса — сетка записи всё равно с таким шагом */
export function roundDuration(min: number) {
  return Math.max(30, Math.round(min / 30) * 30);
}

export function priceFor(variant: ServiceVariant, classId: string | null, flat?: boolean) {
  if (flat) return variant.price;
  return roundPrice(variant.price * factorFor(classId));
}

export function durationFor(variant: ServiceVariant, classId: string | null, flat?: boolean) {
  if (flat) return variant.durationMin;
  return roundDuration(variant.durationMin * factorFor(classId));
}

/** Диапазон цен услуги по всем вариантам — для витрины «от 890 Kč» */
export function priceRange(service: Service, classId: string | null) {
  const prices = service.variants.map((v) => priceFor(v, classId, service.flatRate));
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function classLabel(classId: string | null) {
  return getVehicleClass(classId)?.label ?? null;
}
