import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import Features from "@/components/home/Features";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/home/Footer";

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
