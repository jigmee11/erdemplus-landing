"use client";

import Image from "next/image";
import logoImg from "@/app/assets/logo.svg";
import { navLogoRef } from "@/components/navLogoRef";
import { useRef, useEffect } from "react";

export function LogoMark({
  size = 48,
  registerRef = false,
}: {
  size?: number;
  registerRef?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (registerRef) navLogoRef.current = ref.current;
  }, [registerRef]);
  return (
    <div ref={ref} style={{ width: size, height: size }}>
      <Image
        src={logoImg}
        alt="ERDEM+ puzzle logo"
        width={size}
        height={size}
        priority
      />
    </div>
  );
}

export function Logo({
  size = 48,
  registerRef = false,
}: {
  size?: number;
  registerRef?: boolean;
}) {
  const textSize = size * 0.45;
  return (
    <div className="flex items-center gap-1">
      <LogoMark size={size} registerRef={registerRef} />
      <span
        className="font-serif font-bold tracking-tight leading-none"
        style={{ fontSize: textSize, color: "#5C1F1F" }}
      >
        ERDEM<span style={{ color: "#E8A838", fontWeight: "100" }}>✚</span>
      </span>
    </div>
  );
}
