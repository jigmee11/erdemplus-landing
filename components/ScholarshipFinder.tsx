"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Sparkles,
  Search,
  Database,
  GraduationCap,
  Globe2,
  ChevronDown,
  Calendar,
  Coins,
  Award,
  TrendingUp,
  Loader2,
  Wand2,
} from "lucide-react";
import {
  SCHOLARSHIPS,
  COUNTRIES,
  MAJORS,
  type Scholarship,
} from "@/components/scholarshipData";
import type { Dict } from "@/app/[lang]/dictionaries";

type Stage =
  | "idle"
  | "embedding"
  | "searching"
  | "ranking"
  | "results";

type Ranked = Scholarship & { score: number };

const STAGE_DURATIONS: Record<Exclude<Stage, "idle" | "results">, number> = {
  embedding: 700,
  searching: 900,
  ranking: 700,
};

// Simple token-overlap heuristic to fake "semantic" relevance scoring.
function rankScholarships(
  keyword: string,
  major: string,
  country: string,
): Ranked[] {
  const tokens = keyword
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((t) => t.length > 1);

  const scored = SCHOLARSHIPS.map((s) => {
    const haystack = [
      s.name,
      s.provider,
      s.summary,
      s.tags.join(" "),
      s.majors.join(" "),
      s.level,
      s.amount,
    ]
      .join(" ")
      .toLowerCase();

    let textScore = 0;
    if (tokens.length === 0) {
      textScore = 0.45;
    } else {
      for (const t of tokens) {
        if (haystack.includes(t)) textScore += 1 / tokens.length;
      }
    }

    const majorBoost = major === "any" || s.majors.includes(major) ? 0.35 : -0.4;
    const countryBoost =
      country === "any" || s.country === country ? 0.3 : -0.5;

    const noise = (Math.sin(s.id.charCodeAt(0) + s.id.length) + 1) * 0.04;

    const raw = textScore * 0.6 + majorBoost + countryBoost + noise;
    const score = Math.max(0, Math.min(0.99, 0.5 + raw * 0.5));

    return { ...s, score };
  });

  return scored
    .filter((s) => {
      if (country !== "any" && s.country !== country) return false;
      if (major !== "any" && !s.majors.includes(major)) return false;
      return true;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Dropdown({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  anyLabel,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  anyLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const display = value === "any" ? anyLabel : value;

  return (
    <div className="relative w-full">
      <label
        className="block text-xs font-bold uppercase tracking-[0.08em] mb-2"
        style={{ color: "#9B7B6B" }}
      >
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all"
        style={{
          background: "#FFFFFF",
          border: open
            ? "1px solid rgba(232,168,56,0.6)"
            : "1px solid rgba(92,31,31,0.1)",
          boxShadow: open
            ? "0 0 0 4px rgba(232,168,56,0.15)"
            : "0 1px 3px rgba(92,31,31,0.04)",
          color: "#5C1F1F",
        }}
      >
        <Icon size={18} color="#C85A2A" />
        <span className="flex-1 text-sm font-semibold truncate">{display}</span>
        <ChevronDown
          size={16}
          color="#9B7B6B"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms",
          }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 mt-2 rounded-2xl py-2 z-30 max-h-72 overflow-y-auto"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(92,31,31,0.08)",
              boxShadow: "0 16px 40px rgba(92,31,31,0.14)",
            }}
          >
            <button
              type="button"
              onMouseDown={() => {
                onChange("any");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-[#FAF6EE]"
              style={{ color: value === "any" ? "#C85A2A" : "#5C1F1F" }}
            >
              {anyLabel}
            </button>
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onMouseDown={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-[#FAF6EE]"
                style={{ color: value === opt ? "#C85A2A" : "#5C1F1F" }}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StageLine({
  active,
  done,
  label,
  icon: Icon,
  detail,
}: {
  active: boolean;
  done: boolean;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  detail?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: done
            ? "rgba(232,168,56,0.18)"
            : active
            ? "rgba(200,90,42,0.12)"
            : "rgba(155,123,107,0.08)",
        }}
      >
        {active && !done ? (
          <Loader2
            size={16}
            color="#C85A2A"
            style={{ animation: "spin 0.8s linear infinite" }}
          />
        ) : (
          <Icon size={16} color={done ? "#E8A838" : "#9B7B6B"} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold"
          style={{ color: done || active ? "#5C1F1F" : "#9B7B6B" }}
        >
          {label}
        </p>
        {detail && (
          <p
            className="text-xs font-mono truncate"
            style={{ color: "#9B7B6B" }}
          >
            {detail}
          </p>
        )}
      </div>
      {done && (
        <span
          className="text-xs font-bold"
          style={{ color: "#E8A838" }}
        >
          ✓
        </span>
      )}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 80 ? "#E8A838" : pct >= 60 ? "#C85A2A" : "#9B7B6B";
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}40`,
      }}
    >
      <TrendingUp size={11} />
      {pct}% match
    </div>
  );
}

function ResultCard({ s, i, t }: { s: Ranked; i: number; t: Dict["scholarshipFinder"] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07, duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -4, boxShadow: "0 20px 50px rgba(92,31,31,0.12)" }}
      className="rounded-2xl p-6 cursor-default"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(92,31,31,0.06)",
        boxShadow: "0 4px 20px rgba(92,31,31,0.05)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <ScoreBadge score={s.score} />
            {s.fullRide && (
              <span
                className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(200,90,42,0.1)",
                  color: "#C85A2A",
                }}
              >
                <Award size={10} /> {t.fullRide}
              </span>
            )}
            <span
              className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(232,168,56,0.12)",
                color: "#9B7B6B",
              }}
            >
              {s.level === "both"
                ? t.levelBoth
                : s.level === "graduate"
                ? t.levelGraduate
                : t.levelUndergraduate}
            </span>
          </div>
          <h4
            className="font-serif font-bold text-lg leading-snug mb-1"
            style={{ color: "#5C1F1F" }}
          >
            {s.name}
          </h4>
          <p className="text-sm" style={{ color: "#9B7B6B" }}>
            {s.provider} · {s.country}
          </p>
        </div>
      </div>

      <p
        className="text-[0.9375rem] leading-[1.7] mb-4"
        style={{ color: "#6B5B5B" }}
      >
        {s.summary}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className="rounded-xl p-3"
          style={{ background: "rgba(250,246,238,0.8)" }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Coins size={12} color="#9B7B6B" />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#9B7B6B" }}
            >
              {t.amount}
            </span>
          </div>
          <p
            className="text-sm font-bold leading-tight"
            style={{ color: "#5C1F1F" }}
          >
            {s.amount}
          </p>
        </div>
        <div
          className="rounded-xl p-3"
          style={{ background: "rgba(250,246,238,0.8)" }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar size={12} color="#9B7B6B" />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#9B7B6B" }}
            >
              {t.deadline}
            </span>
          </div>
          <p
            className="text-sm font-bold leading-tight"
            style={{ color: "#5C1F1F" }}
          >
            {s.deadline}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {s.majors.slice(0, 4).map((m) => (
          <span
            key={m}
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(232,168,56,0.1)",
              color: "#C85A2A",
              border: "1px solid rgba(232,168,56,0.25)",
            }}
          >
            {m}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function ScholarshipFinder({ dict }: { dict: Dict }) {
  const t = dict.scholarshipFinder;
  const [keyword, setKeyword] = useState("");
  const [major, setMajor] = useState("any");
  const [country, setCountry] = useState("any");
  const [stage, setStage] = useState<Stage>("idle");
  const [results, setResults] = useState<Ranked[]>([]);
  const [submittedQuery, setSubmittedQuery] = useState<{
    keyword: string;
    major: string;
    country: string;
  } | null>(null);

  const dbSize = SCHOLARSHIPS.length * 247 + 11; // pretend the DB is way larger

  const queryVector = useMemo(() => {
    const seed = (keyword + major + country) || "explore";
    return Array.from({ length: 6 }, (_, i) => {
      const v = Math.abs(
        Math.sin((seed.charCodeAt(i % seed.length) + 1) * (i + 1)),
      );
      return v.toFixed(3);
    });
  }, [keyword, major, country]);

  const runSearch = async () => {
    if (stage !== "idle" && stage !== "results") return;
    setStage("embedding");
    setResults([]);
    setSubmittedQuery({ keyword: keyword.trim(), major, country });

    await new Promise((r) => setTimeout(r, STAGE_DURATIONS.embedding));
    setStage("searching");
    await new Promise((r) => setTimeout(r, STAGE_DURATIONS.searching));
    setStage("ranking");
    const ranked = rankScholarships(keyword.trim(), major, country);
    await new Promise((r) => setTimeout(r, STAGE_DURATIONS.ranking));
    setResults(ranked);
    setStage("results");
  };

  const reset = () => {
    setStage("idle");
    setResults([]);
  };

  const isSearching =
    stage === "embedding" || stage === "searching" || stage === "ranking";

  return (
    <section
      id="scholarships"
      className="py-32 px-6 relative overflow-hidden"
      style={{ background: "#FFFDF8" }}
    >
      <div
        className="absolute top-20 left-0 pointer-events-none hidden lg:block"
        style={{
          width: 240,
          height: 240,
          background:
            "radial-gradient(circle, rgba(232,168,56,0.18) 0%, transparent 70%)",
          transform: "translate(-30%, 0)",
        }}
      />
      <div
        className="absolute bottom-20 right-0 pointer-events-none hidden lg:block"
        style={{
          width: 280,
          height: 280,
          background:
            "radial-gradient(circle, rgba(200,90,42,0.14) 0%, transparent 70%)",
          transform: "translate(30%, 0)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        <FadeIn className="text-center mb-4">
          <span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] px-4 py-2 rounded-full"
            style={{ background: "rgba(232,168,56,0.12)", color: "#C85A2A" }}
          >
            <Database size={12} />
            {t.badge}
          </span>
        </FadeIn>

        <FadeIn delay={0.08} className="text-center mb-5">
          <h2
            className="font-serif font-bold"
            style={{
              fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
              color: "#5C1F1F",
            }}
          >
            {t.title}{" "}
            <em style={{ color: "#C85A2A" }}>{t.titleAccent}</em>
          </h2>
        </FadeIn>

        <FadeIn delay={0.16} className="text-center mb-12">
          <p
            className="max-w-xl mx-auto text-base leading-[1.7]"
            style={{ color: "#9B7B6B" }}
          >
            {t.subtitle}
          </p>
        </FadeIn>

        {/* Search panel */}
        <FadeIn delay={0.22}>
          <div
            className="rounded-3xl p-6 sm:p-8 relative"
            style={{
              background: "#FFFFFF",
              boxShadow:
                "0 24px 64px rgba(92, 31, 31, 0.10), 0 4px 16px rgba(92,31,31,0.05)",
              border: "1px solid rgba(232,168,56,0.18)",
            }}
          >
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full"
              style={{
                background: "linear-gradient(135deg, #E8A838, #C85A2A)",
                color: "#FAF6EE",
                boxShadow: "0 4px 12px rgba(200,90,42,0.3)",
              }}
            >
              <Sparkles size={10} />
              {t.poweredBy}
            </div>

            {/* Keyword */}
            <div className="mb-5">
              <label
                className="block text-xs font-bold uppercase tracking-[0.08em] mb-2"
                style={{ color: "#9B7B6B" }}
              >
                {t.keywordLabel}
              </label>
              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all"
                style={{
                  background: "#FAF6EE",
                  border: "1px solid rgba(92,31,31,0.08)",
                }}
              >
                <Search size={18} color="#C85A2A" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") runSearch();
                  }}
                  disabled={isSearching}
                  placeholder={t.keywordPlaceholder}
                  className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:text-[#9B7B6B]/70"
                  style={{ color: "#5C1F1F" }}
                />
                {keyword && !isSearching && (
                  <button
                    type="button"
                    onClick={() => setKeyword("")}
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ color: "#9B7B6B" }}
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {t.suggestionChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setKeyword(chip)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:scale-[1.02]"
                    style={{
                      background: "rgba(232,168,56,0.1)",
                      color: "#C85A2A",
                      border: "1px solid rgba(232,168,56,0.25)",
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <Dropdown
                label={t.majorLabel}
                icon={GraduationCap}
                value={major}
                onChange={setMajor}
                options={MAJORS}
                anyLabel={t.anyMajor}
              />
              <Dropdown
                label={t.countryLabel}
                icon={Globe2}
                value={country}
                onChange={setCountry}
                options={COUNTRIES}
                anyLabel={t.anyCountry}
              />
            </div>

            {/* Submit */}
            <motion.button
              type="button"
              onClick={runSearch}
              disabled={isSearching}
              whileHover={!isSearching ? { scale: 1.01, y: -1 } : {}}
              whileTap={!isSearching ? { scale: 0.99 } : {}}
              className="w-full flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-semibold text-base transition-all disabled:opacity-80"
              style={{
                background: "linear-gradient(135deg, #C85A2A, #A0451F)",
                color: "#FAF6EE",
                boxShadow: "0 8px 24px rgba(200, 90, 42, 0.28)",
              }}
            >
              {isSearching ? (
                <>
                  <Loader2
                    size={16}
                    style={{ animation: "spin 0.8s linear infinite" }}
                  />
                  {t.searching}
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  {t.searchButton}
                </>
              )}
            </motion.button>

            <p
              className="text-xs mt-3 text-center"
              style={{ color: "#9B7B6B" }}
            >
              {t.dbHint.replace("{count}", dbSize.toLocaleString())}
            </p>
          </div>
        </FadeIn>

        {/* Pipeline / results */}
        <AnimatePresence mode="wait">
          {(isSearching || stage === "results") && (
            <motion.div
              key={stage === "results" ? "results" : "pipeline"}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="mt-10"
            >
              {/* Pipeline */}
              <div
                className="rounded-2xl p-5 sm:p-6 mb-8"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(92,31,31,0.06)",
                  boxShadow: "0 4px 20px rgba(92,31,31,0.05)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p
                    className="text-xs font-bold uppercase tracking-[0.1em]"
                    style={{ color: "#9B7B6B" }}
                  >
                    {t.pipelineLabel}
                  </p>
                  <p
                    className="text-xs font-mono"
                    style={{ color: "#9B7B6B" }}
                  >
                    [{queryVector.join(", ")}, …]
                  </p>
                </div>
                <StageLine
                  active={stage === "embedding"}
                  done={
                    stage === "searching" ||
                    stage === "ranking" ||
                    stage === "results"
                  }
                  label={t.stageEmbed}
                  icon={Wand2}
                  detail={
                    submittedQuery?.keyword
                      ? `"${submittedQuery.keyword}"`
                      : t.stageEmbedFallback
                  }
                />
                <StageLine
                  active={stage === "searching"}
                  done={stage === "ranking" || stage === "results"}
                  label={t.stageSearch.replace(
                    "{count}",
                    dbSize.toLocaleString(),
                  )}
                  icon={Database}
                  detail="cosine_similarity ≥ 0.42"
                />
                <StageLine
                  active={stage === "ranking"}
                  done={stage === "results"}
                  label={t.stageRank}
                  icon={TrendingUp}
                  detail={
                    stage === "results"
                      ? t.stageRankDone.replace(
                          "{count}",
                          results.length.toString(),
                        )
                      : "k=6"
                  }
                />
              </div>

              {/* Results */}
              {stage === "results" && (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3
                      className="font-serif font-bold text-xl"
                      style={{ color: "#5C1F1F" }}
                    >
                      {results.length > 0
                        ? t.resultsTitle.replace(
                            "{count}",
                            results.length.toString(),
                          )
                        : t.noResultsTitle}
                    </h3>
                    <button
                      type="button"
                      onClick={reset}
                      className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                      style={{
                        background: "rgba(155,123,107,0.1)",
                        color: "#9B7B6B",
                      }}
                    >
                      {t.newSearch}
                    </button>
                  </div>

                  {results.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-5">
                      {results.map((s, i) => (
                        <ResultCard key={s.id} s={s} i={i} t={t} />
                      ))}
                    </div>
                  ) : (
                    <div
                      className="rounded-2xl p-8 text-center"
                      style={{
                        background: "#FFFFFF",
                        border: "1px dashed rgba(92,31,31,0.15)",
                      }}
                    >
                      <p
                        className="text-sm leading-[1.7]"
                        style={{ color: "#9B7B6B" }}
                      >
                        {t.noResultsBody}
                      </p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
