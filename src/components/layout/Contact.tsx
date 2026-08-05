"use client";

import React, { useState } from "react";
import { useXRay } from "../experience/XRayContext";
import { Send, Copy, Check } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";

export const Contact: React.FC = () => {
  const { lang } = useXRay();
  const [copied, setCopied] = useState(false);

  const telegramUrl = "https://t.me/Ivancoolstudio";
  const githubUrl = "https://github.com/vansGAMee";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(telegramUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="contact" className="w-full py-24 px-6 md:px-12 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <span className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest">
          CONTACT // LET&apos;S TALK
        </span>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-sans leading-none">
          {lang === "ru" ? (
            <>
              ЕСТЬ ЗАДАЧА? <br />
              НАПИШИТЕ МНЕ.
            </>
          ) : (
            <>
              HAVE A PROJECT? <br />
              LET&apos;S TALK.
            </>
          )}
        </h2>

        <p className="text-base md:text-lg text-neutral-400 max-w-xl mx-auto font-sans">
          {lang === "ru"
            ? "Открыт для интересной разработки, сотрудничества и создания веб-продуктов."
            : "Open for interesting engineering roles, contract work, and web product builds."}
        </p>

        {/* Contact Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all shadow-xl hover:shadow-blue-500/30"
          >
            <Send className="w-5 h-5" />
            <span>Telegram: @Ivancoolstudio</span>
          </a>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-100 font-bold text-base transition-all"
          >
            <GithubIcon className="w-5 h-5" />
            <span>GitHub: vansGAMee</span>
          </a>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-neutral-700 bg-neutral-800/40 hover:bg-neutral-800 text-neutral-300 font-mono text-xs transition-all"
            aria-label="Copy Telegram Link"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">
                  {lang === "ru" ? "СКОПИРОВАНО!" : "COPIED!"}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{lang === "ru" ? "Скопировать ссылку" : "Copy Link"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
