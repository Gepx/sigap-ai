import Link from "next/link";
import Image from "next/image";
import { Code2, Mail, Sparkles } from "lucide-react";

const team = [
  "Irfan Maulana",
  "Surya Hanjaya",
  "Egip Sinargo",
  "Irsyad Adfiansha",
  "M. Faqih Shiam",
];

export default function Footer() {
  return (
    <footer
      id="about"
      className="border-t border-[#1A2E26]/10 bg-[#1A2E26] px-5 py-14 text-white sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex size-11 items-center justify-center">
                <Image
                  src="/green_sigap_logo.png"
                  alt="Sigap AI Logo"
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </span>
              <span className="text-2xl font-black tracking-tight">
                Sigap.ai
              </span>
            </Link>
            <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-white/60">
              Intelligent Perception Analysis System for detecting sentiment,
              protecting digital reputation, and turning customer feedback into
              tactical business recommendations.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-[#00B074] px-5 py-3 text-sm font-black text-white transition hover:bg-[#079968]"
              >
                Open app
              </Link>
              <Link
                href="#home"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white/80 transition hover:border-[#00B074]/50 hover:text-white"
              >
                Back to top
              </Link>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#00B074]">
                Team GM029
              </h3>
              <div className="mt-5 grid gap-3">
                {team.map((member) => (
                  <p key={member} className="text-sm font-bold text-white/70">
                    {member}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#00B074]">
                Project
              </h3>
              <div className="mt-5 grid gap-3 text-sm font-bold text-white/70">
                <p>AI for Business Intelligence</p>
                <p>Market Insights Capstone</p>
                <p>SME reputation support</p>
              </div>
              <div className="mt-6 flex gap-3">
                <span className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/70">
                  <Code2 className="size-4" />
                </span>
                <span className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/70">
                  <Mail className="size-4" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm font-bold text-white/45">
          © {new Date().getFullYear()} Sigap.ai. Built for fast reputation
          insight and practical business action.
        </div>
      </div>
    </footer>
  );
}
