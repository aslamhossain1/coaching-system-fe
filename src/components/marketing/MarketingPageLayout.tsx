// @ts-nocheck
import Link from "next/link";
import MarketingHeader from "@/components/marketing/MarketingHeader";

export default function MarketingPageLayout({ activePath, title, subtitle, children }) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f3f8ff] text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-12 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -right-24 top-32 h-[26rem] w-[26rem] rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <MarketingHeader activePath={activePath} />

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        <div className="rounded-[30px] border border-slate-200 bg-white/80 p-8 shadow-[0_28px_60px_-35px_rgba(15,23,42,0.5)] backdrop-blur-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Edutrack SaaS</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight font-[var(--font-poppins)] sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">{subtitle}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/login" className="rounded-xl bg-gradient-to-r from-indigo-700 to-cyan-500 px-6 py-3 text-sm font-semibold text-white">
              Get Started
            </Link>
            <Link href="/contact" className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">{children}</section>
    </main>
  );
}
