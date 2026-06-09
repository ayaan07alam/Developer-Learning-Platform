import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from "@/components/theme-provider"
import NextTopLoader from "nextjs-toploader";
import ScrollToTop from "@/components/ScrollToTop";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL('https://runtimeriver.com'),
  title: {
    template: '%s - RuntimeRiver',
    default: 'RuntimeRiver - Code, Content & Community',
  },
  description: 'The open developer ecosystem. Read and **write** technical articles, run code instantly, and build your profile. Join 10,000+ developers contributing to the flow.',
  applicationName: 'RuntimeRiver',
  referrer: 'origin-when-cross-origin',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  keywords: ["Next.js",
    "React",
    "JavaScript",
    "software development",
    "programming tutorials",
    "tech news",
    "developer tools",
    "coding basics",
    "advanced programming",
    "web development",
    "front-end development",
    "back-end development",
    "full stack development",
    "technology trends",
    "coding bootcamps",
    "machine learning",
    "data science",
    "AI trends",
    "software architecture",
    "tech industry updates", "tech tutorials",
    "latest tech news",
    "technology roadmaps",
    "tech industry updates",
    "coding tutorials",
    "software development guides",
    "programming languages",
    "tech tools review",
    "technology learning resources",
    "IT news",
    "technology trends",
    "beginner programming",
    "developer tools",
    "software engineering",
    "tech innovations",
    "web development tutorials",
    "mobile app development",
    "tech career roadmap",
    "coding for beginners",
    "tech tutorials for professionals"],
  authors: [{ name: 'RuntimeRiver' }, { name: 'RuntimeRiver', url: 'https://www.runtimeriver.com' }],
  creator: 'RuntimeRiver',
  publisher: 'RuntimeRiver',
  verification: {
    google: 'aeNpbPn8hSJRS59Qdhdb-h4OPd1O-zzdguVsm1aUVA8',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    url: 'https://www.runtimeriver.com',
    type: 'website',
    title: 'RuntimeRiver - Code, Content & Community',
    description: 'Read and **write** technical articles, run code instantly, and build your profile. The open community for developers.',
    images: ['https://www.runtimeriver.com/og-image.jpg'],
    siteName: 'RuntimeRiver'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@RuntimeRiver',
    title: 'RuntimeRiver - Read, Write, Run',
    description: 'Read articles, write your own, and run code instantly.',
    images: ['https://www.runtimeriver.com/twitter-image.jpg'],
    creator: '@RuntimeRiver'
  },

}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RuntimeRiver',
    alternateName: ['Runtime River', 'RuntimeRiver.com'],
    url: 'https://www.runtimeriver.com',
  }

  return (
    <html lang="en">
      <head>
        <Script id="ga-script"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-S7LJXQ788V`}>
        </Script>
        <Script id="ga-init" strategy="afterInteractive">
          {
            `window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', 'G-S7LJXQ788V');`
          }
        </Script>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script strategy="afterInteractive" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5593264837587690"
          crossOrigin="anonymous"></Script>
      </head>
      <body className={`${inter.variable} ${inter.className}`}>
        <NextTopLoader
          color="#007272"
          initialPosition={0.08}
          crawlSpeed={300}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={300}
          shadow="none"
        />
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <ToastProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
                storageKey="runtimeriver-theme"
              >
                <div className="relative flex flex-col min-h-[100dvh] w-full overflow-x-clip">
                  <a href="#main-content" className="skip-to-content">Skip to content</a>
                  <Header />
                  <main id="main-content" className="flex-1 w-full flex flex-col">
                    {children}
                  </main>
                  <Footer />
                </div>
                <SpeedInsights />
                <ScrollToTop />
              </ThemeProvider>
            </ToastProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}



