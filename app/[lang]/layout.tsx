import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "../globals.css";
import SplashScreen from "@/components/SplashScreen";
import { getDictionary, hasLocale } from "./dictionaries";
import { notFound } from "next/navigation";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ERDEM+",
  description:
    "Self-paced SAT learning platform with 1-on-1 expert counseling. Adaptive practice, video lessons, and personalized study plans.",
};

export async function generateStaticParams() {
  return [{ lang: "mn" }, { lang: "en" }];
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SplashScreen tagline={dict.splashTagline} />
        {children}
      </body>
    </html>
  );
}
