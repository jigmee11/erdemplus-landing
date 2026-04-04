// Module-level singleton so SplashScreen can read the navbar logo's
// exact DOM position without needing React context or prop drilling.
export const navLogoRef = { current: null as HTMLElement | null };
