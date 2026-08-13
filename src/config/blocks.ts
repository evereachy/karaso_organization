import type { ComponentType } from "react";
import { Hero } from "@/blocks/Hero";
import { About } from "@/blocks/About";
import { Services } from "@/blocks/Services";
import { Calculator } from "@/blocks/Calculator";
import { Booking } from "@/blocks/Booking";
import { Reviews } from "@/blocks/Reviews";
import { Gallery } from "@/blocks/Gallery";
import { Faq } from "@/blocks/Faq";

export type BlockId = "calculator" | "hero" | "about" | "services" | "booking" | "reviews" | "gallery" | "faq";

/**
 * СБОРКА СТРАНИЦЫ.
 * Порядок блоков и их включение — только здесь.
 * Клиент захотел галерею выше отзывов или убрать «О нас» — правится одна строка,
 * компоненты не трогаем.
 */
export const pageBlocks: Array<{ id: BlockId; Component: ComponentType; enabled: boolean }> = [
  { id: "hero", Component: Hero, enabled: true },
  { id: "about", Component: About, enabled: true },
  { id: "services", Component: Services, enabled: true },
  // Расчёт стоит перед записью: сначала снимаем вопрос цены, потом зовём записаться
  { id: "calculator", Component: Calculator, enabled: true },
  { id: "booking", Component: Booking, enabled: true },
  { id: "reviews", Component: Reviews, enabled: true },
  { id: "gallery", Component: Gallery, enabled: true },
  { id: "faq", Component: Faq, enabled: true },
];
