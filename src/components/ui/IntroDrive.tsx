"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Заставка при открытии: машина проезжает и оставляет за собой дым.
 *
 * Что учтено, чтобы красивая идея не стоила посетителей:
 *  - страница рендерится под заставкой, а не после неё: контент есть
 *    в HTML сразу, поисковик и LCP не страдают;
 *  - показывается один раз за сессию — на пятом заходе анимация
 *    из приятной становится раздражающей;
 *  - тап в любом месте пропускает;
 *  - prefers-reduced-motion выключает целиком;
 *  - жёсткий предохранитель на 2.6 с: если что-то пойдёт не так,
 *    заставка снимется сама и не запрёт сайт.
 */

const KEY = "karosa-intro-shown";

/** Дым: точки вдоль траектории, вспыхивают по мере проезда машины */
const PUFFS = [
  { x: 12, y: 0, size: 90, delay: 0.34 },
  { x: 24, y: -6, size: 120, delay: 0.46 },
  { x: 37, y: 4, size: 100, delay: 0.58 },
  { x: 50, y: -4, size: 140, delay: 0.7 },
  { x: 63, y: 6, size: 110, delay: 0.82 },
  { x: 76, y: -2, size: 130, delay: 0.94 },
  { x: 88, y: 3, size: 100, delay: 1.06 },
];

export function IntroDrive() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;

    // sessionStorage, а не localStorage: в новой вкладке заставка
    // уместна снова, а внутри одной сессии — уже нет
    try {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, "1");
    } catch {
      // приватный режим — просто покажем один раз без запоминания
    }

    setVisible(true);

    const timer = setTimeout(() => setVisible(false), 2200);
    const safety = setTimeout(() => setVisible(false), 2600);

    return () => {
      clearTimeout(timer);
      clearTimeout(safety);
    };
  }, [reduced]);

  // Пока заставка на экране, страница под ней не скроллится
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          onClick={() => setVisible(false)}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center overflow-hidden bg-bg"
          aria-hidden
        >
          {/* Дорожная линия: без опоры машина висит в пустоте */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: [0.32, 0.72, 0, 1] }}
            className="absolute left-0 right-0 top-1/2 h-px origin-left bg-line"
            style={{ marginTop: 34 }}
          />

          {/* Дым. Каждое облачко всплывает в момент, когда мимо
              проходит машина — отсюда ощущение следа, а не фона */}
          {PUFFS.map((p) => (
            <motion.span
              key={p.x}
              initial={{ opacity: 0, scale: 0.35, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0.35, 1, 1.5],
                x: [-10, -50, -90],
                y: [0, -18, -34],
              }}
              transition={{ duration: 1.15, delay: p.delay, ease: "easeOut" }}
              className="pointer-events-none absolute rounded-pill bg-muted"
              style={{
                left: `${p.x}%`,
                top: `calc(50% + ${p.y}px)`,
                width: p.size,
                height: p.size,
                filter: "blur(26px)",
              }}
            />
          ))}

          {/* Машина. Едет с ускорением: линейное движение читается
              как перемещение объекта, а не как разгон */}
          <motion.div
            initial={{ x: "-40vw" }}
            animate={{ x: "125vw" }}
            transition={{ duration: 1.5, ease: [0.5, 0, 0.35, 1] }}
            className="relative z-10 w-[220px] shrink-0 sm:w-[300px]"
          >
            <Car />
          </motion.div>

          {/* Название проявляется после проезда */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-1/2 mt-16 text-center text-sm uppercase tracking-[0.4em] text-muted"
          >
            KAROSA
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Силуэт машины сбоку. currentColor — чтобы работал во всех темах */
function Car() {
  return (
    <svg viewBox="0 0 300 110" className="w-full text-ink" fill="none" aria-hidden>
      {/* кузов */}
      <path
        d="M18 78c0-10 6-16 16-18l30-5 26-22c5-4 11-6 17-6h56c7 0 13 3 17 8l18 20 44 7c14 2 22 8 22 18 0 6-4 10-10 10H28c-6 0-10-4-10-12z"
        fill="currentColor"
      />
      {/* стёкла */}
      <path
        d="M108 33h34v22h-56l17-19c1-2 3-3 5-3zM152 33h33c4 0 7 1 9 4l15 18h-57z"
        className="fill-bg"
      />
      {/* колёса */}
      <circle cx="78" cy="84" r="20" fill="currentColor" />
      <circle cx="78" cy="84" r="9" className="fill-bg" />
      <circle cx="222" cy="84" r="20" fill="currentColor" />
      <circle cx="222" cy="84" r="9" className="fill-bg" />
      {/* фара — единственная деталь в цвете акцента */}
      <rect x="268" y="62" width="16" height="7" rx="3" className="fill-accent" />
    </svg>
  );
}
