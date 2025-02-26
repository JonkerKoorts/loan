"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import searching from "../public/animations/searching.json";

// Create a placeholder component
const LoadingPlaceholder = () => (
  <div
    style={{ width: 200, height: 200 }}
    className="bg-gray-100 animate-pulse rounded-md"
  ></div>
);

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <LoadingPlaceholder />,
});

// Create the animation component
const LottieAnimation: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <LoadingPlaceholder />;
  }

  return (
    <Lottie animationData={searching} style={{ width: 200, height: 200 }} />
  );
};

export default LottieAnimation;
