import RequestStatus from "@/modules/RequestStatus/requestStatus";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <title>Fast-Door — Управление установщиками дверей</title>

        {/* Open Graph */}
        <meta property="og:title" content="Fast-Door — Управление установщиками дверей" />
        <meta property="og:description" content="Fast-Door — система управления установщиками дверей в Новосибирске. Планирование, учет и контроль работы установщиков." />
        <meta property="og:image" content="/preview.png" />
        <meta property="og:image:alt" content="Fast-Door — управление установщиками дверей" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://fast-door.ru" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />

        {/* Стандартное SEO */}
        <meta name="description" content="Fast-Door — система управления установщиками дверей в Новосибирске. Планирование, учет и контроль работы установщиков." />
        <meta name="keywords" content="Fast-Door, двери, установка дверей, контроль установщиков, отчетность, Новосибирск" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fast-door.ru" />

      </head>
      <body>
        {children}
        <RequestStatus />
      </body>
    </html>
  );
}
