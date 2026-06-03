"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Interface representing a team member profile.
 */
interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

/**
 * Capstone Project GM029 Team Profile configuration.
 */
const TEAM_MEMBERS: readonly TeamMember[] = [
  { name: "Irfan Maulana", role: "Data Support", initials: "IM" },
  { name: "Surya Hanjaya", role: "AI Lead", initials: "SH" },
  { name: "Egip Sinargo", role: "Tech Lead", initials: "ES" },
  { name: "Irsyad Adfiansha", role: "Backend Developer", initials: "IA" },
  { name: "M. Faqih Shiam", role: "UI/UX & Frontend developer", initials: "FS" },
] as const;

/**
 * Footer Component: Renders the team profiles grid, project context branding,
 * and support partner logos (IBM, Pijak, Dicoding) under a cohesive mint backdrop layout.
 */
export default function Footer() {
  return (
    <footer id="about" className="bg-[#F0F7F6] border-t border-[#D5E6E3] text-slate-700 pt-16 pb-12 w-full">
      <div className="w-full max-w-none px-6 sm:px-12 lg:px-20 xl:px-32">
        
        {/* 1. Meet The Team Section */}
        <div className="text-center mb-16 pb-16 border-b border-[#D5E6E3]/60">
          <h3 className="text-2xl font-black text-[#0D6D5F] tracking-tight mb-12">
            Meet The Team:
          </h3>
          
          {/* Horizontal responsive profile list */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 justify-center items-start max-w-6xl mx-auto">
            {TEAM_MEMBERS.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                
                {/* Circular Profile Avatar */}
                <div className="h-20 w-20 rounded-full bg-white border border-[#D5E6E3] shadow-xs flex items-center justify-center font-bold text-[#0D6D5F] text-lg mb-4 group-hover:scale-105 group-hover:border-primary transition-all duration-200">
                  {member.initials}
                </div>
                
                {/* Name & Role details */}
                <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">
                  {member.name}
                </h4>
                <p className="text-xs font-semibold text-teal-600/90 mt-1">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Brand Description & Partners Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Left Block: Brand branding detail */}
          <div className="md:col-span-7 space-y-4 max-w-xl">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/Logo_Sigap_With_Title.png"
                alt="Sigap.ai Brand Logo"
                width={165}
                height={50}
                priority
                className="object-contain"
              />
            </Link>
            
            <p className="text-sm font-extrabold text-[#0D6D5F] mt-2">
              Intelligent Perception Analysis System.
            </p>
            
            <p className="text-xs sm:text-sm text-slate-655 leading-relaxed font-semibold">
              An AI-powered decision-support system designed to protect digital reputation and mitigate business risks for SMEs.
            </p>
          </div>

          {/* Right Block: Partner Sponsor Grid */}
          <div className="md:col-span-5 space-y-6">
            <h4 className="text-xs font-black text-[#0D6D5F] uppercase tracking-wider">
              Supported By:
            </h4>
            
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              
              {/* IBM Capsule */}
              <div className="bg-white p-2 rounded-xl border border-[#D5E6E3]/60 shadow-xs flex items-center justify-center h-12 w-24">
                <Image
                  src="/assets/IBM_Logo.png"
                  alt="IBM Partner Logo"
                  width={70}
                  height={30}
                  className="object-contain max-h-8"
                />
              </div>

              {/* Pijak Capsule */}
              <div className="bg-white p-2 rounded-xl border border-[#D5E6E3]/60 shadow-xs flex items-center justify-center h-12 w-24">
                <Image
                  src="/assets/Logo_Pijak.png"
                  alt="Pijak Partner Logo"
                  width={80}
                  height={30}
                  className="object-contain max-h-8"
                />
              </div>

              {/* Dicoding Capsule */}
              <div className="bg-white p-2 rounded-xl border border-[#D5E6E3]/60 shadow-xs flex items-center justify-center h-12 w-28">
                <Image
                  src="/assets/Logo_Dicoding.png"
                  alt="Dicoding Partner Logo"
                  width={90}
                  height={30}
                  className="object-contain max-h-8"
                />
              </div>
            </div>
          </div>

        </div>

        {/* 3. Bottom Copyright Area */}
        <div className="mt-16 pt-8 border-t border-[#D5E6E3]/60 text-center">
          <p className="text-xs font-bold text-[#0D6D5F]/70">
            &copy; {new Date().getFullYear()} Sigap.ai. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
