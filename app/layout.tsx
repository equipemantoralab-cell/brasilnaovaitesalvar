import type { Metadata } from 'next';
import './globals.css';
import AnalyticsGA4 from '@/components/AnalyticsGA4';
import MetaPixel from '@/components/MetaPixel';
import { Barlow_Condensed, Manrope } from 'next/font/google';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

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
      <body className={`${manrope.variable} ${barlowCondensed.variable} font-sans antialiased`}>
        <AnalyticsGA4 />
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
