import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const landingPage = await readFile(
  new URL("../components/LandingPage.tsx", import.meta.url),
  "utf8",
);
const nav = await readFile(
  new URL("../components/Nav.tsx", import.meta.url),
  "utf8",
);

assert.match(
  landingPage,
  /className="relative min-h-\[100svh\] flex items-start lg:items-center/,
  "Home hero should start near the top on phone viewports and only center on large screens",
);

assert.match(
  landingPage,
  /pt-\[calc\(5rem\+env\(safe-area-inset-top\)\)\]/,
  "Home hero should reserve fixed-nav and safe-area space before mobile content",
);

assert.match(
  nav,
  /className="hidden sm:inline-flex text-sm font-semibold/,
  "Header enroll CTA should be hidden on phone widths to prevent nav overflow",
);
