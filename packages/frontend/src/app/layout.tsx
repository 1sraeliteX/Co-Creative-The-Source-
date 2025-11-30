import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Source HUB - Creative-Tech Hub for African Innovators',
  description: 'Reliable power, fast internet, and collaborative workspace with flexible pricing. Build, learn, and scale without infrastructure holding you back.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
