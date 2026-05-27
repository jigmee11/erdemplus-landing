"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Loader2,
} from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Dict } from "@/app/[lang]/dictionaries";

interface ApplicationQuestion {
  id: string;
  label: string;
  type:
    | "text"
    | "email"
    | "phone"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "multiselect"
    | "number"
    | "date";
  required: boolean;
  order: number;
  locked?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: Array<string | { label: string; value: string }>;
  profileFieldMapping?: string;
}

interface PublicProgram {
  id: string;
  name: string;
  description?: string;
  programType?: string;
  durationDays: number;
  prepaymentPrice: number;
  fullPaymentPrice: number;
  applicationForm?: {
    questions?: ApplicationQuestion[];
  };
}

interface EnrollmentSubmitResponse {
  followUpLink: string;
}

type AnswerValue = string | string[];

const CORE_FIELD_BY_MAPPING: Record<string, "firstName" | "lastName" | "email" | "phone"> = {
  "identity.firstName": "firstName",
  "identity.lastName": "lastName",
  "identity.contacts.email": "email",
  "identity.contacts.phone": "phone",
};

const inputClass =
  "w-full rounded-xl border bg-[oklch(99%_0.006_72)] px-4 py-3 text-[0.95rem] outline-none transition-colors focus:border-[oklch(74%_0.14_76)]";

const fieldBaseStyle = {
  color: "#5C1F1F",
  borderColor: "rgba(92,31,31,0.14)",
};

const fieldErrorStyle = {
  color: "#5C1F1F",
  borderColor: "#ef4444",
};

function formatTemplate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

function answerToString(value: AnswerValue | undefined) {
  if (Array.isArray(value)) return value.join(", ").trim();
  return String(value ?? "").trim();
}

function optionValue(option: string | { label: string; value: string }) {
  return typeof option === "string" ? option : option.value;
}

function optionLabel(option: string | { label: string; value: string }) {
  return typeof option === "string" ? option : option.label;
}

export default function EnrollmentForm({
  dict,
  lang,
}: {
  dict: Dict;
  lang: string;
}) {
  const [programs, setPrograms] = useState<PublicProgram[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [programsError, setProgramsError] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
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
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("Failed to load programs");
        setPrograms((await res.json()) as PublicProgram[]);
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

  const selectedProgram = useMemo(
    () => programs.find((program) => program.id === selectedProgramId) ?? null,
    [programs, selectedProgramId],
  );

  const questions = useMemo(
    () =>
      [...(selectedProgram?.applicationForm?.questions ?? [])].sort(
        (a, b) => a.order - b.order,
      ),
    [selectedProgram],
  );

  const currentQuestion = questionIndex >= 0 ? questions[questionIndex] : null;
  const progress =
    questionIndex < 0 || questions.length === 0
      ? 0
      : Math.round(((questionIndex + 1) / questions.length) * 100);

  function setAnswer(questionId: string, value: AnswerValue) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  }

  function selectProgram(programId: string) {
    setSelectedProgramId(programId);
    setAnswers({});
    setFieldErrors({});
    setSubmitError(null);
    setQuestionIndex(0);
  }

  function formatPrice(value: number) {
    return `₮${value.toLocaleString()}`;
  }

  function validateQuestion(question: ApplicationQuestion | null) {
    if (!question) return true;
    if (!question.required) return true;
    const value = answerToString(answers[question.id]);
    if (value) return true;
    setFieldErrors((current) => ({
      ...current,
      [question.id]: dict.enroll.errorRequired,
    }));
    return false;
  }

  function validateAll() {
    const errors: Record<string, string> = {};
    if (!selectedProgram) errors.programId = dict.enroll.errorRequired;
    for (const question of questions) {
      if (question.required && !answerToString(answers[question.id])) {
        errors[question.id] = dict.enroll.errorRequired;
      }
    }

    const derived = deriveCoreFields();
    for (const key of ["firstName", "lastName", "email", "phone"] as const) {
      if (!derived[key]) errors[key] = dict.enroll.errorRequired;
    }
    if (derived.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(derived.email)) {
      errors.email = dict.enroll.errorInvalidEmail;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function deriveCoreFields() {
    const fields: Partial<Record<"firstName" | "lastName" | "email" | "phone", string>> = {};
    for (const question of questions) {
      if (!question.profileFieldMapping) continue;
      const field = CORE_FIELD_BY_MAPPING[question.profileFieldMapping];
      if (field) fields[field] = answerToString(answers[question.id]);
    }
    return fields;
  }

  function buildApplicationAnswers() {
    return questions
      .map((question) => ({
        questionId: question.id,
        question: question.label,
        answer: answerToString(answers[question.id]),
        profileFieldMapping: question.profileFieldMapping,
      }))
      .filter((answer) => answer.answer);
  }

  async function handleSubmit() {
    if (!validateAll() || !selectedProgram) return;
    const applicant = deriveCoreFields();
    setIsLoading(true);
    setSubmitError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/academy/erdem/enrollment-request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            programId: selectedProgram.id,
            lang,
            applicationAnswers: buildApplicationAnswers(),
            firstName: applicant.firstName,
            lastName: applicant.lastName,
            email: applicant.email,
            phone: applicant.phone,
          }),
        },
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
          setSubmitError(body.message ?? dict.enroll.errorGeneric);
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

  function goNext() {
    if (!validateQuestion(currentQuestion)) return;
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }
    handleSubmit();
  }

  function goBack() {
    if (questionIndex <= 0) {
      setQuestionIndex(-1);
      return;
    }
    setQuestionIndex((current) => current - 1);
  }

  function renderQuestionInput(question: ApplicationQuestion) {
    const error = fieldErrors[question.id] ?? fieldErrors[
      question.profileFieldMapping ? CORE_FIELD_BY_MAPPING[question.profileFieldMapping] : ""
    ];
    const value = answers[question.id] ?? "";
    const style = error ? fieldErrorStyle : fieldBaseStyle;
    const options = question.options ?? [];

    if (question.type === "textarea") {
      return (
        <textarea
          rows={5}
          className={`${inputClass} resize-none`}
          style={style}
          placeholder={question.placeholder}
          value={answerToString(value)}
          onChange={(event) => setAnswer(question.id, event.target.value)}
        />
      );
    }

    if (question.type === "select") {
      return (
        <select
          className={inputClass}
          style={style}
          value={answerToString(value)}
          onChange={(event) => setAnswer(question.id, event.target.value)}
        >
          <option value="">{question.placeholder ?? dict.enroll.selectPlaceholder}</option>
          {options.map((option) => (
            <option key={optionValue(option)} value={optionValue(option)}>
              {optionLabel(option)}
            </option>
          ))}
        </select>
      );
    }

    if (question.type === "radio") {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const selected = answerToString(value) === optionValue(option);
            return (
              <button
                key={optionValue(option)}
                type="button"
                onClick={() => setAnswer(question.id, optionValue(option))}
                className="flex min-h-14 items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all"
                style={{
                  borderColor: selected ? "#C85A2A" : "rgba(92,31,31,0.14)",
                  background: selected ? "rgba(200,90,42,0.08)" : "#FFFCF7",
                  color: "#5C1F1F",
                }}
              >
                {optionLabel(option)}
                {selected && <Check size={16} style={{ color: "#C85A2A" }} />}
              </button>
            );
          })}
        </div>
      );
    }

    if (question.type === "checkbox" || question.type === "multiselect") {
      const selectedValues = Array.isArray(value) ? value : [];
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const optionKey = optionValue(option);
            const selected = selectedValues.includes(optionKey);
            return (
              <button
                key={optionKey}
                type="button"
                onClick={() => {
                  const next = selected
                    ? selectedValues.filter((item) => item !== optionKey)
                    : [...selectedValues, optionKey];
                  setAnswer(question.id, next);
                }}
                className="flex min-h-14 items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all"
                style={{
                  borderColor: selected ? "#C85A2A" : "rgba(92,31,31,0.14)",
                  background: selected ? "rgba(200,90,42,0.08)" : "#FFFCF7",
                  color: "#5C1F1F",
                }}
              >
                {optionLabel(option)}
                {selected && <Check size={16} style={{ color: "#C85A2A" }} />}
              </button>
            );
          })}
        </div>
      );
    }

    const inputType =
      question.type === "phone"
        ? "tel"
        : question.type === "number"
          ? "number"
          : question.type;
    return (
      <input
        type={inputType}
        className={inputClass}
        style={style}
        placeholder={question.placeholder}
        value={answerToString(value)}
        onChange={(event) => setAnswer(question.id, event.target.value)}
      />
    );
  }

  return (
    <div
      className="gradient-mesh min-h-screen overflow-x-hidden"
      style={{ background: "#FAF6EE" }}
    >
      <Nav dict={dict} lang={lang} />

      <main className="px-6 pb-24 pt-32">
        <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:sticky lg:top-28"
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
              style={{
                background: "rgba(232,168,56,0.16)",
                color: "#A0451F",
                border: "1px solid rgba(232,168,56,0.28)",
              }}
            >
              <CreditCard size={14} />
              {dict.enroll.badge}
            </div>
            <h1
              className="mt-6 font-serif text-4xl font-bold leading-tight sm:text-5xl"
              style={{ color: "#5C1F1F", letterSpacing: 0 }}
            >
              {dict.enroll.headline} {dict.enroll.headlineAccent}
            </h1>
            <p className="mt-5 max-w-md text-base leading-7" style={{ color: "#8B6E60" }}>
              {dict.enroll.subtitle}
            </p>

            <div className="mt-8 overflow-hidden rounded-full bg-[rgba(92,31,31,0.10)]">
              <motion.div
                className="h-2 rounded-full"
                style={{ background: "#C85A2A" }}
                animate={{ width: questionIndex < 0 ? "8%" : `${progress}%` }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs font-semibold" style={{ color: "#9B7B6B" }}>
              <span>{dict.enroll.stepProgram}</span>
              <span>
                {questionIndex < 0
                  ? dict.enroll.stepQuestions
                  : formatTemplate(dict.enroll.questionProgress, {
                      current: questionIndex + 1,
                      total: questions.length,
                    })}
              </span>
            </div>
          </motion.div>

          <section
            className="rounded-3xl border p-5 shadow-[0_18px_60px_rgba(92,31,31,0.12)] sm:p-8"
            style={{
              background: "oklch(99% 0.008 72)",
              borderColor: "rgba(92,31,31,0.08)",
            }}
          >
            {submitError && (
              <div
                className="mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold"
                style={{
                  background: "rgba(200,90,42,0.08)",
                  borderColor: "rgba(200,90,42,0.22)",
                  color: "#C85A2A",
                }}
              >
                {submitError}
              </div>
            )}

            <AnimatePresence mode="wait">
              {questionIndex < 0 ? (
                <motion.div
                  key="programs"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-sm font-bold uppercase tracking-wide" style={{ color: "#C85A2A" }}>
                    {dict.enroll.programLabel}
                  </p>
                  <div className="mt-5">
                    {programsLoading ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[0, 1].map((item) => (
                          <div
                            key={item}
                            className="h-48 animate-pulse rounded-2xl"
                            style={{
                              background: "#FAF6EE",
                              border: "1px solid rgba(92,31,31,0.08)",
                            }}
                          />
                        ))}
                      </div>
                    ) : programsError ? (
                      <div
                        className="rounded-2xl border px-5 py-4 text-sm"
                        style={{
                          background: "rgba(200,90,42,0.08)",
                          borderColor: "rgba(200,90,42,0.2)",
                          color: "#C85A2A",
                        }}
                      >
                        {dict.enroll.programLoadError}
                      </div>
                    ) : programs.length === 0 ? (
                      <div
                        className="rounded-2xl border px-5 py-4 text-sm"
                        style={{
                          background: "#FAF6EE",
                          borderColor: "rgba(92,31,31,0.12)",
                          color: "#9B7B6B",
                        }}
                      >
                        {dict.enroll.programEmpty}
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {programs.map((program) => (
                          <motion.button
                            key={program.id}
                            type="button"
                            onClick={() => selectProgram(program.id)}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            className="text-left rounded-2xl border p-5 transition-all"
                            style={{
                              background: "#FFFCF7",
                              borderColor: "rgba(92,31,31,0.12)",
                              boxShadow: "0 6px 18px rgba(92,31,31,0.07)",
                            }}
                          >
                            <p className="font-serif text-xl font-bold" style={{ color: "#5C1F1F" }}>
                              {program.name}
                            </p>
                            {program.description && (
                              <p className="mt-2 text-sm leading-6" style={{ color: "#8B6E60" }}>
                                {program.description}
                              </p>
                            )}
                            <div className="mt-5 grid gap-2 text-xs font-semibold" style={{ color: "#8B4513" }}>
                              <span>
                                {formatTemplate(dict.enroll.durationDays, {
                                  count: program.durationDays,
                                })}
                              </span>
                              <span>
                                {formatTemplate(dict.enroll.fullPaymentLabel, {
                                  price: formatPrice(program.fullPaymentPrice),
                                })}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                  {fieldErrors.programId && (
                    <p className="mt-3 text-xs" style={{ color: "#ef4444" }}>
                      {fieldErrors.programId}
                    </p>
                  )}
                </motion.div>
              ) : currentQuestion ? (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide" style={{ color: "#C85A2A" }}>
                        {selectedProgram?.name}
                      </p>
                      <h2 className="mt-3 text-2xl font-bold leading-tight" style={{ color: "#5C1F1F" }}>
                        {currentQuestion.label}
                      </h2>
                    </div>
                    {currentQuestion.required && (
                      <span
                        className="rounded-full px-3 py-1 text-xs font-bold"
                        style={{ background: "rgba(232,168,56,0.16)", color: "#A0451F" }}
                      >
                        {dict.enroll.required}
                      </span>
                    )}
                  </div>

                  {currentQuestion.helpText && (
                    <p className="mt-3 max-w-xl text-sm leading-6" style={{ color: "#8B6E60" }}>
                      {currentQuestion.helpText}
                    </p>
                  )}

                  <div className="mt-8">{renderQuestionInput(currentQuestion)}</div>
                  {(fieldErrors[currentQuestion.id] ||
                    fieldErrors[
                      currentQuestion.profileFieldMapping
                        ? CORE_FIELD_BY_MAPPING[currentQuestion.profileFieldMapping]
                        : ""
                    ]) && (
                    <p className="mt-2 text-xs font-semibold" style={{ color: "#ef4444" }}>
                      {fieldErrors[currentQuestion.id] ||
                        fieldErrors[
                          currentQuestion.profileFieldMapping
                            ? CORE_FIELD_BY_MAPPING[currentQuestion.profileFieldMapping]
                            : ""
                        ]}
                    </p>
                  )}

                  <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-bold transition-all"
                      style={{ borderColor: "rgba(92,31,31,0.16)", color: "#5C1F1F" }}
                    >
                      <ArrowLeft size={16} />
                      {dict.enroll.previousQuestion}
                    </button>
                    <motion.button
                      type="button"
                      onClick={goNext}
                      disabled={isLoading}
                      whileHover={isLoading ? {} : { y: -2 }}
                      whileTap={isLoading ? {} : { scale: 0.98 }}
                      className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all disabled:opacity-60"
                      style={{
                        background: "#C85A2A",
                        color: "#FAF6EE",
                        boxShadow: "0 10px 26px rgba(200,90,42,0.24)",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={17} className="animate-spin" />
                          {dict.enroll.submitting}
                        </>
                      ) : questionIndex === questions.length - 1 ? (
                        <>
                          {dict.enroll.submit}
                          <ArrowRight size={16} />
                        </>
                      ) : (
                        <>
                          {dict.enroll.nextQuestion}
                          <ArrowRight size={16} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-questions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border px-5 py-4 text-sm"
                  style={{
                    background: "#FAF6EE",
                    borderColor: "rgba(92,31,31,0.12)",
                    color: "#9B7B6B",
                  }}
                >
                  {dict.enroll.programEmpty}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </section>
      </main>

      <Footer dict={dict} />
    </div>
  );
}
