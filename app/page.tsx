"use client";

import { LoanCTAWithImages } from "@/components/cta";
import { LoanHeroSection } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  });
  return (
    <div>
      <div className="absolute top-5 right-5 flex  gap-2 items-center justify-center text-xs">
        <p>Already have an account?</p>
        <Button asChild variant={"outline"}>
          <SignInButton />
        </Button>
      </div>
      <LoanHeroSection />
      <LoanCTAWithImages />
    </div>
  );
}
