// @ts-nocheck
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Package & Pricing", href: "#pricing" },
  { label: "Templates", href: "#templates" },
  { label: "Plugins", href: "#plugins" },
  { label: "About us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const features = [
  ["AT", "Student Attendance", "Mark class or subject attendance quickly from desktop and mobile."],
  ["SI", "Student Information", "Store student profile, guardian, fees, and academic data in one place."],
  ["AD", "Admission & Forms", "Manage online admission forms, placement, and status tracking."],
  ["TS", "Teacher & Staff Records", "Maintain teacher profiles, salary info, and subject assignments."],
  ["AL", "Accounts & Ledger", "Track fees, expenses, and dues with clear monthly reports."],
  ["GP", "Guardian & SMS Portal", "Send notices, results, and payment alerts to guardians instantly."],
];

const plans = [
  ["Basic Plan", "2000 BDT", "One Time Charge: 2000 BDT"],
  ["Standard Plan", "2500 BDT", "One Time Charge: 3000 BDT"],
  ["Premium Plan", "4000 BDT", "One Time Charge: 5000 BDT"],
  ["Enterprise", "Custom", "One Time Charge: N/A"],
];

const reasons = [
  ["CL", "Cloud-Based Platform", "Access from desktop or mobile with secure cloud sync."],
  ["AF", "Affordable Solution", "Flexible pricing for coaching centers and schools."],
  ["EZ", "Easy to Use", "Simple and clean interface for every role."],
  ["SC", "Safe & Secure", "Role-based access and reliable data protection."],
];

const stats = [
  ["600+", "Institute Registered"],
  ["50000+", "Students Registered"],
  ["6000+", "Teachers Registered"],
  ["25000+", "Guardians Registered"],
];

const faqs = [
  ["What is this platform?", "It is an all-in-one coaching management system for attendance, exams, fees, and communication."],
  ["Can I mark attendance from mobile?", "Yes. Teachers can mark attendance from both desktop and mobile devices."],
  ["Can guardians see updates?", "Yes. Guardians can receive attendance, notices, and payment updates in real-time."],
  ["Does it support multiple roles?", "Yes. Admin, teacher, student, and guardian dashboards are role-based."],
];

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden bg-[#f3f8ff] text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-12 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -right-24 top-32 h-[26rem] w-[26rem] rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 text-sm font-bold text-white">
              ED
            </span>
            <div>
              <p className="text-[30px] leading-none font-semibold tracking-tight text-[#1f5583] font-[var(--font-poppins)]">Edufy</p>
              <p className="text-xs text-slate-500">Coaching Management SaaS</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-[15px] font-medium text-slate-700 lg:flex">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-cyan-600">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/login" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Login
            </Link>
            <button className="rounded-xl bg-gradient-to-r from-indigo-700 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white">Request a demo</button>
          </div>

          <details className="relative lg:hidden">
            <summary className="flex h-10 w-10 list-none items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 [&::-webkit-details-marker]:hidden">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </svg>
            </summary>
            <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              {navLinks.map((item) => (
                <a key={item.label} href={item.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  {item.label}
                </a>
              ))}
              <Link href="/login" className="mt-2 block rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700">
                Login
              </Link>
              <button className="mt-2 w-full rounded-lg bg-gradient-to-r from-indigo-700 to-cyan-500 px-3 py-2 text-sm font-semibold text-white">
                Request a demo
              </button>
            </div>
          </details>
        </div>
      </header>

      <section id="home" className="relative overflow-hidden bg-gradient-to-r from-[#060b67] via-[#16518f] to-[#21c39d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(255,255,255,0.2),transparent_38%)]" />
        <div className="mx-auto grid min-h-[78vh] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-16">
          <div className="relative z-10 text-white rise-in">
            <h1 className="text-4xl font-semibold leading-tight font-[var(--font-poppins)] sm:text-5xl lg:text-[56px]">
              Education Management Software for Kindergarten, Schools, and Madrasah
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-blue-50 sm:text-lg">
              Manage attendance, exams, fees, communication, admissions, and reporting in one platform.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button className="rounded-xl bg-gradient-to-r from-indigo-700 to-cyan-400 px-6 py-3 text-sm font-semibold text-white">Request Demo</button>
              <Link href="/login" className="rounded-xl border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                Login
              </Link>
            </div>
          </div>
          <div className="relative z-10">
            <div className="rounded-[28px] border border-white/20 bg-white/95 p-4 shadow-[0_35px_70px_-34px_rgba(15,23,42,0.8)] sm:p-5">
              <DashboardMock />
            </div>
            <div className="absolute -bottom-10 left-[-10px] w-[190px] sm:left-[-26px] sm:w-[215px]">
              <PhoneMock />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Heading title="Core Education Management Features for Every Institution" subtitle="Everything needed for daily academic operations in one connected flow." />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map(([badge, title, text]) => (
            <article key={title} className="rounded-3xl border border-cyan-100 bg-[#f2f9fb]/90 p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 hover:shadow-[0_25px_45px_-28px_rgba(14,116,144,0.45)]">
              <IconTile label={badge} />
              <h3 className="mt-5 text-2xl font-semibold text-slate-900 font-[var(--font-poppins)]">{title}</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="templates" className="bg-white/70 py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-end">
            <div>
              <h2 className="text-3xl font-semibold leading-tight text-slate-900 font-[var(--font-poppins)] sm:text-5xl">
                Education Management Software for Any Type of Institution
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
                Suitable for schools, kindergartens, madrasah, and coaching centers with scalable workflows.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {["Kindergarten", "School", "Madrasah", "College"].map((tab, idx) => (
                <button key={tab} className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${idx === 0 ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg" : "bg-[#e9f2f5] text-slate-700 hover:bg-[#dce9ef]"}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="plugins" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_25px_65px_-34px_rgba(15,23,42,0.45)] sm:p-8 lg:p-10">
          <Heading title="One Connected Platform for Students, Teachers, and Guardians" subtitle="Role-based apps with a unified experience." compact />
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-2 rounded-2xl bg-[#edf4f7] p-2">
            {["Guardian App", "Teacher App", "Admin App"].map((tab, idx) => (
              <button key={tab} className={`rounded-xl px-3 py-3 text-sm font-semibold ${idx === 0 ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md" : "text-cyan-700 hover:bg-white"}`}>{tab}</button>
            ))}
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="flex items-end gap-3 sm:gap-4">
              <PhoneMock compact />
              <PhoneMock compact lifted />
              <PhoneMock compact />
            </div>
            <div>
              <h3 className="text-4xl font-semibold text-slate-900 font-[var(--font-poppins)]">Guardian App</h3>
              <ul className="mt-4 grid gap-3 text-base text-slate-700">
                <li className="flex gap-2"><Tick /> Pay school fees from home</li>
                <li className="flex gap-2"><Tick /> Get instant digital receipts</li>
                <li className="flex gap-2"><Tick /> See attendance and exam updates</li>
                <li className="flex gap-2"><Tick /> Track homework and notices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#ebf4f7] py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Heading title="Pricing Plan" subtitle="Flexible plans designed for educational institutions." />
          <div className="mx-auto mt-7 inline-flex rounded-full bg-[#d6e8ec] p-1">
            <button className="rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-2 text-sm font-semibold text-white">Monthly</button>
            <button className="rounded-full px-8 py-2 text-sm font-semibold text-slate-600">Yearly</button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {plans.map(([name, price, oneTime], idx) => (
              <article key={name} className={`relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${idx === 2 ? "ring-2 ring-indigo-300" : ""}`}>
                {idx === 2 ? <span className="absolute -top-3 right-5 rounded-full bg-gradient-to-r from-indigo-700 to-cyan-500 px-3 py-1 text-xs font-semibold text-white">Recommended</span> : null}
                <h3 className="text-2xl font-semibold text-cyan-700 font-[var(--font-poppins)]">{name}</h3>
                <p className="mt-4 text-[42px] leading-none font-semibold text-[#17558e] font-[var(--font-poppins)]">{price}</p>
                <p className="mt-2 text-base uppercase tracking-wide text-slate-500">/month</p>
                <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f6fbfc] px-4 py-3 text-sm text-slate-700">{oneTime}</div>
                <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-700 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white">Choose Plan</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-semibold leading-tight text-slate-900 font-[var(--font-poppins)] sm:text-5xl">Why Edufy Is the Smartest Choice for Educational Institutes</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">Smart management software, mobile access, and reliable support in one system.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {reasons.map(([badge, title, text]) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <IconTile label={badge} />
              <h3 className="mt-4 text-xl font-semibold text-slate-900 font-[var(--font-poppins)]">{title}</h3>
              <p className="mt-2 text-base leading-relaxed text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#070d67] via-[#15508d] to-[#20c49d] py-16 text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map(([value, label]) => (
            <div key={label} className="text-center">
              <p className="text-5xl font-semibold font-[var(--font-poppins)]">{value}</p>
              <p className="mt-2 text-xl text-blue-100">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#e9f3f6] py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Heading title="Frequently Asked Questions" subtitle="Clear answers to common questions for coaching institutes." />
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {faqs.map(([q, a], idx) => (
              <details key={q} open={idx === 0} className="group rounded-2xl border border-cyan-100 bg-[#f4fbfc] p-5 shadow-sm">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                  <span>{q}</span>
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300 text-cyan-700">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">-</span>
                  </span>
                </summary>
                <p className="mt-3 text-base leading-relaxed text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[32px] bg-gradient-to-r from-cyan-500 via-[#14548f] to-[#111f94] px-7 py-12 text-white">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <h2 className="text-4xl font-semibold leading-tight font-[var(--font-poppins)] sm:text-5xl">Connect With Our Experts</h2>
              <p className="mt-4 max-w-2xl text-lg text-blue-100">Get personalized support and launch your digital coaching journey today.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <button className="rounded-xl bg-cyan-400 px-6 py-3 text-base font-semibold text-white">Talk to Expert Now</button>
              <button className="rounded-xl border border-white/55 px-6 py-3 text-base font-semibold text-white">Get in touch</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-[#251a63] via-[#125a8d] to-[#0f9078] text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-sm font-bold text-white">ED</span>
              <div>
                <p className="text-3xl leading-none font-semibold tracking-tight font-[var(--font-poppins)]">Edufy</p>
                <p className="text-xs text-white/80">Smart Coaching Management System</p>
              </div>
            </div>
            <p className="mt-5 text-base leading-relaxed text-blue-100">Trusted education management software for coaching institutes.</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold font-[var(--font-poppins)]">Quick Links</h3>
            <ul className="mt-4 grid gap-2 text-base text-blue-100">
              <li><a href="#about" className="transition hover:text-white">About</a></li>
              <li><a href="#features" className="transition hover:text-white">Features</a></li>
              <li><a href="#pricing" className="transition hover:text-white">Pricing</a></li>
              <li><a href="#contact" className="transition hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold font-[var(--font-poppins)]">Institutions</h3>
            <ul className="mt-4 grid gap-2 text-base text-blue-100">
              <li>School</li><li>College</li><li>Kindergarten</li><li>Madrasah</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold font-[var(--font-poppins)]">Contact</h3>
            <div className="mt-4 space-y-2 text-base text-blue-100">
              <p>sales@edufy.com.bd</p><p>+8801894431218</p><p>Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/15 py-4 text-center text-sm text-blue-100">Copyright {new Date().getFullYear()} Edufy. All rights reserved.</div>
      </footer>
    </main>
  );
}

function Heading({ title, subtitle, compact = false }) {
  return (
    <div className={`mx-auto text-center ${compact ? "max-w-3xl" : "max-w-4xl"}`}>
      <h2 className="text-4xl font-semibold leading-tight text-slate-900 font-[var(--font-poppins)] sm:text-5xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">{subtitle}</p>
    </div>
  );
}

function IconTile({ label }) {
  return (
    <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(8,47,73,0.8)]">
      {label}
    </span>
  );
}

function Tick() {
  return (
    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
        <path d="m3.5 8 2.6 2.6L12.5 4" />
      </svg>
    </span>
  );
}

function DashboardMock() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[0.28fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5">
          <Bar w="92%" /><Bar w="70%" /><Bar w="80%" /><Bar w="64%" /><Bar w="78%" />
        </div>
        <div className="grid gap-2.5">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Mini title="Students" value="1300" />
            <Mini title="Attendance" value="92%" />
            <Mini title="Fees" value="350k" />
            <Mini title="Exams" value="24" />
          </div>
          <div className="grid gap-2.5 sm:grid-cols-[1fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Revenue Trend</p>
              <Trend w="84%" /><Trend w="62%" /><Trend w="74%" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Activity</p>
              <Bar w="100%" /><Bar w="88%" /><Bar w="72%" /><Bar w="65%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneMock({ compact = false, lifted = false }) {
  return (
    <div className={`rounded-[2.3rem] border-4 border-slate-900 bg-white p-2 shadow-2xl ${compact ? "w-[120px] sm:w-[132px]" : "w-[210px]"} ${lifted ? "translate-y-4" : ""}`}>
      <div className="mx-auto mb-1.5 h-1.5 w-12 rounded-full bg-slate-900" />
      <div className="overflow-hidden rounded-[1.8rem] border border-slate-200">
        <div className="bg-gradient-to-r from-cyan-500 to-indigo-600 px-3 py-2 text-[10px] font-semibold text-white">Guardian App</div>
        <div className="space-y-2 bg-slate-50 p-2.5">
          <div className="rounded-lg bg-white p-2"><Bar w="85%" /><Bar w="62%" /></div>
          <div className="rounded-lg bg-white p-2"><Bar w="75%" /><Bar w="56%" /></div>
          <div className="grid grid-cols-3 gap-1.5"><div className="h-7 rounded-md bg-white" /><div className="h-7 rounded-md bg-white" /><div className="h-7 rounded-md bg-white" /></div>
        </div>
      </div>
    </div>
  );
}

function Mini({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
      <p className="text-[10px] text-slate-600">{title}</p>
      <p className="mt-1 text-xs font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function Bar({ w }) {
  return <div className="mb-1.5 h-2 rounded bg-slate-200" style={{ width: w }} />;
}

function Trend({ w }) {
  return <div className="mb-1.5 h-2 rounded bg-gradient-to-r from-cyan-500 to-indigo-500" style={{ width: w }} />;
}
