"use client";

import { motion } from "framer-motion";
import { Globe, Share2, Link as LinkIcon, AtSign } from "lucide-react";
import { Logo } from "@/components/Logo";
import type { Dict } from "@/app/[lang]/dictionaries";

export default function Footer({ dict }: { dict: Dict }) {
  return (
    <footer
      className="py-16 px-6"
      style={{
        background: "#3D1010",
        borderTop: "1px solid rgba(232,168,56,0.08)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-14 mb-14">
          <div className="max-w-xs">
            <Logo size={40} />
            <p
              className="mt-4 text-sm leading-relaxed"
              style={{ color: "rgba(250,246,238,0.45)" }}
            >
              {dict.footer.brand.description}
            </p>
            <div className="flex gap-4 mt-5">
              {[Globe, Share2, LinkIcon, AtSign].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, color: "#E8A838" }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    background: "rgba(250,246,238,0.06)",
                    color: "rgba(250,246,238,0.4)",
                  }}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
            {dict.footer.columns.map((col) => (
              <div key={col.title}>
                <p
                  className="text-sm font-bold uppercase tracking-widest mb-4"
                  style={{ color: "rgba(250,246,238,0.3)" }}
                >
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors"
                        style={{ color: "rgba(250,246,238,0.5)" }}
                        onMouseEnter={(e) =>
                          ((e.target as HTMLElement).style.color = "#E8A838")
                        }
                        onMouseLeave={(e) =>
                          ((e.target as HTMLElement).style.color =
                            "rgba(250,246,238,0.5)")
                        }
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(250,246,238,0.06)" }}
        >
          <p className="text-sm" style={{ color: "rgba(250,246,238,0.25)" }}>
            {dict.footer.copyright}
          </p>
          <div className="flex gap-6">
            {dict.footer.legal.map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm transition-colors"
                style={{ color: "rgba(250,246,238,0.25)" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color =
                    "rgba(250,246,238,0.5)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color =
                    "rgba(250,246,238,0.25)")
                }
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
