"use client";

import Image from "next/image";
import logoImg from "./assets/logo.svg";
import { navLogoRef } from "@/components/navLogoRef";
import { useState, useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  BookOpen, Brain, LineChart, Video, Users, Target,
  Star, ArrowRight, CheckCircle, ChevronRight, Mail,
  Globe, Share2, Link, AtSign, Sparkles,
  TrendingUp, Award, Clock, BarChart3, User,
  Cross
} from "lucide-react";

// ─── Logo ────────────────────────────────────────────────────────────────────
function LogoMark({ size = 48, registerRef = false }: { size?: number; registerRef?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (registerRef) navLogoRef.current = ref.current;
  }, [registerRef]);
  return (
    <div ref={ref} style={{ width: size, height: size }}>
      <Image src={logoImg} alt="ERDEM+ puzzle logo" width={size} height={size} priority />
    </div>
  );
}

function Logo({ size = 48, registerRef = false }: { size?: number; registerRef?: boolean }) {
  const textSize = size * 0.45;
  return (
    <div className="flex items-center gap-1">
      <LogoMark size={size} registerRef={registerRef} />
      <span
        className="font-serif font-bold tracking-tight leading-none"
        style={{ fontSize: textSize, color: "#5C1F1F" }}
      >
        ERDEM<span style={{ color: "#E8A838", fontWeight: '100' }}>✚</span>
      </span>
    </div>
  );
}

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
      <line x1="11" y1="6" x2="35" y2="6" stroke="#E8A838" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="40" cy="6" r="5" fill="#C85A2A" fillOpacity="0.5" />
      <line x1="45" y1="6" x2="69" y2="6" stroke="#C85A2A" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="74" cy="6" r="5" fill="#E8A838" fillOpacity="0.6" />
      <line x1="79" y1="6" x2="103" y2="6" stroke="#E8A838" strokeWidth="1.5" strokeDasharray="3 3" />
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
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
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
      {count.toLocaleString()}{suffix}
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

// ─── Data ────────────────────────────────────────────────────────────────────
const stats = [
  { value: 500, suffix: "+", label: "Students' Data Analyzed", icon: Users },
  { value: 100, suffix: "+", label: "Students Personally Coached", icon: Award },
  { value: 210, suffix: " pts", label: "Avg Score Improvement", icon: TrendingUp },
  { value: 97, suffix: "%", label: "Satisfaction Rate", icon: Star },
];

const steps = [
  {
    number: "01",
    title: "Study at Your Pace",
    description: "Access adaptive video lessons and reading materials designed to meet you exactly where you are. Learn anytime, anywhere.",
    icon: BookOpen,
    color: "#E8A838",
  },
  {
    number: "02",
    title: "Practice & Improve",
    description: "Take full-length adaptive practice tests that pinpoint your weaknesses. Our AI engine adjusts difficulty in real time.",
    icon: Target,
    color: "#C85A2A",
  },
  {
    number: "03",
    title: "Get Expert Coached",
    description: "Book 1-on-1 live sessions with top counselors. Get personalized strategy, test-taking techniques, and accountability.",
    icon: Users,
    color: "#E8A838",
  },
];

const features = [
  {
    icon: Target,
    title: "Adaptive Practice Tests",
    description: "Full-length SAT simulations that adjust to your skill level, targeting the exact areas you need most.",
  },
  {
    icon: Video,
    title: "Video Lessons",
    description: "Engaging, expert-taught video lessons covering every SAT topic with clear explanations and worked examples.",
  },
  {
    icon: Brain,
    title: "AI Progress Tracking",
    description: "Intelligent analytics that map your learning curve, predict your score, and surface your next best study action.",
  },
  {
    icon: Users,
    title: "1-on-1 Live Counseling",
    description: "Direct sessions with certified counselors who know the SAT inside out — your questions, answered live.",
  },
  {
    icon: BookOpen,
    title: "Personalized Study Plans",
    description: "AI-generated weekly study plans tailored to your test date, target score, and current performance.",
  },
  {
    icon: BarChart3,
    title: "Score Analytics Dashboard",
    description: "A beautiful, clear view of your progress across all SAT domains — know exactly where you stand.",
  },
];

const counselors = [
  {
    name: "Ylalt Naranbaatar",
    specialty: "SAT Expert Counselor",
    specialtyColor: "#C85A2A",
    rating: 5,
    sessions: "100+",
    bio: "ERDEM+'s lead counselor. Has personally guided 100+ students to their target scores through tailored strategy, deep diagnostic work, and relentless support.",
    initials: "YN",
    bg: "#F5D8CC",
    featured: true,
  },
];

const testimonials = [
  {
    name: "Aiden Park",
    location: "Los Angeles, CA",
    before: 980,
    after: 1420,
    text: "I had tried three other prep courses and never broke 1100. ERDEM+ was completely different — the AI actually found the gaps in my reasoning, not just my wrong answers. My counselor, Dr. Moreno, changed how I think about math.",
    initials: "AP",
    color: "#E8A838",
  },
  {
    name: "Sofia Reyes",
    location: "Miami, FL",
    before: 1050,
    after: 1380,
    text: "The 1-on-1 sessions were worth every penny. James helped me go from dreading the reading section to actually enjoying it. Having a real expert who knows my exact weak spots is something no app can replace.",
    initials: "SR",
    color: "#C85A2A",
  },
  {
    name: "Marcus Chen",
    location: "Austin, TX",
    before: 1120,
    after: 1510,
    text: "The adaptive tests are eerily accurate — within two weeks they already knew I struggled with paired passages more than vocabulary. Scored a 1510 on test day, 390 points above where I started. Genuinely life-changing.",
    initials: "MC",
    color: "#E8A838",
  },
];

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [joining, setJoining] = useState(false);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);
  const waitlistRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  function scrollToWaitlist() {
    waitlistRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name || !phone) return;
    setJoining(true);
    setWaitlistError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/shared/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      if (res.status === 409) {
        setWaitlistError("This email is already on the waitlist.");
        return;
      }
      if (!res.ok) {
        setWaitlistError("Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setWaitlistError("Something went wrong. Please try again.");
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className="gradient-mesh min-h-screen overflow-x-hidden">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
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
          <Logo size={44} registerRef />
          <div className="hidden md:flex items-center gap-10">
            {["How It Works", "Features", "Counselors", "Testimonials"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium tracking-wide transition-colors"
                style={{ color: "#9B7B6B" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#5C1F1F")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#9B7B6B")}
              >
                {item}
              </a>
            ))}
          </div>
          <button
            onClick={scrollToWaitlist}
            className="text-sm font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all"
            style={{
              background: "#5C1F1F",
              color: "#FAF6EE",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#C85A2A")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "#5C1F1F")}
          >
            Join Waitlist
          </button>
        </div>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-[100svh] flex items-center pt-28 sm:pt-24 pb-12 sm:pb-20 overflow-hidden"
      >
        {/* Decorative puzzle pieces */}
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

        <motion.div style={{ opacity: heroOpacity }} className="max-w-6xl mx-auto px-5 sm:px-6 w-full">
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
                Now accepting waitlist — limited spots
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="font-serif font-bold leading-[1.1] sm:leading-[1.08] tracking-tight mb-5 sm:mb-7"
                style={{ fontSize: "clamp(2rem, 7vw, 3.8rem)", color: "#5C1F1F" }}
              >
                Master the SAT.{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #E8A838 30%, #C85A2A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  On Your Terms.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-base sm:text-lg leading-[1.65] sm:leading-[1.7] mb-8 sm:mb-10 max-w-lg"
                style={{ color: "#9B7B6B" }}
              >
                ERDEM PLUS combines intelligent self-paced learning with real 1-on-1 expert counseling
                — so you get the flexibility of an app and the results of a private tutor.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  onClick={scrollToWaitlist}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-semibold text-base shadow-lg transition-all"
                  style={{
                    background: "linear-gradient(135deg, #C85A2A, #A0451F)",
                    color: "#FAF6EE",
                    boxShadow: "0 8px 24px rgba(200, 90, 42, 0.35)",
                  }}
                >
                  Join the Waitlist
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>

            </div>

            {/* Right: mock dashboard card */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative hidden lg:block"
            >
              <div
                className="rounded-3xl p-8 relative overflow-hidden"
                style={{
                  background: "#FFFFFF",
                  boxShadow: "0 24px 64px rgba(92, 31, 31, 0.12), 0 4px 16px rgba(92,31,31,0.06)",
                }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#9B7B6B" }}>
                      Your Progress
                    </p>
                    <p className="font-serif font-bold text-xl" style={{ color: "#5C1F1F" }}>
                      Score Trajectory
                    </p>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(232,168,56,0.12)", color: "#C85A2A" }}
                  >
                    +330 pts
                  </div>
                </div>

                {/* Fake chart bars */}
                <div className="flex items-end gap-3 mb-6 h-28">
                  {[45, 52, 58, 66, 72, 79, 88, 96].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.6 + i * 0.06, duration: 0.5, ease: "easeOut" }}
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

                <div className="flex justify-between text-sm mb-8" style={{ color: "#9B7B6B" }}>
                  <span>Week 1</span>
                  <span>Week 8</span>
                </div>

                {/* Score boxes */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Start Score", value: "1080", sub: "Baseline" },
                    { label: "Current", value: "1410", sub: "↑ 330 pts", accent: true },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl p-4"
                      style={{
                        background: s.accent
                          ? "linear-gradient(135deg, rgba(200,90,42,0.08), rgba(232,168,56,0.08))"
                          : "rgba(250,246,238,0.8)",
                        border: s.accent ? "1px solid rgba(232,168,56,0.3)" : "1px solid rgba(92,31,31,0.06)",
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
                      <p className="text-sm font-semibold mt-0.5" style={{ color: s.accent ? "#E8A838" : "#9B7B6B" }}>
                        {s.sub}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Next session */}
                <div
                  className="flex items-center gap-3 rounded-2xl p-4"
                  style={{ background: "rgba(250,246,238,0.9)", border: "1px solid rgba(92,31,31,0.06)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: "#E8A838", color: "#FAF6EE" }}
                  >
                    LM
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "#5C1F1F" }}>
                      Dr. Layla Moreno
                    </p>
                    <p className="text-sm truncate" style={{ color: "#9B7B6B" }}>
                      Next session · Tomorrow, 4 PM
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

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 rounded-2xl px-4 py-3 shadow-xl"
                style={{
                  background: "#5C1F1F",
                  color: "#FAF6EE",
                }}
              >
                <p className="text-sm font-semibold opacity-70 mb-0.5">Target Score</p>
                <p className="font-serif font-bold text-xl">1520</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────────────────────── */}
      <section
        className="py-20 relative"
        style={{
          background: "#5C1F1F",
          overflow: "hidden",
        }}
      >
        <div
          className="absolute inset-0 puzzle-bg opacity-20 pointer-events-none"
          style={{ filter: "invert(1) brightness(0.3)" }}
        />
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.1} direction="up">
                <div className="text-center">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(232,168,56,0.15)" }}
                  >
                    <s.icon size={20} color="#E8A838" />
                  </div>
                  <p className="font-serif font-bold text-3xl mb-1.5" style={{ color: "#FAF6EE" }}>
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-sm leading-snug" style={{ color: "rgba(250,246,238,0.5)" }}>
                    {s.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-16 right-0 pointer-events-none opacity-40 hidden lg:block">
          <PuzzlePiece color="#E8A838" size={200} opacity={0.05} rotate={10} />
        </div>
        <div className="max-w-5xl mx-auto">
          <FadeIn direction="up" className="text-center mb-4">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.1em] px-4 py-2 rounded-full mb-5"
              style={{ background: "rgba(232,168,56,0.12)", color: "#C85A2A" }}
            >
              The Process
            </span>
          </FadeIn>
          <FadeIn direction="up" delay={0.1} className="text-center mb-20">
            <h2
              className="font-serif font-bold mb-5"
              style={{ fontSize: "clamp(1.875rem, 4vw, 2.75rem)", color: "#5C1F1F" }}
            >
              Three steps to your{" "}
              <em style={{ color: "#C85A2A" }}>best score</em>
            </h2>
            <p className="max-w-xl mx-auto text-base leading-[1.75]" style={{ color: "#9B7B6B" }}>
              ERDEM+ turns a complex journey into a clear, structured path — with technology that adapts
              and humans who care.
            </p>
          </FadeIn>

          <div className="relative">
            {/* Connecting line */}
            <div
              className="hidden md:block absolute top-20 left-[calc(16.6%+32px)] right-[calc(16.6%+32px)] h-px"
              style={{ background: "linear-gradient(90deg, #E8A838, #C85A2A, #E8A838)", opacity: 0.25 }}
            />

            <div className="grid md:grid-cols-3 gap-10">
              {steps.map((step, i) => (
                <FadeIn key={step.number} delay={i * 0.15} direction="up">
                  <div className="relative text-center group">
                    <div className="relative inline-block mb-6">
                      <motion.div
                        whileHover={{ scale: 1.08, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
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
                      {step.title}
                    </h3>
                    <p className="text-[0.9375rem] leading-[1.7]" style={{ color: "#9B7B6B" }}>
                      {step.description}
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
              Everything You Need
            </span>
            <h2
              className="font-serif font-bold"
              style={{ fontSize: "clamp(1.875rem, 4vw, 2.75rem)", color: "#5C1F1F" }}
            >
              Built for real results
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08} direction="up">
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(92,31,31,0.12)" }}
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
                      background: i % 2 === 0 ? "rgba(232,168,56,0.12)" : "rgba(200,90,42,0.1)",
                    }}
                  >
                    <f.icon
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
                  <p className="text-[0.9375rem] leading-[1.7]" style={{ color: "#9B7B6B" }}>
                    {f.description}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Expert Counselors ──────────────────────────────────────────────── */}
      <section id="counselors" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <FadeIn direction="up" className="text-center mb-20">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.1em] px-4 py-2 rounded-full mb-5"
              style={{ background: "rgba(232,168,56,0.12)", color: "#C85A2A" }}
            >
              Meet Our Experts
            </span>
            <h2
              className="font-serif font-bold mb-5"
              style={{ fontSize: "clamp(1.875rem, 4vw, 2.75rem)", color: "#5C1F1F" }}
            >
              Counselors who{" "}
              <em style={{ color: "#E8A838" }}>know the SAT</em>
            </h2>
            <p className="max-w-lg mx-auto text-base leading-[1.7]" style={{ color: "#9B7B6B" }}>
              Every ERDEM+ counselor has deep expertise in their section — not generalists, but
              specialists who&apos;ve helped thousands of students break through.
            </p>
          </FadeIn>

          <div className="flex justify-center">
            {counselors.map((c) => (
              <FadeIn key={c.name} delay={0.1} direction="up" className="w-full max-w-md">
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
                  {/* Avatar area */}
                  <div
                    className="relative flex flex-col items-center pt-12 pb-8 px-8"
                    style={{ background: c.bg }}
                  >
                    <div
                      className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold mb-4 ring-4 ring-white shadow-xl"
                      style={{ background: c.specialtyColor, color: "#FAF6EE" }}
                    >
                      {c.initials}
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-center mb-2" style={{ color: "#5C1F1F" }}>
                      {c.name}
                    </h3>
                    <span
                      className="text-sm font-semibold px-4 py-2 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.85)",
                        color: c.specialtyColor,
                        border: `1px solid ${c.specialtyColor}30`,
                      }}
                    >
                      {c.specialty}
                    </span>
                  </div>

                  {/* Info area */}
                  <div className="px-8 py-7">
                    <div className="flex items-center justify-between mb-5">
                      <StarRating rating={c.rating} />
                      <span className="text-sm font-semibold" style={{ color: "#9B7B6B" }}>
                        {c.sessions} students coached
                      </span>
                    </div>
                    <p className="text-[0.9375rem] leading-[1.7] text-center" style={{ color: "#9B7B6B" }}>
                      {c.bio}
                    </p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <section
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
              Student Stories
            </span>
            <h2
              className="font-serif font-bold"
              style={{ fontSize: "clamp(1.875rem, 4vw, 2.75rem)", color: "#5C1F1F" }}
            >
              Real scores. Real students.
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.12} direction="up">
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
                  {/* Score improvement badge */}
                  <div
                    className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full"
                    style={{
                      background: `${t.color}12`,
                      border: `1px solid ${t.color}30`,
                    }}
                  >
                    <span className="font-serif font-bold text-base" style={{ color: "#9B7B6B" }}>
                      {t.before}
                    </span>
                    <ArrowRight size={14} color={t.color} />
                    <span className="font-serif font-bold text-base" style={{ color: t.color }}>
                      {t.after}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: t.color }}>
                      +{t.after - t.before}
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-[0.9375rem] leading-[1.75] flex-1" style={{ color: "#6B5B5B" }}>
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: "rgba(92,31,31,0.07)" }}>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: t.color, color: "#FAF6EE" }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#5C1F1F" }}>
                        {t.name}
                      </p>
                      <p className="text-sm" style={{ color: "#9B7B6B" }}>
                        {t.location}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <StarRating rating={5} />
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Waitlist ───────────────────────────────────────────────────────── */}
      <section
        id="join-the-waitlist"
        ref={waitlistRef as React.RefObject<HTMLElement>}
        className="py-32 px-6 relative overflow-hidden"
        style={{ background: "#5C1F1F" }}
      >
        {/* Warm texture */}
        <div
          className="absolute inset-0 puzzle-bg pointer-events-none"
          style={{ opacity: 0.08, filter: "brightness(2)" }}
        />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(232,168,56,0.12) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(200,90,42,0.1) 0%, transparent 70%)",
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
              Limited Early Access
            </div>

            <h2
              className="font-serif font-bold mb-6 leading-tight"
              style={{ fontSize: "clamp(1.75rem, 6vw, 3rem)", color: "#FAF6EE" }}
            >
              Be the first to transform
              <br />
              <span style={{ color: "#E8A838" }}>your SAT score.</span>
            </h2>
            <p className="text-base leading-[1.7] mb-4" style={{ color: "rgba(250,246,238,0.6)" }}>
              Get priority access to ERDEM+, exclusive launch pricing, and a free introductory
              counseling session when we launch.
            </p>

            {/* Counter */}
            <div
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full mb-10 text-base font-semibold"
              style={{ background: "rgba(232,168,56,0.12)", color: "#E8A838", border: "1px solid rgba(232,168,56,0.25)" }}
            >
              <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
              142 students already joined · 58 spots remaining
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.15}>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="flex-1 px-5 py-4 rounded-xl text-base font-medium outline-none transition-all"
                      style={{
                        background: "rgba(250,246,238,0.1)",
                        border: "1px solid rgba(250,246,238,0.15)",
                        color: "#FAF6EE",
                      }}
                      onFocus={(e) => {
                        (e.target as HTMLInputElement).style.borderColor = "#E8A838";
                        (e.target as HTMLInputElement).style.background = "rgba(250,246,238,0.12)";
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLInputElement).style.borderColor = "rgba(250,246,238,0.15)";
                        (e.target as HTMLInputElement).style.background = "rgba(250,246,238,0.1)";
                      }}
                    />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 px-5 py-4 rounded-xl text-base font-medium outline-none transition-all"
                      style={{
                        background: "rgba(250,246,238,0.1)",
                        border: "1px solid rgba(250,246,238,0.15)",
                        color: "#FAF6EE",
                      }}
                      onFocus={(e) => {
                        (e.target as HTMLInputElement).style.borderColor = "#E8A838";
                        (e.target as HTMLInputElement).style.background = "rgba(250,246,238,0.12)";
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLInputElement).style.borderColor = "rgba(250,246,246,0.15)";
                        (e.target as HTMLInputElement).style.background = "rgba(250,246,238,0.1)";
                      }}
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-5 py-4 rounded-xl text-base font-medium outline-none transition-all"
                    style={{
                      background: "rgba(250,246,238,0.1)",
                      border: "1px solid rgba(250,246,238,0.15)",
                      color: "#FAF6EE",
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = "#E8A838";
                      (e.target as HTMLInputElement).style.background = "rgba(250,246,238,0.12)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = "rgba(250,246,238,0.15)";
                      (e.target as HTMLInputElement).style.background = "rgba(250,246,238,0.1)";
                    }}
                  />
                  <motion.button
                    type="submit"
                    disabled={joining}
                    whileHover={{ scale: joining ? 1 : 1.02, y: joining ? 0 : -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3"
                    style={{
                      background: joining
                        ? "rgba(232,168,56,0.7)"
                        : "linear-gradient(135deg, #E8A838, #C85A2A)",
                      color: "#FAF6EE",
                      boxShadow: joining ? "none" : "0 8px 24px rgba(200,90,42,0.4)",
                    }}
                  >
                    {joining ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
                        />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Mail size={16} />
                        Join the Waitlist
                      </>
                    )}
                  </motion.button>
                  {waitlistError && (
                    <p className="text-sm font-medium" style={{ color: "#E8A838" }}>
                      {waitlistError}
                    </p>
                  )}
                  <p className="text-sm" style={{ color: "rgba(250,246,238,0.4)" }}>
                    No spam. We&apos;ll notify you at launch with your early access link.
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="rounded-2xl p-10 text-center"
                  style={{ background: "rgba(232,168,56,0.1)", border: "1px solid rgba(232,168,56,0.2)" }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: "rgba(232,168,56,0.2)" }}
                  >
                    <CheckCircle size={32} color="#E8A838" />
                  </motion.div>
                  <h3 className="font-serif font-bold text-2xl mb-3" style={{ color: "#FAF6EE" }}>
                    You&apos;re on the list, {name}!
                  </h3>
                  <p className="text-base" style={{ color: "rgba(250,246,238,0.6)" }}>
                    We&apos;ll reach out to{" "}
                    <strong style={{ color: "#E8A838" }}>{email}</strong> as soon as we launch.
                    Expect early access, exclusive pricing, and a free counseling session.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer
        className="py-16 px-6"
        style={{ background: "#3D1010", borderTop: "1px solid rgba(232,168,56,0.08)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-14 mb-14">
            {/* Brand */}
            <div className="max-w-xs">
              <Logo size={40} />
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(250,246,238,0.45)" }}>
                The SAT learning platform that pairs intelligent technology with human expertise.
              </p>
              <div className="flex gap-4 mt-5">
                {[Globe, Share2, Link, AtSign].map((Icon, i) => (
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

            {/* Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
              {[
                {
                  title: "Product",
                  links: ["How It Works", "Features", "Pricing", "Reviews"],
                },
                {
                  title: "Counseling",
                  links: ["Meet Counselors", "Book a Session", "Specialties", "Group Sessions"],
                },
                {
                  title: "Company",
                  links: ["About", "Blog", "Careers", "Contact"],
                },
              ].map((col) => (
                <div key={col.title}>
                  <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(250,246,238,0.3)" }}>
                    {col.title}
                  </p>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-sm transition-colors"
                          style={{ color: "rgba(250,246,238,0.5)" }}
                          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#E8A838")}
                          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(250,246,238,0.5)")}
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
              © 2026 ERDEM+. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-sm transition-colors"
                  style={{ color: "rgba(250,246,238,0.25)" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(250,246,238,0.5)")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(250,246,238,0.25)")}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
