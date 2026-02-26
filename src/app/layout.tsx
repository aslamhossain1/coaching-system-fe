// @ts-nocheck
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Edutrack | Coaching Management SaaS",
  description: "Edutrack modern role-based dashboards for coaching management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-[var(--font-inter)] antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

