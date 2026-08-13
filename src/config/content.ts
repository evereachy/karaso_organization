import type { FaqItem, GalleryItem, Review } from "@/types";

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Павел М.",
    rating: 5,
    serviceTitle: "Подвеска",
    text: "Приехал с ошибкой на панели после другого сервиса. Показали на подъёмнике, что именно течёт, и не стали менять всё подряд. По деньгам вышло вдвое меньше первой сметы.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=70",
  },
  {
    id: "r2",
    name: "Ирина К.",
    rating: 5,
    serviceTitle: "Замена масла",
    text: "Первый сервис, где не пытались продать «промывку двигателя» и ещё три позиции сверху. Сделали то, за чем приехала, за час.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=70",
  },
  {
    id: "r3",
    name: "Дмитрий С.",
    rating: 5,
    serviceTitle: "Диагностика перед покупкой",
    text: "Смотрели машину, которую я собирался брать. Нашли следы кузовного ремонта, о которых продавец молчал. Две тысячи крон сэкономили мне двести.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=70",
  },
  {
    id: "r4",
    name: "Анна Р.",
    rating: 4,
    serviceTitle: "Тормоза",
    text: "Работой довольна, всё объяснили и показали старые колодки. Минус — ждала запчасть три дня, хотя обещали два.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=70",
  },
];

export const faq: FaqItem[] = [
  {
    id: "f1",
    question: "Расчёт на сайте — это окончательная цена?",
    answer:
      "Нет, это стоимость работ для вашего класса машины без запчастей. Точную сумму мастер называет после осмотра и согласует до начала работ. Больше названного не берём.",
  },
  {
    id: "f2",
    question: "Можно приехать со своими запчастями?",
    answer:
      "Да. На работу гарантия сохраняется, на саму деталь — нет: мы не знаем, где она куплена и что с ней было. Если деталь окажется неподходящей, скажем до начала работ.",
  },
  {
    id: "f3",
    question: "Сколько ждать запчасти?",
    answer:
      "Расходники обычно есть на складе. Остальное приходит за один-три рабочих дня, редкие позиции дольше. Срок называем при согласовании сметы.",
  },
  {
    id: "f4",
    question: "Что если поломка не подтвердится?",
    answer:
      "Диагностику в этом случае не берём. Платить за то, что мы ничего не нашли, вы не должны.",
  },
  {
    id: "f5",
    question: "Машину можно оставить на ночь?",
    answer:
      "Да, площадка под камерами и закрывается. Предупредите заранее — оставим место у ворот, чтобы не выгонять другие машины утром.",
  },
];

export const gallery: GalleryItem[] = [
  { id: "g1", src: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=700&q=70", alt: "Ремонтная зона" },
  { id: "g2", src: "https://images.unsplash.com/photo-1632823471565-1ecdf5e63d64?auto=format&fit=crop&w=700&q=70", alt: "Компьютерная диагностика" },
  { id: "g3", src: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=700&q=70", alt: "Работа с двигателем" },
  { id: "g4", src: "https://images.unsplash.com/photo-1607603750909-408e193868c7?auto=format&fit=crop&w=700&q=70", alt: "Шиномонтаж" },
  { id: "g5", src: "https://images.unsplash.com/photo-1600661653561-629509216228?auto=format&fit=crop&w=700&q=70", alt: "Тормозная система" },
  { id: "g6", src: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=700&q=70", alt: "Машина на подъёмнике" },
];
