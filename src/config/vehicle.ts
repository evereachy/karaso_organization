import type { VehicleClass } from "@/types";

/**
 * КЛАССЫ АВТОМОБИЛЕЙ.
 *
 * Множитель применяется и к цене, и к длительности: на внедорожник
 * уходит больше масла и больше времени на подъёмнике, и если время
 * не растянуть, расписание поедет уже на второй записи за день.
 *
 * Примеры моделей важнее названия класса: человек не знает,
 * «компакт» у него или «средний», но свою машину узнаёт сразу.
 */
export const vehicleClasses: VehicleClass[] = [
  {
    id: "compact",
    label: "Малый",
    examples: "Fabia, Polo, Yaris, Clio",
    factor: 0.85,
  },
  {
    id: "sedan",
    label: "Средний",
    examples: "Octavia, Golf, Focus, Corolla",
    factor: 1,
  },
  {
    id: "suv",
    label: "Кроссовер",
    examples: "Kodiaq, Tiguan, RAV4, X3",
    factor: 1.25,
  },
  {
    id: "large",
    label: "Внедорожник и минивэн",
    examples: "Touareg, X5, Transporter, Sharan",
    factor: 1.5,
  },
];

export const DEFAULT_CLASS_ID = "sedan";

export function getVehicleClass(id: string | null | undefined) {
  return vehicleClasses.find((v) => v.id === id) ?? null;
}

/** Множитель для расчёта. Без выбранного класса считаем по среднему. */
export function factorFor(classId: string | null | undefined) {
  return getVehicleClass(classId)?.factor ?? 1;
}
