'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { navLogoRef } from './navLogoRef';

// ─── Real logo paths from app/assets/logo.svg ────────────────────────────────

const INNER_TRANSFORM = 'matrix(1.1333333,0,0,1.1333333,-19.227844,-18.912629)';
const LOGO_SIZE = 200;

const PATH_TL = 'm 117.23032,58.415636 -58.536551,-7.9e-5 -7.9e-5,58.536573 26.454593,0.10557 c -0.0016,1.1557 0.389158,3.10769 -0.273154,4.12111 -0.533107,0.81576 -1.841027,1.18738 -2.586512,1.83441 -1.783456,1.54786 -2.686903,3.83369 -2.60939,6.11102 0.274956,8.07793 12.004107,9.60335 15.246957,2.48545 1.160818,-2.54793 0.596175,-5.76989 -1.287386,-7.88338 -0.770983,-0.86511 -2.149553,-1.37992 -2.765793,-2.31854 -0.690271,-1.0514 -0.262995,-3.13991 -0.261313,-4.34242 l 26.536688,-0.0722 0.0374,-26.503023 c -1.43342,-0.002 -4.12131,-0.497144 -5.36238,0.245756 -2.80744,1.680478 -3.48226,4.866304 -7.65256,4.611798 -8.325467,-0.508113 -9.969895,-11.445619 -2.32135,-14.37028 2.59794,-0.993404 5.81248,-0.188952 7.77829,1.642803 0.76903,0.716578 1.25613,1.903841 2.1869,2.434467 1.2877,0.734125 3.90896,0.258728 5.37835,0.260785 z';
const PATH_TR = 'm 208.69369,116.86497 -0.0873,-58.449373 H 150.15715 L 150,85.000001 c -1.15571,0.0018 -3.10655,0.397548 -4.12189,-0.260849 -0.8173,-0.529957 -1.1927,-1.834853 -1.84188,-2.577357 -1.55301,-1.776325 -3.84144,-2.671827 -6.11855,-2.587855 -8.0771,0.297865 -9.56862,12.013915 -2.44137,15.231377 2.5513,1.15173 5.77161,0.578629 7.87965,-1.308221 0.86288,-0.772329 1.3737,-2.150329 2.31054,-2.768359 1.0494,-0.692276 3.13913,-0.271666 4.34165,-0.273458 l 0.149,26.496891 26.50305,-0.0394 c -0.002,-1.4313 0.48522,-4.1166 -0.26126,-5.35368 -1.68859,-2.79839 -4.87636,-3.46301 -4.63391,-7.62782 0.48401,-8.314555 11.41673,-9.988103 14.3635,-2.35941 1.0009,2.5912 0.20575,5.80325 -1.62031,7.77142 -0.71435,0.76996 -1.90021,1.25976 -2.42814,2.19067 -0.7304,1.2879 -0.24743,3.90387 -0.24524,5.37107 z';
const PATH_BL = 'm 58.693765,149.87899 v 58.53657 h 58.536555 l 0.29369,-26.33245 c 1.1557,-0.001 3.10655,-0.39814 4.12188,0.26124 0.8173,0.53074 1.1927,1.83759 1.84188,2.58119 1.553,1.77898 3.84143,2.67582 6.11853,2.59171 8.0771,-0.2983 9.56861,-12.03181 2.44137,-15.25408 -2.55129,-1.15345 -5.77159,-0.57949 -7.87963,1.31018 -0.86288,0.77348 -1.3737,2.15353 -2.31054,2.77249 -1.0494,0.6933 -3.13913,0.27207 -4.34164,0.27386 l -0.14901,-26.53639 -26.477978,-0.20432 c 0.0021,1.43342 -0.510254,4.36655 0.236228,5.60549 1.68859,2.80255 4.876348,3.46817 4.633901,7.63919 -0.484008,8.32691 -11.416713,10.00295 -14.363475,2.36289 -1.000911,-2.59507 -0.205756,-5.81191 1.620307,-7.78301 0.714356,-0.77111 1.900205,-1.26164 2.428138,-2.19394 0.730394,-1.28982 0.325144,-4.16124 0.322951,-5.63062 z';
const PATH_BR = 'm 150.15713,208.41556 h 58.53656 v -58.53657 l -26.47537,-0.16135 c -7.3e-4,-1.1557 -0.39617,-3.10679 0.26385,-4.12172 0.53127,-0.81696 1.83834,-1.19154 2.58237,-1.84025 1.77995,-1.55187 2.67823,-3.83973 2.59558,-6.11689 -0.2932,-8.07729 -12.02577,-9.57622 -15.25253,-2.45102 -1.15507,2.55056 -0.58315,5.77123 1.30518,7.88046 0.77294,0.86336 2.15267,1.37507 2.77102,2.3123 0.69264,1.04983 0.27009,3.1393 0.27113,4.34181 l -26.59779,0.15666 0.0841,26.47857 c 1.43342,-0.001 4.12242,0.48783 5.36183,-0.25787 2.80362,-1.68682 3.47126,-4.87416 7.64212,-4.62907 8.32659,0.48927 9.99571,11.42304 2.3538,14.36497 -2.5957,0.99927 -5.81204,0.20208 -7.78198,-1.62523 -0.77066,-0.71484 -1.26043,-1.901 -2.1924,-2.42952 -1.28937,-0.73121 -3.90954,-0.2499 -5.37892,-0.24864 z';

const PIECES = [
  { path: PATH_TL, fill: '#edaa3f', from: { x: -60, y: -60 }, delay: 0 },
  { path: PATH_BL, fill: '#edaa3f', from: { x: -60, y: 60 }, delay: 0.15 },
  { path: PATH_BR, fill: '#e26735', from: { x: 60, y: 60 }, delay: 0.3 },
  { path: PATH_TR, fill: '#e26735', from: { x: 60, y: -60 }, delay: 0.45 },
] as const;

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ startDelay, hide }: { startDelay: number; hide: boolean }) {
  return (
    <motion.div
      animate={hide ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 3,
        background: 'rgba(232,168,56,0.15)',
      }}
    >
      <motion.div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #E8A838 0%, #C85A2A 100%)',
          transformOrigin: 'left center',
          borderRadius: 2,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: startDelay, duration: 0.95, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </motion.div>
  );
}

// ─── Splash ───────────────────────────────────────────────────────────────────

export default function SplashScreen({ tagline }: { tagline?: string }) {
  const [phase, setPhase] = useState<'pending' | 'assembling' | 'flying' | 'done'>('pending');
  const logoRef = useRef<HTMLDivElement>(null);
  const [flyTarget, setFlyTarget] = useState({ x: 0, y: 0, scale: 1 });

  // Check sessionStorage once on mount
  useEffect(() => {
    if (sessionStorage.getItem('erdem-splash-shown')) {
      setPhase('done');
    } else {
      sessionStorage.setItem('erdem-splash-shown', '1');
      setPhase('assembling');
    }
  }, []);

  // Hide the navbar logo while splash is active
  useEffect(() => {
    if (phase === 'assembling' || phase === 'flying') {
      const navEl = navLogoRef.current;
      if (navEl) navEl.style.opacity = '0';
    }
  }, [phase]);

  // After assembly animation completes, start the fly phase
  useEffect(() => {
    if (phase !== 'assembling') return;

    const timer = setTimeout(() => {
      // Calculate target: center of navbar logo
      const navEl = navLogoRef.current;
      const splashEl = logoRef.current;

      if (navEl && splashEl) {
        const nr = navEl.getBoundingClientRect();
        const sr = splashEl.getBoundingClientRect();
        setFlyTarget({
          x: (nr.left + nr.width / 2) - (sr.left + sr.width / 2),
          y: (nr.top + nr.height / 2) - (sr.top + sr.height / 2),
          scale: nr.width / sr.width,
        });
      } else {
        // Fallback: approximate navbar position
        setFlyTarget({
          x: -(window.innerWidth / 2 - 44),
          y: -(window.innerHeight / 2 - 36),
          scale: 0.2,
        });
      }

      setPhase('flying');
    }, 1900);

    return () => clearTimeout(timer);
  }, [phase]);

  // After flying animation settles, reveal navbar logo and unmount splash
  useEffect(() => {
    if (phase !== 'flying') return;
    const timer = setTimeout(() => {
      // Fade the real navbar logo in
      const navEl = navLogoRef.current;
      if (navEl) {
        navEl.style.transition = 'opacity 0.15s ease-out';
        navEl.style.opacity = '1';
      }
      setPhase('done');
    }, 600);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === 'pending') {
    return (
      <div
        aria-hidden
        style={{ position: 'fixed', inset: 0, background: '#FAF6EE', zIndex: 9999 }}
      />
    );
  }

  if (phase === 'done') return null;

  const isFlying = phase === 'flying';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      aria-label="Loading ERDEM+"
      role="status"
    >
      {/* ── Cream background – fades out when logo starts flying ────── */}
      <motion.div
        animate={{ opacity: isFlying ? 0 : 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ position: 'absolute', inset: 0, background: '#FAF6EE' }}
      />

      {/* ── Radial glow ──────────────────────────────────────────────── */}
      <motion.div
        aria-hidden
        animate={{ opacity: isFlying ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 360, height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(232,168,56,0.14) 0%, transparent 70%)',
        }}
      />

      {/* ── Centered content column ──────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* ── Logo container – flies to navbar ──────────────────────── */}
        <motion.div
          ref={logoRef}
          animate={
            isFlying
              ? { x: flyTarget.x, y: flyTarget.y, scale: flyTarget.scale }
              : { x: 0, y: 0, scale: 1 }
          }
          transition={
            isFlying
              ? { type: 'spring', stiffness: 200, damping: 26, mass: 0.8 }
              : {}
          }
          style={{
            position: 'relative',
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            zIndex: 10,
          }}
        >
          {PIECES.map(({ path, fill, from, delay }, i) => (
            <motion.svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 264.5833 264.5833"
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
              aria-hidden
              initial={{ x: from.x, y: from.y, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22, mass: 0.8, delay }}
            >
              <g transform={INNER_TRANSFORM}>
                <path d={path} fill={fill} />
              </g>
            </motion.svg>
          ))}
        </motion.div>

        {/* ── Wordmark + tagline ──────────────────────────────────────── */}
        <motion.div
          animate={isFlying ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            zIndex: 2,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginTop: 24,
              fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
              fontSize: 38, fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#5C1F1F', lineHeight: 1,
              userSelect: 'none',
            }}
            aria-label="ERDEM+"
          >
            ERDEM<span style={{ color: '#E8A838', fontWeight: '100' }}>✚</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: 0.88, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginTop: 8,
              fontFamily: 'var(--font-dm-sans), "DM Sans", system-ui, sans-serif',
              fontSize: 13, fontWeight: 500,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#5C1F1F', userSelect: 'none',
            }}
          >
            {tagline ?? 'Master the SAT'}
          </motion.p>
        </motion.div>
      </div>

      <ProgressBar startDelay={0.82} hide={isFlying} />
    </div>
  );
}
