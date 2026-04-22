"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, CheckCircle, Copy, Loader2 } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Dict } from "@/app/[lang]/dictionaries";

type ProgramType = "SAT_MATH" | "SAT_FULL";
type DurationDays = 14 | 30;

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
  const [accountCopied, setAccountCopied] = useState(false);

  const ACCOUNT_NUMBER = "MN790004000800073646";

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(ACCOUNT_NUMBER);
      setAccountCopied(true);
      setTimeout(() => setAccountCopied(false), 2000);
    } catch {
      // clipboard unavailable — fail silently
    }
  }

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/academy/erdem/enrollment-request`,
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

  const priceAmount =
    programType === "SAT_FULL" && durationDays === 30
      ? 600000
      : programType === "SAT_FULL" && durationDays === 14
      ? 400000
      : programType === "SAT_MATH" && durationDays === 30
      ? 400000
      : programType === "SAT_MATH" && durationDays === 14
      ? 250000
      : null;
  const formattedPrice =
    priceAmount !== null
      ? `${priceAmount.toLocaleString("en-US")}₮`
      : null;

  return (
    <div
      className="gradient-mesh min-h-screen overflow-x-hidden"
      style={{ background: "#FAF6EE" }}
    >
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
                        <p
                          className="text-xs mt-1"
                          style={{ color: "#ef4444" }}
                        >
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
                        <p
                          className="text-xs mt-1"
                          style={{ color: "#ef4444" }}
                        >
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
                            <p
                              className="text-xs"
                              style={{ color: "#8B4513" }}
                            >
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
                        {
                          value: 14 as DurationDays,
                          label: dict.enroll.duration1Month,
                        },
                        {
                          value: 30 as DurationDays,
                          label: dict.enroll.duration2Months,
                        },
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
                    style={
                      fieldErrors.targetTestDate ? inputError : inputBase
                    }
                    onFocus={(e) => {
                      e.target.style.borderColor = "#E8A838";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = fieldErrors.targetTestDate
                        ? "#ef4444"
                        : "rgba(92,31,31,0.12)";
                    }}
                  />
                  <p
                    className="text-xs mt-1.5"
                    style={{ color: "#9B7B6B" }}
                  >
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
                  className="text-base leading-[1.7] mb-6"
                  style={{ color: "#5C1F1F" }}
                >
                  {dict.enroll.successBody
                    .replace("{firstName}", firstName)
                    .replace("{program}", programName ?? "")}
                </p>

                <div
                  className="rounded-2xl p-5 sm:p-6 mb-6 text-left"
                  style={{
                    background: "rgba(232,168,56,0.08)",
                    border: "1px solid rgba(232,168,56,0.3)",
                  }}
                >
                  <p
                    className="text-xs font-semibold tracking-wide uppercase mb-3"
                    style={{ color: "#C85A2A" }}
                  >
                    {dict.enroll.paymentTitle}
                  </p>
                  <div className="space-y-2 text-sm">
                    {formattedPrice && (
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span
                          className="font-medium"
                          style={{ color: "#9B7B6B" }}
                        >
                          {dict.enroll.paymentAmountLabel}:
                        </span>
                        <span
                          className="font-serif font-bold text-lg"
                          style={{ color: "#C85A2A" }}
                        >
                          {formattedPrice}
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span
                        className="font-medium"
                        style={{ color: "#9B7B6B" }}
                      >
                        {dict.enroll.paymentAccountLabel}:
                      </span>
                      <button
                        type="button"
                        onClick={copyAccount}
                        aria-label={
                          accountCopied
                            ? dict.enroll.copiedLabel
                            : dict.enroll.copyLabel
                        }
                        className="inline-flex items-center gap-1.5 font-mono font-semibold break-all rounded-md px-1.5 py-0.5 -mx-1.5 transition-colors"
                        style={{
                          color: "#5C1F1F",
                          background: accountCopied
                            ? "rgba(232,168,56,0.18)"
                            : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        {ACCOUNT_NUMBER}
                        {accountCopied ? (
                          <Check size={14} style={{ color: "#E8A838" }} />
                        ) : (
                          <Copy
                            size={14}
                            style={{ color: "#9B7B6B" }}
                          />
                        )}
                      </button>
                      {accountCopied && (
                        <span
                          className="text-xs font-medium"
                          style={{ color: "#E8A838" }}
                        >
                          {dict.enroll.copiedLabel}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span
                        className="font-medium"
                        style={{ color: "#9B7B6B" }}
                      >
                        {dict.enroll.paymentBankLabel}:
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: "#5C1F1F" }}
                      >
                        {dict.enroll.paymentBank}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span
                        className="font-medium"
                        style={{ color: "#9B7B6B" }}
                      >
                        {dict.enroll.paymentHolderLabel}:
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: "#5C1F1F" }}
                      >
                        {dict.enroll.paymentHolder}
                      </span>
                    </div>
                  </div>
                </div>

                <p
                  className="text-sm leading-[1.7] mb-3"
                  style={{ color: "#9B7B6B" }}
                >
                  {dict.enroll.paymentContactNote}
                </p>

                <p
                  className="text-sm leading-[1.7] mb-8"
                  style={{ color: "#5C1F1F" }}
                >
                  {dict.enroll.paymentPhoneNote}{" "}
                  <a
                    href="tel:+97699299880"
                    className="font-semibold"
                    style={{ color: "#C85A2A" }}
                  >
                    99299880
                  </a>
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
