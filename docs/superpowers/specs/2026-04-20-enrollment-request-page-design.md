# Enrollment Request Page — Design Spec

**Date:** 2026-04-20  
**Project:** erdem-plus-front (Next.js 16, App Router)  
**Backend endpoint:** `POST {API_BASE_URL}/academy/erdem/enrollment-request`

---

## Overview

Add a public enrollment request page at `/{lang}/enroll` where prospective students submit a detailed application (program type, duration, personal info). This replaces the existing inline waitlist form on the home page. No authentication required.

---

## Architecture

### New files

| File | Purpose |
|------|---------|
| `app/[lang]/enroll/page.tsx` | Server component — loads i18n dict, renders `<EnrollmentForm>` |
| `components/EnrollmentForm.tsx` | `'use client'` — owns all form state and submission logic |
| `components/Nav.tsx` | Extracted nav (logo, links, lang switcher, CTA) — shared by LandingPage and enrollment page |
| `components/Footer.tsx` | Extracted footer — shared by both pages |

### Modified files

| File | Change |
|------|--------|
| `components/LandingPage.tsx` | Use extracted `<Nav>` and `<Footer>`; update nav CTA to "Enroll Now" → `/{lang}/enroll`; update hero CTA to link to `/{lang}/enroll`; remove waitlist section, replace with simple CTA block |
| `dictionaries/en.json` | Add `"enroll"` key with all English strings |
| `dictionaries/mn.json` | Add `"enroll"` key with all Mongolian strings |
| `.env.local` | Add `NEXT_PUBLIC_API_URL=http://localhost:3000` |

### URL pattern

`/{lang}/enroll` — e.g. `/mn/enroll`, `/en/enroll`

### Page shell

```tsx
// app/[lang]/enroll/page.tsx
export default async function Page({ params }: PageProps<"/[lang]/enroll">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <EnrollmentForm dict={dict} lang={lang} />;
}
```

The page exports `generateMetadata` for SEO title/description.

---

## Visual Design

### Design tokens (inherit from globals.css)

- Background: `var(--cream)` (`#FAF6EE`)
- Primary text: `var(--brown)` (`#5C1F1F`)
- Accent: `var(--yellow)` (`#E8A838`)
- CTA orange: `var(--orange)` (`#C85A2A`)
- Fonts: Playfair Display (headings), DM Sans (body/UI)
- Animations: Framer Motion throughout

### Page structure

```
<Nav />                          ← extracted, shared component
<Hero section>                   ← badge + headline + subtitle
<Form card>                      ← white, rounded-3xl, shadow, centered max-w-2xl
  Personal info (2-col grid on desktop, 1-col on mobile)
    First Name | Last Name
    Email
    Phone
  Program selection (2 cards, radio behavior)
    SAT Math card | SAT Full card
  Duration pills (3-button row)
    14 days | 30 days | 45 days
  Test date (optional, date input)
    Helper text below
  Error banner (network/server errors)
  Submit button
</Form card>
<AnimatePresence>
  <Success panel>                ← replaces form card on 201
</AnimatePresence>
<Footer />                       ← extracted, shared component
```

### Component visual specs

**Program cards:**
- White bg, `1px solid rgba(92,31,31,0.06)` border, `rounded-2xl`
- Hover: lift `y: -4`, shadow increase
- Selected: `var(--orange)` border + `rgba(200,90,42,0.06)` bg tint
- Content: title, subtitle, skill count, session frequency

**Duration pills:**
- `rounded-full` buttons in a row
- Unselected: cream bg + brown border + muted text
- Selected: dark brown bg (`#5C1F1F`) + white text

**Inputs:**
- White bg, `1px solid rgba(92,31,31,0.12)` border, `rounded-xl`
- Focus: `var(--yellow)` border ring
- Error state: red border + error message below (`text-red-500`, small)

**Submit button:**
- `linear-gradient(135deg, #C85A2A, #A0451F)` background, white text
- `whileHover: { scale: 1.03, y: -2 }`, `whileTap: { scale: 0.98 }`
- Loading state: spinner icon + "Submitting…" text, disabled

**Error banner (network/5xx):**
- Warm red/brown banner at top of form area
- Dismissable or auto-shown on error

---

## Form State

```ts
// All managed via useState in EnrollmentForm
firstName: string
lastName: string
email: string
phone: string
programType: 'SAT_MATH' | 'SAT_FULL' | null
durationDays: 14 | 30 | 45 | null
targetTestDate: string          // ISO date string or ''
isLoading: boolean
submitError: string | null      // banner-level error message
fieldErrors: Record<string, string>  // inline per-field errors
isSuccess: boolean
```

---

## Validation

Client-side validation runs on submit before any network call.

| Field | Rule |
|-------|------|
| `firstName` | Required, non-empty |
| `lastName` | Required, non-empty |
| `email` | Required, valid email format (regex) |
| `phone` | Required, non-empty |
| `programType` | Required — must select SAT Math or SAT Full |
| `durationDays` | Required — must select 14, 30, or 45 |
| `targetTestDate` | Optional; if filled, must be a future date |

Validation sets `fieldErrors` and returns early. Each invalid field shows an inline error message below it.

---

## Submission Flow

```
1. Client validates → sets fieldErrors, aborts if any
2. isLoading = true, clear submitError + fieldErrors
3. POST {NEXT_PUBLIC_API_URL}/academy/erdem/enrollment-request
   Body: { firstName, lastName, email, phone, programType, durationDays, targetTestDate? }
4. Response handling:
   201 → isSuccess = true  (AnimatePresence transitions form → success state)
   409 → submitError = dict.enroll.errorDuplicate
   400 → parse errors array → fieldErrors (inline display)
   network/5xx → submitError = dict.enroll.errorGeneric
5. isLoading = false
```

---

## Success State

Replaces the form card via `AnimatePresence`. Shown after 201 response.

```
✓  (large animated checkmark icon)

"Application Submitted!"

"Thank you, {firstName}! We've received your enrollment request
for {programName}."

"Our team will review your application and send you an email
at {email} with next steps. This usually takes 1–2 business days."

[Back to Home]   ← links to /{lang}
```

---

## i18n Strings

Both `en.json` and `mn.json` get an `"enroll"` key with:

```json
{
  "enroll": {
    "badge": "...",
    "headline": "...",
    "subtitle": "...",
    "firstName": "...", "firstNamePlaceholder": "...",
    "lastName": "...", "lastNamePlaceholder": "...",
    "email": "...", "emailPlaceholder": "...",
    "phone": "...", "phonePlaceholder": "...",
    "programLabel": "...",
    "satMathTitle": "...", "satMathSubtitle": "...",
    "satMathSkills": "...", "satMathSessions": "...",
    "satFullTitle": "...", "satFullSubtitle": "...",
    "satFullSkills": "...", "satFullSessions": "...",
    "durationLabel": "...",
    "duration14": "...", "duration30": "...", "duration45": "...",
    "testDateLabel": "...", "testDateHelper": "...",
    "submit": "...", "submitting": "...",
    "successTitle": "...", "successBody": "...",
    "successBodyEmail": "...", "backToHome": "...",
    "errorDuplicate": "...",
    "errorGeneric": "...",
    "errorFutureDate": "...",
    "errorRequired": "..."
  }
}
```

---

## Home Page Changes

### Nav
- "Join Waitlist" button → "Enroll Now" linking to `/{lang}/enroll`
- `Nav.tsx` extracted so both pages share it

### Hero CTA
- "Join the Waitlist" button → links to `/{lang}/enroll`

### Waitlist section
- Removed entirely
- Replaced with a CTA block using the same dark brown background (`#5C1F1F`) to preserve page visual rhythm
- Contains: badge, short headline, 1-line subtitle, single "Apply Now" button → `/{lang}/enroll`
- Button uses orange gradient style (same as hero CTA)

---

## Environment

```
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Production: set to actual API domain.

---

## Quality Checklist

- [ ] All required fields validated before submit
- [ ] Email format validated client-side
- [ ] `programType` and `durationDays` required — can't submit without selecting
- [ ] `targetTestDate` clearly optional; validated as future date if filled
- [ ] Submit shows loading state (spinner + disabled)
- [ ] 201 success: `AnimatePresence` transition, personalized message with name + program + email
- [ ] 409: clear "email already pending" message
- [ ] 400: inline field errors
- [ ] Network/5xx: dismissable banner
- [ ] Mobile responsive — 2-col grid collapses to 1-col, program cards stack vertically
- [ ] Matches existing design system (tokens, fonts, shadows, motion)
- [ ] Nav "Enroll Now" links to enrollment page
- [ ] Home page hero CTA links to enrollment page
- [ ] Waitlist section removed; replaced with CTA block
- [ ] Both `en.json` and `mn.json` have `"enroll"` key
