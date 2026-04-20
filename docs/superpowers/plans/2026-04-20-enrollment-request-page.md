# Enrollment Request Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a public enrollment request page at `/{lang}/enroll` with a program/duration form that POSTs to the ERDEM+ backend API, and update the home page to link to it.

**Architecture:** A lean server component (`app/[lang]/enroll/page.tsx`) loads i18n dict and passes it to a client form component (`components/EnrollmentForm.tsx`). Nav and Footer are extracted from `LandingPage.tsx` into shared components so both pages reuse them. Logo is also extracted since Nav and Footer both need it.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Lucide React, vanilla React `useState` for form state, `fetch` for API calls. No test framework is present in this project — verify visually by running `pnpm dev`.

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Create | `components/Logo.tsx` | LogoMark + Logo (shared by Nav and Footer) |
| Create | `components/Nav.tsx` | Shared navbar — logo, section links, lang switcher, "Enroll Now" CTA |
| Create | `components/Footer.tsx` | Shared footer — brand, columns, legal |
| Create | `components/EnrollmentForm.tsx` | `'use client'` — all form state, validation, submission, success state |
| Create | `app/[lang]/enroll/page.tsx` | Server component — loads dict, renders EnrollmentForm |
| Modify | `components/LandingPage.tsx` | Use Nav/Footer, remove waitlist section, add CTA block, update hero button |
| Modify | `dictionaries/en.json` | Add `nav.enroll`, update `hero.cta`, add `enroll` and `cta` sections |
| Modify | `dictionaries/mn.json` | Same structure in Mongolian |
| Modify | `.env.local` | Add `NEXT_PUBLIC_API_URL=http://localhost:3000` |

---

## Task 1: Environment + i18n strings

**Files:**
- Modify: `.env.local`
- Modify: `dictionaries/en.json`
- Modify: `dictionaries/mn.json`

- [ ] **Step 1: Add API URL to .env.local**

Append to `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

- [ ] **Step 2: Update dictionaries/en.json**

Add `"enroll": "Enroll Now"` inside the existing `"nav"` object.

Update `hero.cta` to `"Apply Now"`.

Add these two top-level keys:

```json
"enroll": {
  "badge": "Start Your Journey",
  "headline": "Apply to ERDEM+",
  "headlineAccent": "Today.",
  "subtitle": "Get access to adaptive learning, expert 1-on-1 counseling, and a personalized study plan — built around your goals.",
  "firstName": "First Name",
  "firstNamePlaceholder": "First name",
  "lastName": "Last Name",
  "lastNamePlaceholder": "Last name",
  "email": "Email",
  "emailPlaceholder": "your@email.com",
  "phone": "Phone",
  "phonePlaceholder": "Phone number",
  "programLabel": "Choose Your Program",
  "satMathTitle": "SAT Math",
  "satMathSubtitle": "Math section only",
  "satMathSkills": "19 skills",
  "satMathSessions": "3–4 sessions / week",
  "satFullTitle": "SAT Full",
  "satFullSubtitle": "Math + Reading & Writing",
  "satFullSkills": "29 skills",
  "satFullSessions": "6–8 sessions / week",
  "durationLabel": "Study Duration",
  "duration14": "14 days",
  "duration30": "30 days",
  "duration45": "45 days",
  "testDateLabel": "SAT Test Date",
  "testDateOptional": "Optional",
  "testDateHelper": "Don't know your test date yet? No problem — you can set this later.",
  "submit": "Submit Application",
  "submitting": "Submitting...",
  "successTitle": "Application Submitted!",
  "successBody": "Thank you, {firstName}! We've received your enrollment request for {program}.",
  "successBodyEmail": "Our team will review your application and send you an email at {email} with next steps. This usually takes 1–2 business days.",
  "backToHome": "Back to Home",
  "errorDuplicate": "An enrollment request with this email is already pending.",
  "errorGeneric": "Something went wrong. Please try again.",
  "errorFutureDate": "Test date must be in the future.",
  "errorRequired": "This field is required.",
  "errorInvalidEmail": "Please enter a valid email address."
},
"cta": {
  "badge": "Ready to Begin?",
  "title": "Start your SAT",
  "titleAccent": "journey today.",
  "subtitle": "Join students who are transforming their SAT scores with personalized learning and expert guidance.",
  "button": "Apply Now"
}
```

- [ ] **Step 3: Update dictionaries/mn.json**

Add `"enroll": "Элсэлт өгөх"` inside the existing `"nav"` object.

Update `hero.cta` to `"Өргөдөл гаргах"`.

Add these two top-level keys:

```json
"enroll": {
  "badge": "Аяллаа эхлүүл",
  "headline": "ERDEM+-д элсэх",
  "headlineAccent": "өнөөдөр.",
  "subtitle": "Дасан зохицдог сургалт, мэргэжлийн 1-1 зөвлөгөө болон хувийн суралцах төлөвлөгөө — таны зорилгод тохирсон.",
  "firstName": "Нэр",
  "firstNamePlaceholder": "Нэр",
  "lastName": "Овог",
  "lastNamePlaceholder": "Овог",
  "email": "И-мэйл",
  "emailPlaceholder": "your@email.com",
  "phone": "Утас",
  "phonePlaceholder": "Утасны дугаар",
  "programLabel": "Хөтөлбөрөө сонгоно уу",
  "satMathTitle": "SAT Математик",
  "satMathSubtitle": "Зөвхөн математик хэсэг",
  "satMathSkills": "19 чадвар",
  "satMathSessions": "7 хоногт 3–4 зөвлөгөө",
  "satFullTitle": "SAT Бүрэн",
  "satFullSubtitle": "Математик + Унших & Бичих",
  "satFullSkills": "29 чадвар",
  "satFullSessions": "7 хоногт 6–8 зөвлөгөө",
  "durationLabel": "Суралцах хугацаа",
  "duration14": "14 хоног",
  "duration30": "30 хоног",
  "duration45": "45 хоног",
  "testDateLabel": "SAT Тестийн огноо",
  "testDateOptional": "Заавал биш",
  "testDateHelper": "Тестийн огноогоо мэдэхгүй байна уу? Хамаагүй — дараа оруулж болно.",
  "submit": "Элсэлт илгээх",
  "submitting": "Илгээж байна...",
  "successTitle": "Элсэлт илгээгдлээ!",
  "successBody": "{firstName}, баярлалаа! Таны {program} хөтөлбөрт элсэх хүсэлтийг хүлээн авлаа.",
  "successBodyEmail": "Манай баг таны өргөдлийг хянаж, {email} хаягаар дараагийн алхмуудыг мэдэгдэх болно. Ихэвчлэн 1–2 ажлын өдөр шаардагдана.",
  "backToHome": "Нүүр хуудас руу буцах",
  "errorDuplicate": "Энэ и-мэйл хаягаар элсэлтийн хүсэлт аль хэдийн илгээгдсэн байна.",
  "errorGeneric": "Алдаа гарлаа. Дахин оролдоно уу.",
  "errorFutureDate": "Тестийн огноо ирээдүйд байх ёстой.",
  "errorRequired": "Энэ талбарыг бөглөх шаардлагатай.",
  "errorInvalidEmail": "Зөв и-мэйл хаяг оруулна уу."
},
"cta": {
  "badge": "Эхлэхэд бэлэн үү?",
  "title": "SAT аяллаа",
  "titleAccent": "өнөөдөр эхлүүл.",
  "subtitle": "Хувийн сургалт болон мэргэжлийн зөвлөгөөгөөр SAT оноогоо дээшлүүлж байгаа сурагчдад нэгд.",
  "button": "Өргөдөл гаргах"
}
```

- [ ] **Step 4: Commit**

```bash
git add .env.local dictionaries/en.json dictionaries/mn.json
git commit -m "feat: add enrollment i18n strings and API env config"
```

---

## Task 2: Extract Logo component

**Files:**
- Create: `components/Logo.tsx`

The `LogoMark` and `Logo` functions currently live inside `LandingPage.tsx` (lines 43–86). Extract them so Nav and Footer can import them without re-defining or importing from LandingPage.

- [ ] **Step 1: Create `components/Logo.tsx`**

```tsx
"use client";

import Image from "next/image";
import logoImg from "@/app/assets/logo.svg";
import { navLogoRef } from "@/components/navLogoRef";
import { useRef, useEffect } from "react";

export function LogoMark({
  size = 48,
  registerRef = false,
}: {
  size?: number;
  registerRef?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (registerRef) navLogoRef.current = ref.current;
  }, [registerRef]);
  return (
    <div ref={ref} style={{ width: size, height: size }}>
      <Image
        src={logoImg}
        alt="ERDEM+ puzzle logo"
        width={size}
        height={size}
        priority
      />
    </div>
  );
}

export function Logo({
  size = 48,
  registerRef = false,
}: {
  size?: number;
  registerRef?: boolean;
}) {
  const textSize = size * 0.45;
  return (
    <div className="flex items-center gap-1">
      <LogoMark size={size} registerRef={registerRef} />
      <span
        className="font-serif font-bold tracking-tight leading-none"
        style={{ fontSize: textSize, color: "#5C1F1F" }}
      >
        ERDEM<span style={{ color: "#E8A838", fontWeight: "100" }}>✚</span>
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Logo.tsx
git commit -m "feat: extract Logo and LogoMark to shared component"
```

---

## Task 3: Extract Nav component

**Files:**
- Create: `components/Nav.tsx`

The Nav uses `Logo`, `LanguageSwitcher`, and `dict.nav.*`. The CTA button changes from `onClick={scrollToWaitlist}` to a `<Link>` pointing to `/{lang}/enroll`. Nav links use `/{lang}#section-id` so they work from any page (including the enrollment page).

- [ ] **Step 1: Create `components/Nav.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/Nav.tsx
git commit -m "feat: extract Nav to shared component with enrollment CTA link"
```

---

## Task 4: Extract Footer component

**Files:**
- Create: `components/Footer.tsx`

The footer currently lives in LandingPage.tsx lines 1295–1393. It uses `Logo`, lucide social icons, and `dict.footer.*`. Rename the lucide `Link` icon import to `LinkIcon` to avoid a name clash with Next.js `Link`.

- [ ] **Step 1: Create `components/Footer.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { Globe, Share2, Link as LinkIcon, AtSign } from "lucide-react";
import { Logo } from "@/components/Logo";
import type { Dict } from "@/app/[lang]/dictionaries";

export default function Footer({ dict }: { dict: Dict }) {
  return (
    <footer
      className="py-16 px-6"
      style={{
        background: "#3D1010",
        borderTop: "1px solid rgba(232,168,56,0.08)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-14 mb-14">
          <div className="max-w-xs">
            <Logo size={40} />
            <p
              className="mt-4 text-sm leading-relaxed"
              style={{ color: "rgba(250,246,238,0.45)" }}
            >
              {dict.footer.brand.description}
            </p>
            <div className="flex gap-4 mt-5">
              {[Globe, Share2, LinkIcon, AtSign].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, color: "#E8A838" }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    background: "rgba(250,246,238,0.06)",
                    color: "rgba(250,246,238,0.4)",
                  }}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
            {dict.footer.columns.map((col) => (
              <div key={col.title}>
                <p
                  className="text-sm font-bold uppercase tracking-widest mb-4"
                  style={{ color: "rgba(250,246,238,0.3)" }}
                >
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors"
                        style={{ color: "rgba(250,246,238,0.5)" }}
                        onMouseEnter={(e) =>
                          ((e.target as HTMLElement).style.color = "#E8A838")
                        }
                        onMouseLeave={(e) =>
                          ((e.target as HTMLElement).style.color =
                            "rgba(250,246,238,0.5)")
                        }
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(250,246,238,0.06)" }}
        >
          <p className="text-sm" style={{ color: "rgba(250,246,238,0.25)" }}>
            {dict.footer.copyright}
          </p>
          <div className="flex gap-6">
            {dict.footer.legal.map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm transition-colors"
                style={{ color: "rgba(250,246,238,0.25)" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color =
                    "rgba(250,246,238,0.5)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color =
                    "rgba(250,246,238,0.25)")
                }
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: extract Footer to shared component"
```

---

## Task 5: Update LandingPage.tsx

Six focused edits to `components/LandingPage.tsx`. Make them in order; each is independent enough to verify before the next.

**Files:**
- Modify: `components/LandingPage.tsx`

### Current line references (verify before editing — line numbers may shift after prior edits):
- Imports: lines 1–41
- `LogoMark` definition: lines 43–65
- `Logo` definition: lines 67–86
- Main function start: line ~264
- Waitlist state vars: lines ~271–277
- `navItems` array: lines ~283–288
- `scrollToWaitlist` function: lines ~290–292
- `handleSubmit` function: lines ~294–321
- Nav JSX block: lines ~326–377
- Hero CTA button: lines ~470–486
- Waitlist section: lines ~1042–1292
- Footer JSX block: lines ~1295–1393

- [ ] **Step 1: Replace the import block (lines 1–41)**

Replace everything from `"use client";` through `import type { Dict }` with:

```tsx
"use client";

import Image from "next/image";
import ylaltImg from "@/app/assets/ylalt_naranbaatar.png";
import { useState, useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  BookOpen,
  Brain,
  LineChart,
  Video,
  Users,
  Target,
  Star,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  BarChart3,
  User,
} from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Dict } from "@/app/[lang]/dictionaries";
```

Removed from imports: `AnimatePresence` (only used in waitlist section), `Mail`, `Globe`, `Share2`, `Link` (lucide), `AtSign`, `Cross` (unused), `navLogoRef` (now in Logo.tsx). Logo and LogoMark local definitions come next.

- [ ] **Step 2: Delete the `LogoMark` and `Logo` function definitions**

Delete lines 43–86 (the two function definitions). These are now in `components/Logo.tsx`.

- [ ] **Step 3: Remove waitlist state, navItems, and functions from the main component**

Inside the `LandingPage` function body (after the `{`), delete:

```tsx
const [email, setEmail] = useState("");
const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [submitted, setSubmitted] = useState(false);
const [joining, setJoining] = useState(false);
const [waitlistError, setWaitlistError] = useState<string | null>(null);
const waitlistRef = useRef<HTMLElement>(null);
```

Delete the `navItems` array.

Delete the `scrollToWaitlist` function.

Delete the `handleSubmit` async function.

- [ ] **Step 4: Replace inline `<motion.nav>` block with `<Nav>` component**

Remove the entire `{/* ── Navbar */}` block (the `<motion.nav>…</motion.nav>` element) and replace with:

```tsx
<Nav dict={dict} lang={lang} registerLogoRef />
```

- [ ] **Step 5: Change the hero CTA from a button to a link**

Find the hero CTA `<motion.button onClick={scrollToWaitlist} …>` and replace the entire element with:

```tsx
<motion.a
  href={`/${lang}/enroll`}
  whileHover={{ scale: 1.03, y: -2 }}
  whileTap={{ scale: 0.97 }}
  className="group flex items-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-semibold text-base shadow-lg transition-all"
  style={{
    background: "linear-gradient(135deg, #C85A2A, #A0451F)",
    color: "#FAF6EE",
    boxShadow: "0 8px 24px rgba(200, 90, 42, 0.35)",
  }}
>
  {dict.hero.cta}
  <ArrowRight
    size={16}
    className="group-hover:translate-x-1 transition-transform"
  />
</motion.a>
```

- [ ] **Step 6: Replace the waitlist section with a CTA block**

Remove the entire `{/* ── Waitlist */}` section block (from `<section id="join-the-waitlist"` through `</section>`) and replace with:

```tsx
{/* ── CTA ─────────────────────────────────────────────────────────── */}
<section
  id="enroll"
  className="py-32 px-6 relative overflow-hidden"
  style={{ background: "#5C1F1F" }}
>
  <div
    className="absolute inset-0 puzzle-bg pointer-events-none"
    style={{ opacity: 0.08, filter: "brightness(2)" }}
  />
  <div
    className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
    style={{
      background:
        "radial-gradient(circle, rgba(232,168,56,0.12) 0%, transparent 70%)",
      transform: "translate(30%, -30%)",
    }}
  />
  <div
    className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
    style={{
      background:
        "radial-gradient(circle, rgba(200,90,42,0.1) 0%, transparent 70%)",
      transform: "translate(-30%, 30%)",
    }}
  />
  <div className="max-w-2xl mx-auto relative z-10 text-center">
    <FadeIn direction="up">
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-bold uppercase tracking-[0.1em]"
        style={{ background: "rgba(232,168,56,0.15)", color: "#E8A838" }}
      >
        <Sparkles size={12} />
        {dict.cta.badge}
      </div>
      <h2
        className="font-serif font-bold mb-6 leading-tight"
        style={{ fontSize: "clamp(1.75rem, 6vw, 3rem)", color: "#FAF6EE" }}
      >
        {dict.cta.title}
        <br />
        <span style={{ color: "#E8A838" }}>{dict.cta.titleAccent}</span>
      </h2>
      <p
        className="text-base leading-[1.7] mb-10"
        style={{ color: "rgba(250,246,238,0.6)" }}
      >
        {dict.cta.subtitle}
      </p>
      <motion.a
        href={`/${lang}/enroll`}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-base transition-all"
        style={{
          background: "linear-gradient(135deg, #C85A2A, #A0451F)",
          color: "#FAF6EE",
          boxShadow: "0 8px 24px rgba(200, 90, 42, 0.35)",
        }}
      >
        {dict.cta.button}
        <ArrowRight size={16} />
      </motion.a>
    </FadeIn>
  </div>
</section>
```

- [ ] **Step 7: Replace inline footer with `<Footer>` component**

Remove the entire `{/* ── Footer */}` block (`<footer>…</footer>`) and replace with:

```tsx
<Footer dict={dict} />
```

- [ ] **Step 8: Verify home page still builds**

```bash
pnpm dev
```

Open `http://localhost:3000/en`. Verify:
- Nav renders with "Enroll Now" button (clicking navigates to `/en/enroll`)
- Hero button says "Apply Now" and links to `/en/enroll`
- The dark CTA section appears where the waitlist was
- Footer renders correctly

- [ ] **Step 9: Commit**

```bash
git add components/LandingPage.tsx
git commit -m "feat: replace waitlist with enrollment CTA, use shared Nav/Footer in LandingPage"
```

---

## Task 6: Create EnrollmentForm component

**Files:**
- Create: `components/EnrollmentForm.tsx`

Full `'use client'` component with form state, validation, API submission, and success state. Uses `Nav` and `Footer`.

- [ ] **Step 1: Create `components/EnrollmentForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Dict } from "@/app/[lang]/dictionaries";

type ProgramType = "SAT_MATH" | "SAT_FULL";
type DurationDays = 14 | 30 | 45;

const inputBase: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid rgba(92,31,31,0.12)",
  borderRadius: "0.75rem",
  color: "#5C1F1F",
  outline: "none",
  width: "100%",
  padding: "0.875rem 1rem",
  fontSize: "0.9375rem",
  transition: "border-color 0.15s",
};

const inputError: React.CSSProperties = {
  ...inputBase,
  border: "1px solid #ef4444",
};

export default function EnrollmentForm({
  dict,
  lang,
}: {
  dict: Dict;
  lang: string;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [programType, setProgramType] = useState<ProgramType | null>(null);
  const [durationDays, setDurationDays] = useState<DurationDays | null>(null);
  const [targetTestDate, setTargetTestDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = dict.enroll.errorRequired;
    if (!lastName.trim()) errors.lastName = dict.enroll.errorRequired;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = dict.enroll.errorInvalidEmail;
    if (!phone.trim()) errors.phone = dict.enroll.errorRequired;
    if (!programType) errors.programType = dict.enroll.errorRequired;
    if (!durationDays) errors.durationDays = dict.enroll.errorRequired;
    if (targetTestDate) {
      const d = new Date(targetTestDate);
      if (isNaN(d.getTime()) || d <= new Date())
        errors.targetTestDate = dict.enroll.errorFutureDate;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setSubmitError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/academy/erdem/enrollment-request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phone,
            programType,
            durationDays,
            ...(targetTestDate ? { targetTestDate } : {}),
          }),
        }
      );
      if (res.status === 201) {
        setIsSuccess(true);
        return;
      }
      if (res.status === 409) {
        setSubmitError(dict.enroll.errorDuplicate);
        return;
      }
      if (res.status === 400) {
        const body = await res.json();
        const errors: Record<string, string> = {};
        if (Array.isArray(body.errors)) {
          for (const err of body.errors) {
            if (err.field) errors[err.field] = err.message;
          }
        }
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
        } else {
          setSubmitError(dict.enroll.errorGeneric);
        }
        return;
      }
      setSubmitError(dict.enroll.errorGeneric);
    } catch {
      setSubmitError(dict.enroll.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  }

  const programName =
    programType === "SAT_MATH"
      ? dict.enroll.satMathTitle
      : dict.enroll.satFullTitle;

  return (
    <div className="gradient-mesh min-h-screen overflow-x-hidden" style={{ background: "#FAF6EE" }}>
      <Nav dict={dict} lang={lang} />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-semibold tracking-wide"
            style={{
              background: "rgba(232,168,56,0.15)",
              color: "#C85A2A",
              border: "1px solid rgba(232,168,56,0.3)",
            }}
          >
            {dict.enroll.badge}
          </div>
          <h1
            className="font-serif font-bold leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 6vw, 3rem)", color: "#5C1F1F" }}
          >
            {dict.enroll.headline}{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #E8A838 30%, #C85A2A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {dict.enroll.headlineAccent}
            </span>
          </h1>
          <p
            className="text-base leading-[1.7] max-w-lg mx-auto"
            style={{ color: "#9B7B6B" }}
          >
            {dict.enroll.subtitle}
          </p>
        </motion.div>
      </section>

      {/* ── Form / Success ─────────────────────────────────────────────── */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl p-8 sm:p-10 space-y-8"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(92,31,31,0.06)",
                  boxShadow: "0 12px 40px rgba(92,31,31,0.10)",
                }}
              >
                {/* Error banner */}
                {submitError && (
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                    style={{
                      background: "rgba(200,90,42,0.08)",
                      border: "1px solid rgba(200,90,42,0.2)",
                      color: "#C85A2A",
                    }}
                  >
                    {submitError}
                  </div>
                )}

                {/* Personal info */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First name */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-1.5"
                        style={{ color: "#5C1F1F" }}
                      >
                        {dict.enroll.firstName}
                      </label>
                      <input
                        type="text"
                        placeholder={dict.enroll.firstNamePlaceholder}
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          clearFieldError("firstName");
                        }}
                        style={fieldErrors.firstName ? inputError : inputBase}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#E8A838";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = fieldErrors.firstName
                            ? "#ef4444"
                            : "rgba(92,31,31,0.12)";
                        }}
                      />
                      {fieldErrors.firstName && (
                        <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                          {fieldErrors.firstName}
                        </p>
                      )}
                    </div>
                    {/* Last name */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-1.5"
                        style={{ color: "#5C1F1F" }}
                      >
                        {dict.enroll.lastName}
                      </label>
                      <input
                        type="text"
                        placeholder={dict.enroll.lastNamePlaceholder}
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          clearFieldError("lastName");
                        }}
                        style={fieldErrors.lastName ? inputError : inputBase}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#E8A838";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = fieldErrors.lastName
                            ? "#ef4444"
                            : "rgba(92,31,31,0.12)";
                        }}
                      />
                      {fieldErrors.lastName && (
                        <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                          {fieldErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-1.5"
                      style={{ color: "#5C1F1F" }}
                    >
                      {dict.enroll.email}
                    </label>
                    <input
                      type="email"
                      placeholder={dict.enroll.emailPlaceholder}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearFieldError("email");
                      }}
                      style={fieldErrors.email ? inputError : inputBase}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#E8A838";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = fieldErrors.email
                          ? "#ef4444"
                          : "rgba(92,31,31,0.12)";
                      }}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-1.5"
                      style={{ color: "#5C1F1F" }}
                    >
                      {dict.enroll.phone}
                    </label>
                    <input
                      type="tel"
                      placeholder={dict.enroll.phonePlaceholder}
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        clearFieldError("phone");
                      }}
                      style={fieldErrors.phone ? inputError : inputBase}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#E8A838";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = fieldErrors.phone
                          ? "#ef4444"
                          : "rgba(92,31,31,0.12)";
                      }}
                    />
                    {fieldErrors.phone && (
                      <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Program selection */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-3"
                    style={{ color: "#5C1F1F" }}
                  >
                    {dict.enroll.programLabel}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(
                      [
                        {
                          value: "SAT_MATH" as ProgramType,
                          title: dict.enroll.satMathTitle,
                          subtitle: dict.enroll.satMathSubtitle,
                          skills: dict.enroll.satMathSkills,
                          sessions: dict.enroll.satMathSessions,
                        },
                        {
                          value: "SAT_FULL" as ProgramType,
                          title: dict.enroll.satFullTitle,
                          subtitle: dict.enroll.satFullSubtitle,
                          skills: dict.enroll.satFullSkills,
                          sessions: dict.enroll.satFullSessions,
                        },
                      ] as const
                    ).map((prog) => {
                      const selected = programType === prog.value;
                      return (
                        <motion.button
                          key={prog.value}
                          type="button"
                          onClick={() => {
                            setProgramType(prog.value);
                            clearFieldError("programType");
                          }}
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          className="text-left p-5 rounded-2xl transition-all"
                          style={{
                            background: selected
                              ? "rgba(200,90,42,0.06)"
                              : "#FFFFFF",
                            border: selected
                              ? "2px solid #C85A2A"
                              : "1px solid rgba(92,31,31,0.1)",
                            boxShadow: selected
                              ? "0 4px 16px rgba(200,90,42,0.12)"
                              : "0 2px 8px rgba(92,31,31,0.06)",
                          }}
                        >
                          <p
                            className="font-serif font-bold text-lg mb-1"
                            style={{ color: "#5C1F1F" }}
                          >
                            {prog.title}
                          </p>
                          <p
                            className="text-sm mb-3"
                            style={{ color: "#9B7B6B" }}
                          >
                            {prog.subtitle}
                          </p>
                          <div className="space-y-1">
                            <p
                              className="text-xs font-semibold"
                              style={{ color: "#C85A2A" }}
                            >
                              {prog.skills}
                            </p>
                            <p className="text-xs" style={{ color: "#8B4513" }}>
                              {prog.sessions}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                  {fieldErrors.programType && (
                    <p className="text-xs mt-2" style={{ color: "#ef4444" }}>
                      {fieldErrors.programType}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-3"
                    style={{ color: "#5C1F1F" }}
                  >
                    {dict.enroll.durationLabel}
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {(
                      [
                        { value: 14 as DurationDays, label: dict.enroll.duration14 },
                        { value: 30 as DurationDays, label: dict.enroll.duration30 },
                        { value: 45 as DurationDays, label: dict.enroll.duration45 },
                      ] as const
                    ).map((d) => {
                      const selected = durationDays === d.value;
                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => {
                            setDurationDays(d.value);
                            clearFieldError("durationDays");
                          }}
                          className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all"
                          style={{
                            background: selected ? "#5C1F1F" : "#FAF6EE",
                            color: selected ? "#FAF6EE" : "#9B7B6B",
                            border: selected
                              ? "1px solid #5C1F1F"
                              : "1px solid rgba(92,31,31,0.2)",
                          }}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                  {fieldErrors.durationDays && (
                    <p className="text-xs mt-2" style={{ color: "#ef4444" }}>
                      {fieldErrors.durationDays}
                    </p>
                  )}
                </div>

                {/* Test date */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <label
                      className="block text-sm font-semibold"
                      style={{ color: "#5C1F1F" }}
                    >
                      {dict.enroll.testDateLabel}
                    </label>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: "rgba(232,168,56,0.15)",
                        color: "#C85A2A",
                      }}
                    >
                      {dict.enroll.testDateOptional}
                    </span>
                  </div>
                  <input
                    type="date"
                    value={targetTestDate}
                    onChange={(e) => {
                      setTargetTestDate(e.target.value);
                      clearFieldError("targetTestDate");
                    }}
                    style={fieldErrors.targetTestDate ? inputError : inputBase}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#E8A838";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = fieldErrors.targetTestDate
                        ? "#ef4444"
                        : "rgba(92,31,31,0.12)";
                    }}
                  />
                  <p className="text-xs mt-1.5" style={{ color: "#9B7B6B" }}>
                    {dict.enroll.testDateHelper}
                  </p>
                  {fieldErrors.targetTestDate && (
                    <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                      {fieldErrors.targetTestDate}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={isLoading ? {} : { scale: 1.03, y: -2 }}
                  whileTap={isLoading ? {} : { scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-full font-semibold text-base transition-all"
                  style={{
                    background: isLoading
                      ? "rgba(200,90,42,0.5)"
                      : "linear-gradient(135deg, #C85A2A, #A0451F)",
                    color: "#FAF6EE",
                    boxShadow: isLoading
                      ? "none"
                      : "0 8px 24px rgba(200,90,42,0.3)",
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {dict.enroll.submitting}
                    </>
                  ) : (
                    <>
                      {dict.enroll.submit}
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              /* ── Success state ──────────────────────────────────────── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="rounded-3xl p-10 sm:p-14 text-center"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(92,31,31,0.06)",
                  boxShadow: "0 12px 40px rgba(92,31,31,0.10)",
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="flex justify-center mb-6"
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(232,168,56,0.15)" }}
                  >
                    <CheckCircle size={40} style={{ color: "#E8A838" }} />
                  </div>
                </motion.div>

                <h2
                  className="font-serif font-bold mb-4"
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    color: "#5C1F1F",
                  }}
                >
                  {dict.enroll.successTitle}
                </h2>

                <p
                  className="text-base leading-[1.7] mb-3"
                  style={{ color: "#5C1F1F" }}
                >
                  {dict.enroll.successBody
                    .replace("{firstName}", firstName)
                    .replace("{program}", programName ?? "")}
                </p>

                <p
                  className="text-sm leading-[1.7] mb-8"
                  style={{ color: "#9B7B6B" }}
                >
                  {dict.enroll.successBodyEmail.replace("{email}", email)}
                </p>

                <motion.a
                  href={`/${lang}`}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all"
                  style={{ background: "#5C1F1F", color: "#FAF6EE" }}
                >
                  {dict.enroll.backToHome}
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer dict={dict} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/EnrollmentForm.tsx
git commit -m "feat: add EnrollmentForm with full form state, validation, and submission"
```

---

## Task 7: Create enrollment page route

**Files:**
- Create: `app/[lang]/enroll/page.tsx`

Server component. Loads dict, renders `<EnrollmentForm>`. Exports metadata.

Note: Next.js 16 auto-generates `PageProps<"/[lang]/enroll">` after the first build/dev run. Until then, use explicit `Promise<{ lang: string }>` typing.

- [ ] **Step 1: Create `app/[lang]/enroll/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import EnrollmentForm from "@/components/EnrollmentForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: `${dict.enroll.headline} — ERDEM+`,
    description: dict.enroll.subtitle,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <EnrollmentForm dict={dict} lang={lang} />;
}
```

- [ ] **Step 2: Run dev and verify the enrollment page**

```bash
pnpm dev
```

Open `http://localhost:3000/en/enroll`. Check:
- Nav renders with "Enroll Now" button
- Hero badge, headline, and subtitle are visible
- White form card with all fields visible
- Program cards (SAT Math / SAT Full) are clickable; selected card gets orange border + tint
- Duration pills (14 / 30 / 45 days) are clickable; selected pill gets dark brown bg
- Test date input is visible with "Optional" badge and helper text below

- [ ] **Step 3: Verify client-side validation**

Without filling any fields, click "Submit Application". Verify:
- Red error messages appear below each empty field
- Red error appears below the program cards section
- Red error appears below the duration pills section
- No API call was made

- [ ] **Step 4: Verify language switching**

Navigate to `http://localhost:3000/mn/enroll`. Check that all labels, placeholders, and button text are in Mongolian.

- [ ] **Step 5: Commit**

```bash
git add app/[lang]/enroll/
git commit -m "feat: add enrollment request page route at /[lang]/enroll"
```
