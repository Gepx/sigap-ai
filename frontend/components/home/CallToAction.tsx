"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export default function CallToAction() {
  return (
    <section className="bg-transparent px-5 py-24 sm:px-8 lg:px-10 mt-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2.5rem] bg-[#1A2E26] sm:rounded-[3rem]"
        >
          {/* Inner container for clipping glow without clipping the pop-out image */}
          <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] sm:rounded-[3rem]">
            <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-[#00B074]/20 blur-[100px]" />
          </div>
          
          <div className="relative z-10 grid items-center md:grid-cols-[1.3fr_0.7fr]">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-start px-8 py-12 sm:px-16 md:py-16 md:pl-16 lg:py-20 lg:pl-20"
            >
              <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight">
                Ready to manage your reputation smarter?
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#A1A1AA] sm:text-lg">
                Start your journey to smarter feedback management and better decisions — it only takes 2 minutes.
              </p>
              
              <Link
                href="/login"
                className="group mt-10 inline-flex items-center gap-2 rounded-full bg-[#00B074] px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(0,176,116,0.3)] transition-all hover:bg-[#079968] hover:shadow-[0_0_30px_rgba(0,176,116,0.5)]"
              >
                Try Sigap.ai
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            {/* Visual/Image */}
            <div className="relative flex w-full justify-center md:block h-full">
              {/* Desktop Image (absolute to stick out of bounds) */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="hidden md:block absolute bottom-0 right-0 h-[115%] w-[130%] lg:h-[125%] lg:w-[150%] xl:h-[130%] xl:w-[160%]"
              >
                <Image
                  src="/assets/cta_man_smiling_transparent.png"
                  alt="Professional using Sigap.ai"
                  fill
                  className="object-contain object-right-bottom"
                  priority
                />
              </motion.div>
              {/* Mobile Image (inline) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative mt-2 h-64 w-full sm:h-80 md:hidden"
              >
                <Image
                  src="/assets/cta_man_smiling_transparent.png"
                  alt="Professional using Sigap.ai"
                  fill
                  className="rounded-b-[2.5rem] object-contain object-bottom sm:rounded-b-[3rem]"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
