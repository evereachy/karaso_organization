"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { services } from "@/config/catalog";
import { vehicleClasses } from "@/config/vehicle";
import { cn } from "@/lib/cn";
import { formatDuration, formatPrice } from "@/lib/format";
import { durationFor, priceFor, priceRange } from "@/lib/pricing";
import { MAX_ITEMS, exceedsWorkday, isSelected, summarize } from "@/lib/selection";
import { useBooking } from "../BookingProvider";
import { useAvailability } from "../AvailabilityProvider";

/**
 * Шаг 1: машина и работы.
 *
 * Класс автомобиля спрашиваем первым и до выбора работ.
 * Иначе человек увидит цену за седан, выберет кроссовер
 * и решит, что его обманули: цифры на глазах вырастут на четверть.
 */
export function StepService() {
  const { draft, toggle, setVehicleClass, fieldErrors } = useBooking();
  const { data } = useAvailability();
  const [openId, setOpenId] = useState<string | null>(null);

  const classId = draft.vehicle.classId;
  const summary = summarize(draft.items, classId);
  const full = draft.items.length >= MAX_ITEMS;
  const tooLong = exceedsWorkday(data, summary.durationMin);

  return (
    <div className="space-y-6">
      {/* ===== КЛАСС МАШИНЫ ===== */}
      <div>
        <p className="mb-1 text-sm text-muted">Ваша машина</p>
        <p className="mb-3 text-xs text-muted">
          От класса зависят цена и время: на большую машину уходит больше
          материалов и дольше работа
        </p>

        <div className="grid grid-cols-2 gap-2">
          {vehicleClasses.map((v) => {
            const active = classId === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setVehicleClass(v.id)}
                className={cn(
                  "min-h-16 rounded-control border px-3 py-2.5 text-left",
                  "transition-colors duration-200 ease-soft",
                  active
                    ? "border-ink bg-accent text-accent-ink"
                    : "border-line bg-elevated active:bg-surface",
                )}
              >
                <span className="block text-[15px]">{v.label}</span>
                {/* Примеры моделей: класс своей машины помнят единицы */}
                <span
                  className={cn("mt-0.5 block text-xs", active ? "opacity-75" : "text-muted")}
                >
                  {v.examples}
                </span>
              </button>
            );
          })}
        </div>

        {fieldErrors.vehicle && (
          <p className="mt-2 text-sm text-red-500">{fieldErrors.vehicle}</p>
        )}
      </div>

      {/* ===== РАБОТЫ ===== */}
      <div>
        <p className="mb-3 text-sm text-muted">
          Что делаем
          {!classId && <span className="ml-1.5 text-xs">— цены за средний седан</span>}
        </p>

        <div className="space-y-2">
          {services.map((service) => {
            const picked = draft.items.find((i) => i.serviceId === service.id);
            const pickedVariant = picked
              ? service.variants.find((v) => v.id === picked.variantId)
              : null;
            const expanded = openId === service.id;
            const locked = full && !picked;
            const range = priceRange(service, classId);

            return (
              <div
                key={service.id}
                className={cn(
                  "overflow-hidden rounded-control border transition-colors duration-200 ease-soft",
                  picked ? "border-ink bg-surface" : "border-line bg-elevated",
                  locked && "opacity-45",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(expanded ? null : service.id)}
                  disabled={locked}
                  aria-expanded={expanded}
                  className="flex w-full items-center gap-3.5 px-4 py-[18px] text-left"
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-[9px] border",
                      picked ? "border-ink bg-accent text-accent-ink" : "border-line",
                    )}
                    aria-hidden
                  >
                    {picked && (
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
                      {pickedVariant
                        ? `${pickedVariant.label} · ${formatDuration(
                            durationFor(pickedVariant, classId, service.flatRate),
                          )}`
                        : `от ${formatPrice(range.min, service.currency)}`}
                    </span>
                  </span>

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
                          const active = isSelected(draft.items, service.id, variant.id);
                          const price = priceFor(variant, classId, service.flatRate);
                          const dur = durationFor(variant, classId, service.flatRate);

                          return (
                            <button
                              key={variant.id}
                              type="button"
                              onClick={() =>
                                toggle({ serviceId: service.id, variantId: variant.id })
                              }
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
                                  {formatDuration(dur)}
                                </span>
                              </span>
                              <span className="shrink-0 text-sm tabular-nums">
                                {formatPrice(price, service.currency)}
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
      </div>

      {full && (
        <p className="text-sm text-muted">
          Больше {MAX_ITEMS} работ за визит не берём — машина должна уехать в тот же день.
        </p>
      )}

      {tooLong && (
        <p className="rounded-control bg-surface px-4 py-3 text-sm text-muted">
          Всё вместе — {formatDuration(summary.durationMin)}. В один визит столько не помещается,
          уберите что-нибудь или оставьте машину на два дня.
        </p>
      )}

      {/* Цена — оценка, а не счёт. Сказать об этом честно дешевле,
          чем объясняться на выдаче машины */}
      {summary.items.length > 0 && (
        <p className="rounded-control bg-surface px-4 py-3 text-xs leading-relaxed text-muted">
          Это предварительный расчёт работ без стоимости запчастей. Точную сумму мастер
          назовёт после осмотра и до начала работ — без вашего согласия ничего не делаем.
        </p>
      )}

      {fieldErrors.items && <p className="text-sm text-red-500">{fieldErrors.items}</p>}
    </div>
  );
}
