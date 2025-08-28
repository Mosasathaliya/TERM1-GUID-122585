import type { Metadata, Viewport } from 'next'
import { Tajawal, Cairo } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './providers'
import AppLayout from '@/components/layout/AppLayout'
import AnimatedBackground from '@/components/layout/AnimatedBackground'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'

// Load fonts with display: 'swap' for better performance
const tajawal = Tajawal({ 
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'swap'
})

const cairo = Cairo({ 
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'الدليل - The Guide',
  description: 'تعلم اللغة الإنجليزية بطريقة تفاعلية وممتعة',
  keywords: 'تعلم الإنجليزية, لغة إنجليزية, دروس تفاعلية, تطبيق تعليمي',
  authors: [{ name: 'الدليل' }],
  creator: 'الدليل',
  publisher: 'الدليل',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'الدليل - The Guide',
    description: 'تعلم اللغة الإنجليزية بطريقة تفاعلية وممتعة',
    type: 'website',
    locale: 'ar_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الدليل - The Guide',
    description: 'تعلم اللغة الإنجليزية بطريقة تفاعلية وممتعة',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="الدليل" />
        <meta name="application-name" content="الدليل" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3B82F6" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${tajawal.variable} ${cairo.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <AnimatedBackground />
            <AppLayout>
              {children}
            </AppLayout>
            <ServiceWorkerRegistration />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
