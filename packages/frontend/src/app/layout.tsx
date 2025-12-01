import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import './globals.css';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

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
    <html lang="en" className={bricolageGrotesque.variable}>
      <body>{children}</body>
    </html>
  );
}
