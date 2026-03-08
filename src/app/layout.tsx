import RequestStatus from "@/modules/RequestStatus/requestStatus";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <title>Fast-Door</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="description" content="Fast-Door — система управления установщиками дверей в Новосибирске"></meta>
      </head>
      <body>
        {children}
        <RequestStatus />
      </body>
    </html>
  );
}
