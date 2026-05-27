"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Loader2, RefreshCw, XCircle } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Dict } from "@/app/[lang]/dictionaries";

type PaymentStatus = "pending" | "paid" | "failed" | "expired";

interface PaymentStatusResponse {
  status: string;
  paymentStatus: PaymentStatus;
  programName: string | null;
  amount: number;
  currency: string;
  expiresAt: string;
}

export default function PaymentResultClient({
  dict,
  lang,
}: {
  dict: Dict;
  lang: "mn" | "en";
}) {
  const searchParams = useSearchParams();
  const checkout = searchParams.get("checkout");
  const text = dict.enroll.paymentResult;
  const [status, setStatus] = useState<PaymentStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(checkout));
  const [error, setError] = useState(!checkout);
  const [pollCount, setPollCount] = useState(0);

  const loadStatus = useCallback(async () => {
    if (!checkout) return;
    setIsLoading(true);
    setError(false);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/academy/erdem/enrollment-request/payment-status/${checkout}`,
      );
      if (!res.ok) throw new Error("Unable to load payment status");
      setStatus((await res.json()) as PaymentStatusResponse);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [checkout]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    if (!checkout) return;
    if (status && status.paymentStatus !== "pending") return;
    if (pollCount >= 36) return;
    const timer = window.setTimeout(() => {
      setPollCount((current) => current + 1);
      loadStatus();
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [checkout, loadStatus, pollCount, status]);

  const view = useMemo(() => {
    if (error || !checkout) {
      return {
        icon: XCircle,
        title: text.missingTitle,
        body: text.missingBody,
        tone: "#C85A2A",
        bg: "rgba(200,90,42,0.10)",
      };
    }
    if (status?.paymentStatus === "paid") {
      return {
        icon: CheckCircle,
        title: text.paidTitle,
        body: text.paidBody,
        tone: "#2F7D5C",
        bg: "rgba(47,125,92,0.10)",
      };
    }
    if (status?.paymentStatus === "failed" || status?.paymentStatus === "expired") {
      return {
        icon: XCircle,
        title: text.failedTitle,
        body: text.failedBody,
        tone: "#C85A2A",
        bg: "rgba(200,90,42,0.10)",
      };
    }
    return {
      icon: Clock,
      title: isLoading ? text.loading : text.pendingTitle,
      body: text.pendingBody,
      tone: "#E8A838",
      bg: "rgba(232,168,56,0.15)",
    };
  }, [checkout, error, isLoading, status?.paymentStatus, text]);

  const Icon = view.icon;
  const isPending = !error && checkout && (!status || status.paymentStatus === "pending");
  const amount =
    status?.currency === "MNT"
      ? `₮${status.amount.toLocaleString()}`
      : status
        ? `${status.amount.toLocaleString()} ${status.currency}`
        : null;

  return (
    <div className="gradient-mesh min-h-screen overflow-x-hidden" style={{ background: "#FAF6EE" }}>
      <Nav dict={dict} lang={lang} />
      <main className="px-6 pb-24 pt-32">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl border shadow-[0_18px_60px_rgba(92,31,31,0.12)] lg:grid-cols-[0.9fr_1.1fr]"
          style={{ background: "#FFFCF7", borderColor: "rgba(92,31,31,0.08)" }}
        >
          <div className="p-8 sm:p-10" style={{ background: "#5C1F1F", color: "#FAF6EE" }}>
            <div className="text-xs font-bold uppercase tracking-wide" style={{ color: "#E8A838" }}>
              {dict.enroll.paymentResultTitle}
            </div>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight">
              {view.title}
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7" style={{ color: "rgba(250,246,238,0.76)" }}>
              {view.body}
            </p>

            {isPending && (
              <div className="mt-8 flex items-center gap-2">
                {[0, 1, 2].map((item) => (
                  <motion.span
                    key={item}
                    className="h-2 w-2 rounded-full"
                    style={{ background: "#E8A838" }}
                    animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.35, 1] }}
                    transition={{
                      duration: 1.1,
                      repeat: Infinity,
                      delay: item * 0.16,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-8 text-center sm:p-10">
            <motion.div
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full"
              style={{ background: view.bg }}
              animate={isPending ? { scale: [1, 1.04, 1] } : { scale: 1 }}
              transition={{ duration: 1.8, repeat: isPending ? Infinity : 0 }}
            >
              {isLoading && !status ? (
                <Loader2 size={42} className="animate-spin" style={{ color: view.tone }} />
              ) : (
                <Icon size={44} style={{ color: view.tone }} />
              )}
            </motion.div>

          {status && (
            <div
              className="mt-8 space-y-3 rounded-2xl border px-5 py-4 text-left text-sm"
              style={{
                background: "#FAF6EE",
                borderColor: "rgba(92,31,31,0.08)",
                color: "#5C1F1F",
              }}
            >
              {status.programName && (
                <div className="flex justify-between gap-4">
                  <span style={{ color: "#9B7B6B" }}>{text.program}</span>
                  <span className="font-semibold">{status.programName}</span>
                </div>
              )}
              {amount && (
                <div className="flex justify-between gap-4">
                  <span style={{ color: "#9B7B6B" }}>{text.amount}</span>
                  <span className="font-semibold">{amount}</span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span style={{ color: "#9B7B6B" }}>{text.expires}</span>
                <span className="font-semibold">
                  {new Date(status.expiresAt).toLocaleDateString(lang === "en" ? "en-US" : "mn-MN")}
                </span>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={loadStatus}
              disabled={!checkout || isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all disabled:opacity-50"
              style={{ background: "#C85A2A", color: "#FAF6EE" }}
            >
              <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
              {text.retry}
            </button>
            <Link
              href={`/${lang}`}
              className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition-all"
              style={{ borderColor: "rgba(92,31,31,0.14)", color: "#5C1F1F" }}
            >
              {text.home}
            </Link>
          </div>
          </div>
        </motion.section>
      </main>
      <Footer dict={dict} />
    </div>
  );
}
