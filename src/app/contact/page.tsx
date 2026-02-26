// @ts-nocheck
import MarketingPageLayout from "@/components/marketing/MarketingPageLayout";

export default function ContactPage() {
  return (
    <MarketingPageLayout
      activePath="/contact"
      title="Contact Edutrack Team"
      subtitle="Talk with our product and onboarding team to plan your institute setup."
    >
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 font-[var(--font-poppins)]">Email</h3>
            <p className="mt-2 text-base text-slate-600">sales@edutrack.com</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 font-[var(--font-poppins)]">Phone</h3>
            <p className="mt-2 text-base text-slate-600">+8801894431218</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 font-[var(--font-poppins)]">Office</h3>
            <p className="mt-2 text-base text-slate-600">Dhaka, Bangladesh</p>
          </article>
        </div>

        <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-semibold text-slate-900 font-[var(--font-poppins)]">Send a Message</h3>
          <div className="mt-5 grid gap-4">
            <input type="text" placeholder="Your Name" className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-cyan-500" />
            <input type="email" placeholder="Your Email" className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-cyan-500" />
            <input type="text" placeholder="Institute Name" className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-cyan-500" />
            <textarea rows={5} placeholder="How can we help?" className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-cyan-500" />
          </div>
          <button type="button" className="mt-5 rounded-xl bg-gradient-to-r from-indigo-700 to-cyan-500 px-6 py-3 text-sm font-semibold text-white">
            Submit
          </button>
        </form>
      </div>
    </MarketingPageLayout>
  );
}
