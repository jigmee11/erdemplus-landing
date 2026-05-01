"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import type { Dict } from "@/app/[lang]/dictionaries";

export default function Nav({
  dict,
  lang,
  registerLogoRef = false,
}: {
  dict: Dict;
  lang: string;
  registerLogoRef?: boolean;
}) {
  const navItems = [
    { label: dict.nav.howItWorks, href: `/${lang}#how-it-works` },
    { label: dict.nav.features, href: `/${lang}#features` },
    { label: dict.nav.scholarships, href: `/${lang}#scholarships` },
    { label: dict.nav.counselors, href: `/${lang}#counselors` },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3.5 sm:py-5"
      style={{
        background: "rgba(250, 246, 238, 0.88)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(232, 168, 56, 0.12)",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href={`/${lang}`}>
          <Logo size={44} registerRef={registerLogoRef} />
        </Link>
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium tracking-wide transition-colors"
              style={{ color: "#9B7B6B" }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "#5C1F1F")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "#9B7B6B")
              }
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher lang={lang} />
          <Link
            href={`/${lang}/enroll`}
            className="text-sm font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all"
            style={{ background: "#5C1F1F", color: "#FAF6EE" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#C85A2A")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#5C1F1F")
            }
          >
            {dict.nav.enroll}
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
