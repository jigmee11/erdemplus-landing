import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const en = JSON.parse(await readFile(new URL("../dictionaries/en.json", import.meta.url)));
const mn = JSON.parse(await readFile(new URL("../dictionaries/mn.json", import.meta.url)));
const enrollmentForm = await readFile(
  new URL("../components/EnrollmentForm.tsx", import.meta.url),
  "utf8",
);
const paymentResultClient = await readFile(
  new URL("../app/[lang]/enroll/payment-result/PaymentResultClient.tsx", import.meta.url),
  "utf8",
);

const enrollKeys = [
  "programLoadError",
  "programEmpty",
  "durationDays",
  "fullPaymentLabel",
];

const paymentResultKeys = [
  "loading",
  "paidTitle",
  "paidBody",
  "pendingTitle",
  "pendingBody",
  "failedTitle",
  "failedBody",
  "missingTitle",
  "missingBody",
  "retry",
  "home",
  "amount",
  "expires",
  "program",
];

for (const [locale, dict] of [
  ["en", en],
  ["mn", mn],
]) {
  for (const key of enrollKeys) {
    assert.equal(
      typeof dict.enroll[key],
      "string",
      `${locale}.enroll.${key} should be translated`,
    );
  }

  assert.equal(
    typeof dict.enroll.paymentResult,
    "object",
    `${locale}.enroll.paymentResult should exist`,
  );
  for (const key of paymentResultKeys) {
    assert.equal(
      typeof dict.enroll.paymentResult[key],
      "string",
      `${locale}.enroll.paymentResult.${key} should be translated`,
    );
  }
}

for (const hardcoded of [
  "We could not load programs right now. Please refresh and try again.",
  "No programs are currently available.",
  " full payment",
]) {
  assert.equal(
    enrollmentForm.includes(hardcoded),
    false,
    `EnrollmentForm should not render hardcoded copy: ${hardcoded}`,
  );
}

for (const expected of [
  "applicationForm",
  "applicationAnswers",
  "profileFieldMapping",
]) {
  assert.equal(
    enrollmentForm.includes(expected),
    true,
    `EnrollmentForm should use dynamic program questions: ${expected}`,
  );
}

assert.equal(
  paymentResultClient.includes("const copy ="),
  false,
  "PaymentResultClient should use dictionary copy instead of component-local copy",
);
