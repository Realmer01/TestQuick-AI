import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import Provider from "./provider";

export const metadata: Metadata = {
  title: "TestQuickAI | AI-Powered QA Automation Platform",
  description: "TestQuickAI — an AI-powered test automation agent. Connects GitHub repos, generates Playwright test scripts with Gemini AI, and executes them on real cloud browsers via Browserbase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body style={{ margin: 0, padding: 0 }}>
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
