import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import PaymentResultClient from "./PaymentResultClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: `${dict.enroll.paymentResultTitle} — ERDEM+`,
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
  return (
    <Suspense fallback={null}>
      <PaymentResultClient dict={dict} lang={lang} />
    </Suspense>
  );
}
