import { Space_Grotesk } from "next/font/google";
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
import LoginPopup from "@/components/LoginPopup";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: '%s - IntelForgeeks.com',
    default: 'IntelForgeeks.com',
  },
  description: 'At IntelForgeeks, we cover everything tech. From detailed tutorials and the latest tech news to essential roadmaps and innovative tools, we provide the resources you need to navigate the tech landscape.',
  applicationName: 'IntelForgeeks.com',
  referrer: 'origin-when-cross-origin',
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
  authors: [{ name: 'IntelForgeeks.com' }, { name: 'IntelForgeeks.com', url: 'https://www.intelforgeeks.com' }],
  creator: 'IntelForgeeks.com',
  publisher: 'IntelForgeeks.com',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  og: {
    url: 'https://www.intelforgeeks.com',
    type: 'website',
    title: 'IntelForgeeks.com - Explore the Tech World',
    description: 'Discover in-depth articles on new tech trends, tutorials, and tools at IntelForgeeks.com.',
    image: 'https://www.intelforgeeks.com/og-image.jpg',
    site_name: 'IntelForgeeks.com'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@IntelForgeeks',
    title: 'IntelForgeeks.com - Explore the Tech World',
    description: 'Discover in-depth articles on new tech trends, tutorials, and tools at IntelForgeeks.com.',
    image: 'https://www.intelforgeeks.com/twitter-image.jpg',
    creator: '@IntelForgeeks'
  },

}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Script id="next"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=G-T0D68EHC4S`}>
      </Script>
      <Script id="next">
        {
          `window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-T0D68EHC4S');`
        }
      </Script>
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5593264837587690"
        crossorigin="anonymous"></Script>
      <body className={spaceGrotesk.className}>
        <NextTopLoader
          color="rgba(147, 112, 219, 0.8)"
          initialPosition={0.08}
          crawlSpeed={500}
          height={4}
          crawl={true}
          showSpinner={false}
          easing="ease-in-out"
          speed={500}
          shadow="0 0 20px rgba(147, 112, 219, 0.6), 0 0 40px rgba(147, 112, 219, 0.4)"
          style={{ backdropFilter: 'blur(8px)' }}
        />
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <ToastProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
                storageKey="intelforgeeks-theme"
              >
                <Header></Header>

                <div className="min-h-[100dvh]">
                  {children}
                </div>
                <SpeedInsights />
                <ScrollToTop />
                <LoginPopup />
                <Footer />
              </ThemeProvider>
            </ToastProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}



