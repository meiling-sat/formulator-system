import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Formulator AI System",
  description: "10阶段标准化配方开发平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="h-screen overflow-hidden bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
