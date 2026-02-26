// @ts-nocheck
import MarketingPageLayout from "@/components/marketing/MarketingPageLayout";

const pluginCards = [
  ["SMS Gateway", "Automate fee reminders, notice alerts, and instant parent communication."],
  ["Payment Gateway", "Collect online payments with transaction history and digital receipts."],
  ["WhatsApp Notifications", "Share announcements and attendance alerts on WhatsApp channels."],
  ["Analytics Add-on", "Advanced charts and institute-level insights for better decisions."],
  ["Biometric Sync", "Connect biometric attendance devices with class-level records."],
  ["Website Builder", "Publish institute website pages from your admin dashboard."],
];

export default function PluginsPage() {
  return (
    <MarketingPageLayout
      activePath="/plugins"
      title="Powerful Plugins & Integrations"
      subtitle="Extend Edutrack with integrations that automate communication, payments, and analytics."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {pluginCards.map(([title, description]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 font-[var(--font-poppins)]">{title}</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">{description}</p>
          </article>
        ))}
      </div>
    </MarketingPageLayout>
  );
}
