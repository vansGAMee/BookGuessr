import type { Metadata } from "next";
import { Unbounded, Onest, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "VANSGAMEE / UNDER THE SURFACE — Ivan Kulkin Portfolio",
  description:
    "Production-ready portfolio of Ivan Kulkin (vansGAMee). Web products, data tools, and offline applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ivan Kulkin",
    alternateName: "vansGAMee",
    url: "https://vansgamee.github.io/",
    sameAs: [
      "https://github.com/vansGAMee",
      "https://t.me/Ivancoolstudio",
    ],
    jobTitle: "Senior Frontend & Systems Engineer",
    knowsAbout: [
      "Frontend Development",
      "UI/UX Architecture",
      "React",
      "Next.js",
      "TypeScript",
      "Android",
      "Kotlin",
      "Rust",
    ],
  };

  return (
    <html lang="ru" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
      </head>
      <body
        className={`${unbounded.variable} ${onest.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
