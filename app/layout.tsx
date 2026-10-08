import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import AnalyticsGA4 from '@/components/AnalyticsGA4';
import MetaPixel from '@/components/MetaPixel';

export const metadata: Metadata = {
  title: 'O Brasil Não Vai Te Salvar — Imersão ao Vivo',
  description:
    'Pare de esperar sua vida melhorar. Construa, em uma tarde, um plano para fazer seus próximos 4 meses valerem mais que os últimos 4 anos. 31 de outubro, 15h, 100% on-line.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "yujlsp8dtn");`}
        </Script>
        <AnalyticsGA4 />
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
