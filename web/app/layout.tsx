import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "./StyledComponentsRegistry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "온꼬미즈 꾸미기",
  description: "온꼬미즈를 드래그앤드롭로 꾸며보세요!",
  openGraph: {
    title: "온꼬미즈 꾸미기",
    description: "온꼬미즈를 드래그앤드롭로 꾸며보세요",
    type: "website",
    locale: "ko_KR",
    siteName: "온꼬미즈 꾸미기",
    /** SNS 링크 미리보기 썸네일 — public/assets/og.png */
    images: [
      {
        url: "/assets/og.png",
        alt: "온꼬미즈 꾸미기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "온꼬미즈 꾸미기",
    description: "온꼬미즈를 드래그앤드롭으로 꾸며보세요!",
    images: ["/assets/og.png"],
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  appleWebApp: {
    capable: true,
    title: "온꼬미즈 꾸미기",
    statusBarStyle: "default",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
  /** 모바일 브라우저 상단/주소창 테마 (배경과 맞춤) */
  themeColor: "#e8eaf0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <div className="dressup-shell">
            <div className="dressup-desktop-gate" role="region" aria-label="PC 접속 안내">
              <div className="dressup-desktop-gate__inner">
                {/* eslint-disable-next-line @next/next/no-img-element -- 정적 안내 이미지 */}
                <img
                  className="dressup-desktop-gate__og"
                  src="/assets/og.png"
                  alt="온꼬미즈 꾸미기"
                />
                <p className="dressup-desktop-gate__lead">모바일 전용입니다</p>
                <p className="dressup-desktop-gate__text">
                  원활한 사용을 위해 스마트폰이나 태블릿에서 접속해 주세요.
                </p>
              </div>
            </div>
            <div className="dressup-mobile-app">{children}</div>
          </div>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
