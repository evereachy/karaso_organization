import type { Service } from "@/types";

/**
 * КАТАЛОГ РАБОТ.
 *
 * Цены базовые — для среднего седана. Класс машины умножает их
 * в lib/pricing.ts, поэтому здесь коэффициентов быть не должно:
 * иначе тариф придётся править в двух местах.
 *
 * flatRate: true — работы, где класс не влияет.
 */
export const services: Service[] = [
  {
    id: "oil",
    title: "Замена масла",
    category: "maintenance",
    currency: "Kč",
    description: "Масло, фильтр, проверка уровней и осмотр подкапотного.",
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=70",
    variants: [
      { id: "basic", label: "Масло клиента", durationMin: 45, price: 600 },
      { id: "with-oil", label: "С нашим маслом и фильтром", durationMin: 60, price: 1900 },
      { id: "full", label: "С заменой всех фильтров", durationMin: 90, price: 3200 },
    ],
  },
  {
    id: "diagnostics",
    title: "Диагностика",
    category: "diagnostics",
    currency: "Kč",
    description: "Считываем ошибки, проверяем узлы, объясняем на понятном языке.",
    image:
      "https://images.unsplash.com/photo-1632823471565-1ecdf5e63d64?auto=format&fit=crop&w=800&q=70",
    // Сканер работает одинаково на любой машине — множитель тут был бы обманом
    flatRate: true,
    variants: [
      { id: "scan", label: "Компьютерная, чтение ошибок", durationMin: 30, price: 500 },
      { id: "chassis", label: "Ходовой части на подъёмнике", durationMin: 60, price: 900 },
      { id: "full", label: "Полная перед покупкой", durationMin: 120, price: 2400 },
    ],
  },
  {
    id: "brakes",
    title: "Тормозная система",
    category: "repair",
    currency: "Kč",
    description: "Колодки, диски, жидкость. Работа без стоимости запчастей.",
    image:
      "https://images.unsplash.com/photo-1600661653561-629509216228?auto=format&fit=crop&w=800&q=70",
    variants: [
      { id: "pads-front", label: "Колодки, одна ось", durationMin: 60, price: 1200 },
      { id: "pads-discs", label: "Колодки и диски, одна ось", durationMin: 120, price: 2200 },
      { id: "fluid", label: "Замена тормозной жидкости", durationMin: 60, price: 1100 },
    ],
  },
  {
    id: "tires",
    title: "Шиномонтаж",
    category: "tires",
    currency: "Kč",
    description: "Переобувка, балансировка, ремонт проколов, сезонное хранение.",
    image:
      "https://images.unsplash.com/photo-1607603750909-408e193868c7?auto=format&fit=crop&w=800&q=70",
    variants: [
      { id: "swap", label: "Смена комплекта на дисках", durationMin: 45, price: 900 },
      { id: "mount", label: "Переобувка с балансировкой", durationMin: 90, price: 1600 },
      { id: "repair", label: "Ремонт одного колеса", durationMin: 30, price: 400 },
    ],
  },
  {
    id: "suspension",
    title: "Подвеска",
    category: "repair",
    currency: "Kč",
    description: "Стойки, рычаги, сайлентблоки. Диагностика перед работой обязательна.",
    image:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=70",
    variants: [
      { id: "struts", label: "Замена стоек, одна ось", durationMin: 180, price: 3400 },
      { id: "arms", label: "Замена рычагов", durationMin: 150, price: 2800 },
      { id: "alignment", label: "Развал-схождение", durationMin: 90, price: 1400 },
    ],
  },
  {
    id: "ac",
    title: "Кондиционер",
    category: "maintenance",
    currency: "Kč",
    description: "Заправка, поиск утечек, замена салонного фильтра, антибактериальная обработка.",
    image:
      "https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=800&q=70",
    variants: [
      { id: "refill", label: "Заправка хладагентом", durationMin: 60, price: 1400 },
      { id: "service", label: "Заправка и чистка системы", durationMin: 90, price: 2300 },
    ],
  },
];

export const categoryLabels: Record<Service["category"], string> = {
  maintenance: "Обслуживание",
  diagnostics: "Диагностика",
  repair: "Ремонт",
  tires: "Шины",
  body: "Кузов",
};

export function getService(id: string | null | undefined) {
  return services.find((s) => s.id === id) ?? null;
}

export function getVariant(serviceId: string, variantId: string) {
  return getService(serviceId)?.variants.find((v) => v.id === variantId) ?? null;
}

/** Базовая минимальная цена без учёта класса — для витрины */
export function minPrice(service: Service) {
  return Math.min(...service.variants.map((v) => v.price));
}

export function defaultVariant(service: Service) {
  return service.variants[Math.min(1, service.variants.length - 1)];
}
