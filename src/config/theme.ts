/**
 * ВНЕШНИЙ ВИД САЙТА — ОДНО СЛОВО.
 *
 *   carbon — тёмный перформанс: почти чёрный, лаймовый акцент, стекло и свечение
 *   studio — светлый минимализм: воздух, синий акцент, крупная типографика
 *   signal — индустриальный контраст: бетон, сигнальный оранжевый, острые углы
 *
 * Меняется только эта строка. Компоненты о теме не знают:
 * весь визуал приходит из CSS-переменных в globals.css.
 */
export const THEME: ThemeName = "carbon";

export type ThemeName = "carbon" | "studio" | "signal";

export const themeNames: ThemeName[] = ["carbon", "studio", "signal"];

/** Показ клиенту без пересборки: ?theme=studio в адресе */
export const ALLOW_THEME_QUERY = true;
