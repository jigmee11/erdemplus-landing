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
