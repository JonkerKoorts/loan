"use client";
import { cn } from "@/lib/utils";
import { Manrope } from "next/font/google";
import React, { useRef } from "react";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import { useInView } from "framer-motion";
import { useRouter } from "next/navigation";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export function LoanHeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <div ref={ref} className="bg-gray-50 w-full dark:bg-neutral-800 mb-20">
      <div className="grid max-h-[50rem] md:max-h-[40rem] overflow-hidden grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto pt-10 md:pt-20 items-start">
        <div className="lg:col-span-2 py-10 md:py-10 px-4 md:px-8">
          <RoughNotationGroup show={isInView}>
            <h2
              className={cn(
                "text-2xl sm:text-4xl lg:text-7xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 text-center sm:text-left",
                manrope.className
              )}
            >
              Manage your{" "}
              <RoughNotation
                type="highlight"
                animationDuration={2000}
                iterations={3}
                color="#38bdf880"
                multiline
              >
                loans efficiently
              </RoughNotation>{" "}
              with our streamlined
              <RoughNotation
                type="underline"
                animationDuration={2000}
                iterations={10}
                color="#38bdf8"
              >
                platform
              </RoughNotation>
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-lg max-w-2xl mt-4 md:mt-10 text-center sm:text-left">
              Our **Next.js Loan Management Application** simplifies loan
              tracking, approvals, and management. Easily create, edit, and
              monitor loans using an intuitive, **modern interface** powered by
              React, Prisma, and PostgreSQL.
            </p>
          </RoughNotationGroup>
          <div className="flex sm:flex-row flex-col gap-4 items-center mt-10">
            <button
              onClick={handleSignUp}
              className="px-4 py-2 rounded-lg bg-sky-500 text-white font-bold text-base hover:bg-sky-600 transition duration-200"
            >
              Get Started
            </button>
            <button className="text-black dark:text-white border border-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900 px-4 py-2 rounded-lg text-base transition duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
