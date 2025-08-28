import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'MoodSpeak',
  description: 'Translate your mood with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Body tag is intentionally left empty, theme/lang attributes added in page.tsx */}
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
