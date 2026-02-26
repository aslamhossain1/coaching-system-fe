// @ts-nocheck
import Image from "next/image";
import Link from "next/link";

export const marketingNavLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Package & Pricing", href: "/package-pricing" },
  { label: "Templates", href: "/templates" },
  { label: "Plugins", href: "/plugins" },
  { label: "About us", href: "/about-us" },
  { label: "Contact", href: "/contact" },
];

export default function MarketingHeader({ activePath = "/" }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-[100] w-full border-b border-slate-200/80 bg-white/95 shadow-[0_8px_30px_-20px_rgba(15,23,42,0.32)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-4 lg:px-8 lg:py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/edutrack-logo.svg" alt="Edutrack logo" width={48} height={48} priority className="h-12 w-12" />
          <div>
            <p className="text-[34px] leading-none font-semibold tracking-tight text-[#1f5583] font-[var(--font-poppins)]">Edutrack</p>
            <p className="text-sm text-slate-500">Coaching Management SaaS</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-base font-medium text-slate-700 lg:flex">
          {marketingNavLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`transition hover:text-cyan-600 ${activePath === item.href ? "text-cyan-600" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Login
          </Link>
          <Link href="/login" className="rounded-xl bg-gradient-to-r from-indigo-700 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white">
            Get Started
          </Link>
        </div>

        <details className="relative lg:hidden">
          <summary className="flex h-11 w-11 list-none items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 [&::-webkit-details-marker]:hidden">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </svg>
          </summary>
          <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
            {marketingNavLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100 ${
                  activePath === item.href ? "bg-slate-100 text-cyan-700" : "text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" className="mt-2 block rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700">
              Login
            </Link>
            <Link href="/login" className="mt-2 block w-full rounded-lg bg-gradient-to-r from-indigo-700 to-cyan-500 px-3 py-2 text-center text-sm font-semibold text-white">
              Get Started
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
