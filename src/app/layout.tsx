import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";

import "./globals.css";

import ParentProvider from "./ParentWrapper"; 

const notoSans = Noto_Sans_TC({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "HealthExplorer | 健康探索者",
  description: "Let's save health together!",
};

//語言改成繁體中文，避免瀏覽器預設詢問是否中翻
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={notoSans.className}>
      <body>
        <ParentProvider>
          {children}
        </ParentProvider>
      </body>
    </html>
  );
}