import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Features from "@/components/Features";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F4F9F6] font-sans text-[#1A2E26] antialiased selection:bg-[#00B074]/20 selection:text-[#1A2E26]">
      <Navbar />
      <main className="flex-grow overflow-x-hidden">
        <Hero />
        <Benefits />
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
