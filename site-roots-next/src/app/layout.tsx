import type { Metadata } from 'next';
import { manrope } from '@/lib/fonts';
import './globals.css';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import FilmGrain from '@/components/effects/FilmGrain';
import CustomCursor from '@/components/effects/CustomCursor';
import ScrollProgressLine from '@/components/effects/ScrollProgressLine';
import AmbientOrbs from '@/components/effects/AmbientOrbs';
import VignetteOverlay from '@/components/effects/VignetteOverlay';

export const metadata: Metadata = {
  title: 'Root Code — Eficiência Silenciosa',
  description:
    'Cultivando ecossistemas digitais onde a complexidade técnica floresce em simplicidade arquitetônica.',
  openGraph: {
    title: 'Root Code — Eficiência Silenciosa',
    description:
      'Cultivando ecossistemas digitais onde a complexidade técnica floresce em simplicidade arquitetônica.',
    type: 'website',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body className={manrope.className}>
        <SmoothScrollProvider>
          {/* Global Effects */}
          <AmbientOrbs />
          <VignetteOverlay />
          <FilmGrain />
          <CustomCursor />
          <ScrollProgressLine />

          {/* Page Content */}
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
