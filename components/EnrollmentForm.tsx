"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Dict } from "@/app/[lang]/dictionaries";

interface PublicProgram {
  id: string;
  name: string;
  description?: string;
  programType?: string;
  durationDays: number;
  prepaymentPrice: number;
  fullPaymentPrice: number;
}

interface EnrollmentSubmitResponse {
  followUpLink: string;
}

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
  const [programs, setPrograms] = useState<PublicProgram[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [programsError, setProgramsError] = useState(false);
  const [targetTestDate, setTargetTestDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const controller = new AbortController();

    async function loadPrograms() {
      setProgramsLoading(true);
      setProgramsError(false);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/academy/erdem/programs`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Failed to load programs");
        const data = (await res.json()) as PublicProgram[];
        setPrograms(data);
        setSelectedProgramId((current) =>
          current && data.some((program) => program.id === current)
            ? current
            : data[0]?.id ?? null
        );
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setPrograms([]);
          setSelectedProgramId(null);
          setProgramsError(true);
        }
      } finally {
        if (!controller.signal.aborted) setProgramsLoading(false);
      }
    }

    loadPrograms();
    return () => controller.abort();
  }, []);

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
    if (!selectedProgramId) errors.programId = dict.enroll.errorRequired;
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
            programId: selectedProgramId,
            lang,
            ...(targetTestDate ? { targetTestDate } : {}),
          }),
        }
      );
      if (res.status === 201) {
        const body = (await res.json()) as EnrollmentSubmitResponse;
        if (!body.followUpLink) throw new Error("Missing payment link");
        window.location.assign(body.followUpLink);
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

  function formatPrice(value: number) {
    return `₮${value.toLocaleString()}`;
  }

  function formatTemplate(template: string, values: Record<string, string | number>) {
    return Object.entries(values).reduce(
      (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
      template,
    );
  }

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
                  {programsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[0, 1].map((item) => (
                        <div
                          key={item}
                          className="h-44 rounded-2xl animate-pulse"
                          style={{
                            background: "#FAF6EE",
                            border: "1px solid rgba(92,31,31,0.08)",
                          }}
                        />
                      ))}
                    </div>
                  ) : programsError ? (
                    <div
                      className="rounded-2xl px-5 py-4 text-sm"
                      style={{
                        background: "rgba(200,90,42,0.08)",
                        border: "1px solid rgba(200,90,42,0.2)",
                        color: "#C85A2A",
                      }}
                    >
                      {dict.enroll.programLoadError}
                    </div>
                  ) : programs.length === 0 ? (
                    <div
                      className="rounded-2xl px-5 py-4 text-sm"
                      style={{
                        background: "#FAF6EE",
                        border: "1px solid rgba(92,31,31,0.12)",
                        color: "#9B7B6B",
                      }}
                    >
                      {dict.enroll.programEmpty}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {programs.map((program) => {
                        const selected = selectedProgramId === program.id;
                        return (
                          <motion.button
                            key={program.id}
                            type="button"
                            onClick={() => {
                              setSelectedProgramId(program.id);
                              clearFieldError("programId");
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
                              {program.name}
                            </p>
                            {program.description && (
                              <p
                                className="text-sm mb-3"
                                style={{ color: "#9B7B6B" }}
                              >
                                {program.description}
                              </p>
                            )}
                            <div className="grid grid-cols-1 gap-1 text-xs">
                              <p style={{ color: "#8B4513" }}>
                                {formatTemplate(dict.enroll.durationDays, {
                                  count: program.durationDays,
                                })}
                              </p>
                              {/* <p
                                className="font-semibold"
                                style={{ color: "#C85A2A" }}
                              >
                                {formatPrice(program.prepaymentPrice)} prepayment
                              </p> */}
                              <p style={{ color: "#8B4513" }}>
                                {formatTemplate(dict.enroll.fullPaymentLabel, {
                                  price: formatPrice(program.fullPaymentPrice),
                                })}
                              </p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                  {fieldErrors.programId && (
                    <p className="text-xs mt-2" style={{ color: "#ef4444" }}>
                      {fieldErrors.programId}
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
                  disabled={isLoading || programsLoading || programsError || programs.length === 0}
                  whileHover={
                    isLoading || programsLoading || programsError || programs.length === 0
                      ? {}
                      : { scale: 1.03, y: -2 }
                  }
                  whileTap={
                    isLoading || programsLoading || programsError || programs.length === 0
                      ? {}
                      : { scale: 0.97 }
                  }
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-full font-semibold text-base transition-all"
                  style={{
                    background: isLoading || programsLoading || programsError || programs.length === 0
                      ? "rgba(200,90,42,0.5)"
                      : "linear-gradient(135deg, #C85A2A, #A0451F)",
                    color: "#FAF6EE",
                    boxShadow: isLoading
                      ? "none"
                      : "0 8px 24px rgba(200,90,42,0.3)",
                    cursor:
                      isLoading || programsLoading || programsError || programs.length === 0
                        ? "not-allowed"
                        : "pointer",
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
          </AnimatePresence>
        </div>
      </section>

      <Footer dict={dict} />
    </div>
  );
}
