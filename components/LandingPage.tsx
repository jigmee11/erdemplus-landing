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
import ScholarshipFinder from "@/components/ScholarshipFinder";
import type { Dict } from "@/app/[lang]/dictionaries";

// ─── Puzzle Piece Decorative SVG ────────────────────────────────────────────
function PuzzlePiece({
  color = "#E8A838",
  opacity = 0.15,
  size = 80,
  rotate = 0,
}: {
  color?: string;
  opacity?: number;
  size?: number;
  rotate?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity, transform: `rotate(${rotate}deg)` }}
    >
      <rect x="4" y="4" width="72" height="72" rx="8" fill={color} />
      <rect x="72" y="30" width="10" height="20" rx="5" fill={color} />
      <rect x="30" y="72" width="20" height="10" rx="5" fill={color} />
    </svg>
  );
}

// ─── Connecting dots motif ───────────────────────────────────────────────────
function ConnectingDots() {
  return (
    <svg width="120" height="12" viewBox="0 0 120 12" fill="none">
      <circle cx="6" cy="6" r="5" fill="#E8A838" fillOpacity="0.6" />
      <line
        x1="11"
        y1="6"
        x2="35"
        y2="6"
        stroke="#E8A838"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <circle cx="40" cy="6" r="5" fill="#C85A2A" fillOpacity="0.5" />
      <line
        x1="45"
        y1="6"
        x2="69"
        y2="6"
        stroke="#C85A2A"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <circle cx="74" cy="6" r="5" fill="#E8A838" fillOpacity="0.6" />
      <line
        x1="79"
        y1="6"
        x2="103"
        y2="6"
        stroke="#E8A838"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <circle cx="108" cy="6" r="5" fill="#C85A2A" fillOpacity="0.5" />
    </svg>
  );
}

// ─── Fade-in wrapper ─────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const dirMap = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { y: 0, x: 30 },
    right: { y: 0, x: -30 },
    none: { y: 0, x: 0 },
  };
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...dirMap[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Counter ─────────────────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const dur = 1800;
    const steps = 60;
    const step = target / steps;
    let cur = 0;
    const interval = setInterval(() => {
      cur = Math.min(cur + step, target);
      setCount(Math.floor(cur));
      if (cur >= target) clearInterval(interval);
    }, dur / steps);
    return () => clearInterval(interval);
  }, [isInView, target]);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          className={i <= rating ? "fill-current" : ""}
          style={{ color: i <= rating ? "#E8A838" : "#D4B896" }}
        />
      ))}
    </div>
  );
}

// ─── Static data (non-translatable) ─────────────────────────────────────────
const STEP_META = [
  { number: "01", icon: BookOpen, color: "#E8A838" },
  { number: "02", icon: Target, color: "#C85A2A" },
  { number: "03", icon: Users, color: "#E8A838" },
];

const FEATURE_ICONS = [Target, Brain, Users, BookOpen, BarChart3];

const COUNSELOR_META = [
  {
    specialtyColor: "#C85A2A",
    rating: 5,
    initials: "YN",
    photo: ylaltImg,
    bg: "#F5D8CC",
    featured: true,
  },
  {
    specialtyColor: "#E8A838",
    rating: 5,
    initials: "J",
    photo: null,
    bg: "#F7E8C8",
    featured: false,
  },
];

// const TESTIMONIAL_META = [
//   { before: 980, after: 1420, initials: "AP", color: "#E8A838" },
//   { before: 1050, after: 1380, initials: "SR", color: "#C85A2A" },
//   { before: 1120, after: 1510, initials: "MC", color: "#E8A838" },
// ];

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function LandingPage({
  dict,
  lang,
}: {
  dict: Dict;
  lang: string;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="gradient-mesh min-h-screen overflow-x-hidden">
      <Nav dict={dict} lang={lang} registerLogoRef />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-[100svh] flex items-center pt-28 sm:pt-24 pb-12 sm:pb-20 overflow-hidden"
      >
        <motion.div
          style={{ y: heroY }}
          className="absolute top-20 right-8 float opacity-60 pointer-events-none hidden lg:block"
        >
          <PuzzlePiece color="#E8A838" size={120} opacity={0.18} rotate={15} />
        </motion.div>
        <motion.div
          style={{ y: heroY }}
          className="absolute bottom-32 right-24 float-delayed pointer-events-none hidden lg:block"
        >
          <PuzzlePiece color="#C85A2A" size={80} opacity={0.12} rotate={-20} />
        </motion.div>
        <motion.div
          style={{ y: heroY }}
          className="absolute top-40 left-8 float-delayed pointer-events-none hidden lg:block"
        >
          <PuzzlePiece color="#E8A838" size={60} opacity={0.1} rotate={30} />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="max-w-6xl mx-auto px-5 sm:px-6 w-full"
        >
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-5 sm:mb-7 text-xs sm:text-sm font-semibold tracking-wide"
                style={{
                  background: "rgba(232, 168, 56, 0.15)",
                  color: "#C85A2A",
                  border: "1px solid rgba(232, 168, 56, 0.3)",
                }}
              >
                <Sparkles size={13} />
                {dict.hero.badge}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="font-serif font-bold leading-[1.1] sm:leading-[1.08] tracking-tight mb-5 sm:mb-7"
                style={{
                  fontSize: "clamp(2rem, 7vw, 3.8rem)",
                  color: "#5C1F1F",
                }}
              >
                {dict.hero.title}{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #E8A838 30%, #C85A2A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {dict.hero.titleAccent}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-base sm:text-lg leading-[1.65] sm:leading-[1.7] mb-8 sm:mb-10 max-w-lg"
                style={{ color: "#9B7B6B" }}
              >
                {dict.hero.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
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
              </motion.div>
            </div>

            {/* Right: mock dashboard card */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="relative hidden lg:block"
            >
              <div
                className="rounded-3xl p-8 relative overflow-hidden"
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    "0 24px 64px rgba(92, 31, 31, 0.12), 0 4px 16px rgba(92,31,31,0.06)",
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-[0.08em] mb-1"
                      style={{ color: "#9B7B6B" }}
                    >
                      {dict.heroCard.yourProgress}
                    </p>
                    <p
                      className="font-serif font-bold text-xl"
                      style={{ color: "#5C1F1F" }}
                    >
                      {dict.heroCard.scoreTrajectory}
                    </p>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: "rgba(232,168,56,0.12)",
                      color: "#C85A2A",
                    }}
                  >
                    +330 pts
                  </div>
                </div>

                <div className="flex items-end gap-3 mb-6 h-28">
                  {[45, 52, 58, 66, 72, 79, 88, 96].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{
                        delay: 0.6 + i * 0.06,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                      className="flex-1 rounded-t-lg"
                      style={{
                        background:
                          i === 7
                            ? "linear-gradient(180deg, #C85A2A, #A0451F)"
                            : i >= 5
                            ? "rgba(232,168,56,0.7)"
                            : "rgba(232,168,56,0.25)",
                      }}
                    />
                  ))}
                </div>

                <div
                  className="flex justify-between text-sm mb-8"
                  style={{ color: "#9B7B6B" }}
                >
                  <span>{dict.heroCard.week1}</span>
                  <span>{dict.heroCard.week8}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    {
                      label: dict.heroCard.startScore,
                      value: "1080",
                      sub: dict.heroCard.baseline,
                      accent: false,
                    },
                    {
                      label: dict.heroCard.current,
                      value: "1410",
                      sub: "↑ 330 pts",
                      accent: true,
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl p-4"
                      style={{
                        background: s.accent
                          ? "linear-gradient(135deg, rgba(200,90,42,0.08), rgba(232,168,56,0.08))"
                          : "rgba(250,246,238,0.8)",
                        border: s.accent
                          ? "1px solid rgba(232,168,56,0.3)"
                          : "1px solid rgba(92,31,31,0.06)",
                      }}
                    >
                      <p className="text-sm mb-1" style={{ color: "#9B7B6B" }}>
                        {s.label}
                      </p>
                      <p
                        className="font-serif font-bold text-2xl"
                        style={{ color: s.accent ? "#C85A2A" : "#5C1F1F" }}
                      >
                        {s.value}
                      </p>
                      <p
                        className="text-sm font-semibold mt-0.5"
                        style={{ color: s.accent ? "#E8A838" : "#9B7B6B" }}
                      >
                        {s.sub}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  className="flex items-center gap-3 rounded-2xl p-4"
                  style={{
                    background: "rgba(250,246,238,0.9)",
                    border: "1px solid rgba(92,31,31,0.06)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: "#E8A838", color: "#FAF6EE" }}
                  >
                    LM
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#5C1F1F" }}
                    >
                      {dict.heroCard.counselorName}
                    </p>
                    <p
                      className="text-sm truncate"
                      style={{ color: "#9B7B6B" }}
                    >
                      {dict.heroCard.nextSession}
                    </p>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(200,90,42,0.1)" }}
                  >
                    <ChevronRight size={14} color="#C85A2A" />
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-32 px-6 relative overflow-hidden"
      >
        <div className="absolute top-16 right-0 pointer-events-none opacity-40 hidden lg:block">
          <PuzzlePiece color="#E8A838" size={200} opacity={0.05} rotate={10} />
        </div>
        <div className="max-w-5xl mx-auto">
          <FadeIn direction="up" className="text-center mb-4">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.1em] px-4 py-2 rounded-full mb-5"
              style={{ background: "rgba(232,168,56,0.12)", color: "#C85A2A" }}
            >
              {dict.howItWorks.badge}
            </span>
          </FadeIn>
          <FadeIn direction="up" delay={0.1} className="text-center mb-20">
            <h2
              className="font-serif font-bold mb-5"
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
                color: "#5C1F1F",
              }}
            >
              {dict.howItWorks.title}{" "}
              <em style={{ color: "#C85A2A" }}>{dict.howItWorks.titleAccent}</em>
            </h2>
            <p
              className="max-w-xl mx-auto text-base leading-[1.75]"
              style={{ color: "#9B7B6B" }}
            >
              {dict.howItWorks.subtitle}
            </p>
          </FadeIn>

          <div className="relative">
            <div
              className="hidden md:block absolute top-20 left-[calc(16.6%+32px)] right-[calc(16.6%+32px)] h-px"
              style={{
                background:
                  "linear-gradient(90deg, #E8A838, #C85A2A, #E8A838)",
                opacity: 0.25,
              }}
            />
            <div className="grid md:grid-cols-3 gap-10">
              {STEP_META.map((step, i) => (
                <FadeIn key={i} delay={i * 0.15} direction="up">
                  <div className="relative text-center group">
                    <div className="relative inline-block mb-6">
                      <motion.div
                        whileHover={{ scale: 1.08, rotate: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        }}
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
                        style={{
                          background: step.color,
                          boxShadow: `0 12px 30px ${step.color}40`,
                        }}
                      >
                        <step.icon size={32} color="#FAF6EE" />
                      </motion.div>
                      <div
                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                        style={{
                          background: "#FAF6EE",
                          borderColor: step.color,
                          color: step.color,
                        }}
                      >
                        {step.number}
                      </div>
                    </div>
                    <h3
                      className="font-serif font-bold text-xl mb-3"
                      style={{ color: "#5C1F1F" }}
                    >
                      {dict.howItWorks.steps[i].title}
                    </h3>
                    <p
                      className="text-[0.9375rem] leading-[1.7]"
                      style={{ color: "#9B7B6B" }}
                    >
                      {dict.howItWorks.steps[i].description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          <FadeIn delay={0.5} className="flex justify-center mt-14">
            <ConnectingDots />
          </FadeIn>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section
        id="features"
        className="py-32 px-6 relative"
        style={{ background: "#FFFDF8" }}
      >
        <div className="absolute bottom-0 left-0 pointer-events-none hidden lg:block opacity-30">
          <PuzzlePiece color="#C85A2A" size={180} opacity={0.06} rotate={-15} />
        </div>
        <div className="max-w-5xl mx-auto">
          <FadeIn direction="up" className="text-center mb-20">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.1em] px-4 py-2 rounded-full mb-5"
              style={{ background: "rgba(200,90,42,0.1)", color: "#C85A2A" }}
            >
              {dict.features.badge}
            </span>
            <h2
              className="font-serif font-bold"
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
                color: "#5C1F1F",
              }}
            >
              {dict.features.title}
            </h2>
          </FadeIn>

          <div className="flex flex-wrap justify-center gap-5">
            {dict.features.items.map((f, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <FadeIn key={i} delay={i * 0.08} direction="up" className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
                  <motion.div
                    whileHover={{
                      y: -6,
                      boxShadow: "0 20px 50px rgba(92,31,31,0.12)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="rounded-2xl p-6 cursor-default group"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(92,31,31,0.06)",
                      boxShadow: "0 4px 20px rgba(92,31,31,0.05)",
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
                      style={{
                        background:
                          i % 2 === 0
                            ? "rgba(232,168,56,0.12)"
                            : "rgba(200,90,42,0.1)",
                      }}
                    >
                      <Icon
                        size={22}
                        color={i % 2 === 0 ? "#E8A838" : "#C85A2A"}
                      />
                    </div>
                    <h3
                      className="font-serif font-bold text-lg mb-2.5"
                      style={{ color: "#5C1F1F" }}
                    >
                      {f.title}
                    </h3>
                    <p
                      className="text-[0.9375rem] leading-[1.7]"
                      style={{ color: "#9B7B6B" }}
                    >
                      {f.description}
                    </p>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Scholarship Finder ─────────────────────────────────────────────── */}
      <ScholarshipFinder dict={dict} />

      {/* ── Expert Counselors ──────────────────────────────────────────────── */}
      <section
        id="counselors"
        className="py-32 px-6 relative overflow-hidden"
      >
        <div className="max-w-5xl mx-auto">
          <FadeIn direction="up" className="text-center mb-20">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.1em] px-4 py-2 rounded-full mb-5"
              style={{ background: "rgba(232,168,56,0.12)", color: "#C85A2A" }}
            >
              {dict.counselors.badge}
            </span>
            <h2
              className="font-serif font-bold mb-5"
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
                color: "#5C1F1F",
              }}
            >
              {dict.counselors.title}{" "}
              <em style={{ color: "#E8A838" }}>{dict.counselors.titleAccent}</em>
            </h2>
            <p
              className="max-w-lg mx-auto text-base leading-[1.7]"
              style={{ color: "#9B7B6B" }}
            >
              {dict.counselors.subtitle}
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {dict.counselors.items.map((c, i) => {
              const meta = COUNSELOR_META[i];
              return (
                <FadeIn
                  key={i}
                  delay={0.1 + i * 0.1}
                  direction="up"
                  className="w-full"
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                    className="rounded-3xl overflow-hidden"
                    style={{
                      background: "#FFFFFF",
                      boxShadow: "0 8px 40px rgba(92,31,31,0.12)",
                      border: "1px solid rgba(92,31,31,0.06)",
                    }}
                  >
                    <div
                      className="relative flex flex-col items-center pt-12 pb-8 px-8"
                      style={{ background: meta.bg }}
                    >
                      <div className="w-28 h-28 rounded-full overflow-hidden mb-4 ring-4 ring-white shadow-xl">
                        {meta.photo ? (
                          <Image
                            src={meta.photo}
                            alt={c.name}
                            width={112}
                            height={112}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-3xl font-bold"
                            style={{
                              background: meta.specialtyColor,
                              color: "#FAF6EE",
                            }}
                          >
                            {meta.initials}
                          </div>
                        )}
                      </div>
                      <h3
                        className="font-serif font-bold text-2xl text-center mb-2"
                        style={{ color: "#5C1F1F" }}
                      >
                        {c.name}
                      </h3>
                      <span
                        className="text-sm font-semibold px-4 py-2 rounded-full"
                        style={{
                          background: "rgba(255,255,255,0.85)",
                          color: meta.specialtyColor,
                          border: `1px solid ${meta.specialtyColor}30`,
                        }}
                      >
                        {c.specialty}
                      </span>
                    </div>

                    <div className="px-8 py-7">
                      <div className="flex items-center justify-between mb-5">
                        <StarRating rating={meta.rating} />
                        <span
                          className="text-sm font-semibold"
                          style={{ color: "#9B7B6B" }}
                        >
                          {c.sessions} {dict.counselors.studentsCoached}
                        </span>
                      </div>
                      <p
                        className="text-[0.9375rem] leading-[1.7] text-center"
                        style={{ color: "#9B7B6B" }}
                      >
                        {c.bio}
                      </p>
                    </div>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      {/* <section
        id="testimonials"
        className="py-32 px-6 relative overflow-hidden"
        style={{ background: "#FFFDF8" }}
      >
        <div className="max-w-5xl mx-auto">
          <FadeIn direction="up" className="text-center mb-20">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.1em] px-4 py-2 rounded-full mb-5"
              style={{ background: "rgba(200,90,42,0.1)", color: "#C85A2A" }}
            >
              {dict.testimonials.badge}
            </span>
            <h2
              className="font-serif font-bold"
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
                color: "#5C1F1F",
              }}
            >
              {dict.testimonials.title}
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {dict.testimonials.items.map((t, i) => {
              const meta = TESTIMONIAL_META[i];
              return (
                <FadeIn key={i} delay={i * 0.12} direction="up">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                    className="rounded-3xl p-6 flex flex-col gap-5 h-full"
                    style={{
                      background: "#FFFFFF",
                      boxShadow: "0 4px 24px rgba(92,31,31,0.07)",
                      border: "1px solid rgba(92,31,31,0.05)",
                    }}
                  >
                    <div
                      className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full"
                      style={{
                        background: `${meta.color}12`,
                        border: `1px solid ${meta.color}30`,
                      }}
                    >
                      <span className="font-serif font-bold text-base" style={{ color: "#9B7B6B" }}>
                        {meta.before}
                      </span>
                      <ArrowRight size={14} color={meta.color} />
                      <span className="font-serif font-bold text-base" style={{ color: meta.color }}>
                        {meta.after}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: meta.color }}>
                        +{meta.after - meta.before}
                      </span>
                    </div>

                    <p className="text-[0.9375rem] leading-[1.75] flex-1" style={{ color: "#6B5B5B" }}>
                      &ldquo;{t.text}&rdquo;
                    </p>

                    <div
                      className="flex items-center gap-3 pt-3 border-t"
                      style={{ borderColor: "rgba(92,31,31,0.07)" }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: meta.color, color: "#FAF6EE" }}
                      >
                        {meta.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#5C1F1F" }}>{t.name}</p>
                        <p className="text-sm" style={{ color: "#9B7B6B" }}>{t.location}</p>
                      </div>
                      <div className="ml-auto">
                        <StarRating rating={5} />
                      </div>
                    </div>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section> */}

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

      <Footer dict={dict} />
    </div>
  );
}
