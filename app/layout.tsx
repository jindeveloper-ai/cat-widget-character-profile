import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const copy = {
  ko: {
    title: "나린 — 읽씹을 못 견디는 황태자",
    description: "차갑고 오만한 황태자, 당신 앞에서만 무너지는 샴고양이 수인 나린을 만나보세요.",
    alt: "읽씹 12분째, 황태자가 무너졌다 — 나린",
  },
  en: {
    title: "Narin — The Crown Prince Who Hates Being Left on Read",
    description: "Meet Narin, the proud Siamese cat-shifter prince who only lets his guard down for you.",
    alt: "Left on read for 12 minutes — Narin",
  },
  ja: {
    title: "ナリン — 既読無視に耐えられない皇太子",
    description: "冷たく傲慢な皇太子、あなただけに弱さを見せるシャム猫の獣人ナリンに出会ってください。",
    alt: "既読無視から12分、皇太子が崩れた — ナリン",
  },
} as const;

type Locale = keyof typeof copy;

function requestLocale(value: string | null): Locale {
  for (const language of (value ?? "").toLowerCase().split(",")) {
    const code = language.trim().split(";")[0].split("-")[0];
    if (code === "ko" || code === "en" || code === "ja") return code;
  }
  return "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const locale = requestLocale(requestHeaders.get("accept-language"));
  const { title, description, alt } = copy[locale];
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    metadataBase: new URL(origin),
    title,
    description,
    openGraph: { title, description, type: "website", images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt }] },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const locale = requestLocale(requestHeaders.get("accept-language"));
  return <html lang={locale}><body>{children}</body></html>;
}
