"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { services } from "@/config/catalog";
import { vehicleClasses } from "@/config/vehicle";
import { cn } from "@/lib/cn";
import { formatDuration, formatPrice } from "@/lib/format";
import { durationFor, priceFor, priceRange } from "@/lib/pricing";
import { useBooking } from "@/features/booking/BookingProvider";

/**
 * БЛОК — Расчёт стоимости.
 *
 * Главный вопрос клиента автосервиса звучит «сколько это будет стоить»,
 * и обычно ответ на него — телефонный звонок. Калькулятор отвечает
 * до звонка и снимает главный барьер перед записью.
 *
 * Считает теми же функциями, что и форма записи: расхождение цифр
 * между калькулятором и заявкой убило бы доверие к обоим.
 */
export function Calculator() {
  const { open, setVehicleClass, toggle } = useBooking();

  const [classId, setClassId] = useState<string>("sedan");
  const [picked, setPicked] = useState<Record<string, string>>({});
  /** Открытых услуг может быть несколько: сравнивать варианты
      удобнее рядом, а не переключаясь между ними по одной */
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const chosen = useMemo(
    () =>
      Object.entries(picked)
        .map(([serviceId, variantId]) => {
          const service = services.find((s) => s.id === serviceId);
          const variant = service?.variants.find((v) => v.id === variantId);
          return service && variant ? { service, variant } : null;
        })
        .filter(Boolean) as Array<{
        service: (typeof services)[number];
        variant: (typeof services)[number]["variants"][number];
      }>,
    [picked],
  );

  const total = chosen.reduce(
    (acc, { service, variant }) => ({
      price: acc.price + priceFor(variant, classId, service.flatRate),
      duration: acc.duration + durationFor(variant, classId, service.flatRate),
    }),
    { price: 0, duration: 0 },
  );

  const pick = (serviceId: string, variantId: string) =>
    setPicked((prev) => {
      const next = { ...prev };
      if (next[serviceId] === variantId) delete next[serviceId];
      else next[serviceId] = variantId;
      return next;
    });

  const removeService = (serviceId: string) =>
    setPicked((prev) => {
      const next = { ...prev };
      delete next[serviceId];
      return next;
    });

  const toggleOpen = (serviceId: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) next.delete(serviceId);
      else next.add(serviceId);
      return next;
    });

  const allOpen = openIds.size === services.length;
  const toggleAll = () =>
    setOpenIds(allOpen ? new Set() : new Set(services.map((s) => s.id)));

  /** Переносим расчёт в заявку, чтобы человек не выбирал всё заново */
  const bookSelected = () => {
    setVehicleClass(classId);
    chosen.forEach(({ service, variant }) =>
      toggle({ serviceId: service.id, variantId: variant.id }),
    );
    open(1);
  };

  /** Детальный итог. Один компонент на обе раскладки — цифры и кнопка
      не должны расходиться между телефоном и десктопом */
  const summaryCard = (
    <div className="rounded-card border border-line bg-elevated p-5 shadow-soft">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm text-muted">Предварительно</p>
        {chosen.length > 0 && (
          <button
            type="button"
            onClick={() => setPicked({})}
            className="text-xs text-muted underline underline-offset-4"
          >
            Сбросить
          </button>
        )}
      </div>

      <p className="mt-1 font-display text-[clamp(2rem,9vw,2.75rem)] leading-none tabular-nums">
        {total.price > 0 ? `≈ ${formatPrice(total.price, "Kč")}` : "—"}
      </p>

      {total.duration > 0 && (
        <p className="mt-2 text-sm text-muted">
          Работы займут {formatDuration(total.duration)}
        </p>
      )}

      {chosen.length > 0 ? (
        <ul className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
          {chosen.map(({ service, variant }) => (
            <li key={service.id} className="flex items-center gap-2">
              <span className="min-w-0 flex-1">
                <span className="block truncate">{service.title}</span>
                <span className="block truncate text-xs text-muted">{variant.label}</span>
              </span>

              <span className="shrink-0 tabular-nums">
                {formatPrice(priceFor(variant, classId, service.flatRate), service.currency)}
              </span>

              {/* Убрать позицию прямо из итога — не возвращаясь к списку работ */}
              <button
                type="button"
                onClick={() => removeService(service.id)}
                aria-label={`Убрать ${service.title}`}
                className="-mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-pill text-muted transition-colors active:bg-surface"
              >
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden>
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 border-t border-line pt-4 text-sm text-muted">
          Отметьте работы — посчитаем.
        </p>
      )}

      <Button
        fullWidth
        size="lg"
        className="mt-5"
        disabled={chosen.length === 0}
        onClick={bookSelected}
      >
        Записаться с этим расчётом
      </Button>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Без стоимости запчастей. Точную сумму мастер согласует после осмотра —
        больше названного не берём.
      </p>
    </div>
  );

  return (
    <Section
      id="calculator"
      eyebrow="Расчёт"
      title="Сколько это будет стоить"
      lead="Выберите класс машины и работы — покажем стоимость и время. Это расчёт работ без запчастей, но порядок сумм честный."
    >
      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:items-start lg:gap-8">
        <div>
          {/* ===== КЛАСС МАШИНЫ ===== */}
          <div className="mb-6">
            <p className="mb-3 text-sm text-muted">Класс машины</p>

            {/* Лента в одну строку: сетка 2×2 занимала четверть экрана
                до того, как человек дошёл до первой работы */}
            <div className="rail lg:grid lg:grid-cols-2 lg:gap-2 lg:[margin-inline:0] lg:[padding-inline:0]">
              {vehicleClasses.map((v) => {
                const active = classId === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setClassId(v.id)}
                    className={cn(
                      "w-[46vw] max-w-[200px] rounded-control border px-3.5 py-3 text-left lg:w-auto lg:max-w-none",
                      "transition-colors duration-200 ease-soft",
                      active
                        ? "border-ink bg-accent text-accent-ink"
                        : "border-line bg-elevated active:bg-surface",
                    )}
                  >
                    <span className="block text-[15px]">{v.label}</span>
                    <span
                      className={cn(
                        "mt-0.5 block truncate text-xs",
                        active ? "opacity-75" : "text-muted",
                      )}
                    >
                      {v.examples}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/*
            БЕГУЩИЙ ИТОГ — липнет к верху под навбаром на мобиле.
            Он не заменяет детальную карточку внизу, а показывает сумму
            в момент выбора: иначе цена меняется за пределами экрана.
            Снизу держать нельзя — там уже панель «Записаться».
          */}
          <div className="sticky top-[68px] z-20 -mx-[var(--pad-x)] mb-4 px-[var(--pad-x)] lg:hidden">
            <div
              className={cn(
                "flex items-center gap-3 rounded-control border px-4 py-3 backdrop-blur",
                "transition-colors duration-300",
                total.price > 0 ? "border-ink bg-elevated/95" : "border-line bg-surface/90",
              )}
            >
              <div className="min-w-0 flex-1">
                {total.price > 0 ? (
                  <>
                    <p className="text-lg leading-tight tabular-nums">
                      ≈ {formatPrice(total.price, "Kč")}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {chosen.length}{" "}
                      {chosen.length === 1 ? "работа" : chosen.length < 5 ? "работы" : "работ"} ·{" "}
                      {formatDuration(total.duration)}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted">Отметьте работы — посчитаем</p>
                )}
              </div>

              {total.price > 0 && (
                <Button size="md" onClick={bookSelected} className="shrink-0">
                  Записаться
                </Button>
              )}
            </div>
          </div>

          {/* ===== РАБОТЫ ===== */}
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <p className="text-sm text-muted">Работы</p>
            <button
              type="button"
              onClick={toggleAll}
              className="text-sm text-muted underline underline-offset-4"
            >
              {allOpen ? "Свернуть все" : "Показать все цены"}
            </button>
          </div>

          <div className="space-y-2">
            {services.map((service) => {
              const activeVariantId = picked[service.id];
              const activeVariant = service.variants.find((v) => v.id === activeVariantId);
              const expanded = openIds.has(service.id);
              const range = priceRange(service, classId);

              return (
                <div
                  key={service.id}
                  className={cn(
                    "overflow-hidden rounded-control border transition-colors duration-200 ease-soft",
                    activeVariant ? "border-ink bg-surface" : "border-line bg-elevated",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleOpen(service.id)}
                    aria-expanded={expanded}
                    className="flex w-full items-center gap-3 px-4 py-4 text-left"
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-[9px] border",
                        activeVariant ? "border-ink bg-accent text-accent-ink" : "border-line",
                      )}
                      aria-hidden
                    >
                      {activeVariant && (
                        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5">
                          <path
                            d="M4 10.5l4 4 8-9"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px]">{service.title}</span>
                      <span className="mt-0.5 block truncate text-sm text-muted">
                        {activeVariant
                          ? activeVariant.label
                          : `${service.variants.length} варианта · от ${formatPrice(
                              range.min,
                              service.currency,
                            )}`}
                      </span>
                    </span>

                    {/* Цена выбранного варианта видна и в свёрнутой строке —
                        иначе после сворачивания непонятно, за что платишь */}
                    {activeVariant && (
                      <span className="shrink-0 text-[15px] tabular-nums">
                        {formatPrice(
                          priceFor(activeVariant, classId, service.flatRate),
                          service.currency,
                        )}
                      </span>
                    )}

                    <span
                      className="shrink-0 text-muted transition-transform duration-300 ease-soft"
                      style={{ transform: expanded ? "rotate(180deg)" : "none" }}
                      aria-hidden
                    >
                      <svg viewBox="0 0 20 20" className="h-4 w-4">
                        <path
                          d="M5 8l5 5 5-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 px-2.5 pb-2.5">
                          {service.variants.map((variant) => {
                            const active = activeVariantId === variant.id;
                            return (
                              <button
                                key={variant.id}
                                type="button"
                                onClick={() => pick(service.id, variant.id)}
                                className={cn(
                                  "flex min-h-14 w-full items-center justify-between gap-3 rounded-control border px-4 py-3 text-left",
                                  "transition-colors duration-200 ease-soft",
                                  active
                                    ? "border-ink bg-accent text-accent-ink"
                                    : "border-line bg-bg active:bg-surface",
                                )}
                              >
                                <span className="min-w-0">
                                  <span className="block truncate text-sm">{variant.label}</span>
                                  <span
                                    className={cn(
                                      "text-xs",
                                      active ? "opacity-75" : "text-muted",
                                    )}
                                  >
                                    {formatDuration(
                                      durationFor(variant, classId, service.flatRate),
                                    )}
                                  </span>
                                </span>
                                <span className="shrink-0 text-sm tabular-nums">
                                  {formatPrice(
                                    priceFor(variant, classId, service.flatRate),
                                    service.currency,
                                  )}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Детальный итог на мобиле — под списком, как и было */}
          <div className="mt-6 lg:hidden">{summaryCard}</div>
        </div>

        {/* Тот же итог на десктопе — в правой колонке, липнет при прокрутке */}
        <div className="hidden lg:sticky lg:top-24 lg:block">{summaryCard}</div>
      </div>
    </Section>
  );
}
