import 'server-only'

const dictionaries = {
  en: () => import('../../dictionaries/en.json').then((m) => m.default),
  mn: () => import('../../dictionaries/mn.json').then((m) => m.default),
}

export type Locale = keyof typeof dictionaries

export type Dict = Awaited<ReturnType<typeof getDictionary>>

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
