import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import LandingPage from "@/components/LandingPage";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return <LandingPage dict={dict} lang={lang} />;
}
