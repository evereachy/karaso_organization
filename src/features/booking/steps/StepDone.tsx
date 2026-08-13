"use client";

import { site } from "@/config/site";
import { formatDateLong, formatDuration } from "@/lib/format";
import { useBooking } from "../BookingProvider";

export function StepDone() {
  const { result } = useBooking();
  if (!result) return null;

  return (
    <div className="py-4 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-pill bg-surface">
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h3 className="font-display text-2xl">Записали вас</h3>

      <p className="mx-auto mt-3 max-w-sm leading-relaxed text-muted">
        {formatDateLong(result.date)} в {result.time}, всего{" "}
        {formatDuration(result.totalDurationMin)}
        {result.masterId ? `, мастер ${result.masterName}` : ""}. Подтвердим запись по телефону
        в течение 15 минут.
      </p>

      <ul className="mx-auto mt-5 max-w-sm space-y-1.5 rounded-control bg-surface px-4 py-4 text-left text-sm">
        {result.lines.map((l) => (
          <li key={`${l.serviceId}-${l.variantId}`} className="flex justify-between gap-3">
            <span className="min-w-0 truncate">
              {l.serviceTitle} — <span className="text-muted">{l.variantLabel}</span>
            </span>
            <span className="shrink-0 tabular-nums text-muted">{formatDuration(l.durationMin)}</span>
          </li>
        ))}
      </ul>

      <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-muted">
        Сумма предварительная и не включает запчасти. Итог мастер согласует с вами
        после осмотра.
      </p>

      <p className="mt-6 text-sm text-muted">
        Что-то изменилось?{" "}
        <a href={site.contacts.phoneHref} className="text-ink underline underline-offset-4">
          {site.contacts.phone}
        </a>
      </p>
    </div>
  );
}
