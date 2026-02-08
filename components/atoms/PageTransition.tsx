"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function PageTransition({ children }: Props) {
  const pathname = usePathname();
  const [transitionStage, setTransitionStage] = useState("enter");

  return (
    <div
      key={pathname}
      className={
        transitionStage === "enter" ? "animate-page-enter" : "animate-page-exit"
      }
      onAnimationEnd={() => {
        if (transitionStage === "exit") {
          setTransitionStage("enter");
        }
      }}
    >
      {children}
    </div>
  );
}
