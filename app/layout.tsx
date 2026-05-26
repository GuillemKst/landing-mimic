import type { Metadata } from 'next';
import '@/styles/tokens.css';
import '@/styles/buttons.css';

export const metadata: Metadata = {
  title: 'MIMIC — Crea guiones de vídeo desde lo que ya funciona en tu mercado',
  description: 'MIMIC selecciona los anuncios ganadores de tu sector y genera guiones de vídeo originales adaptados a tu negocio. Hook, estructura, ángulo y CTA que el mercado ya demostró que convierte.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
