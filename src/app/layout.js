import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Setting up modern fonts for the "Aura" aesthetic
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// This metadata controls what appears on the browser tab
export const metadata = {
  title: "Aura — Minimal Expense Tracking",
  description: "Manage your finances with clarity and elegance.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fafafa] text-slate-900`}
        >
          {/* 
            The ClerkProvider allows every page in your app 
            to know if a user is logged in or not. 
          */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}