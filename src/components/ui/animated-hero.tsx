"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "./button";
import { cn } from "../../lib/utils/cn";
import { trackEvent, AnalyticsEvents } from "../../lib/analytics";

export function Hero() {
  const titles = useMemo(
    () => ["structured", "compressed", "universal", "developer-ready", "instant"],
    []
  );

  const [currentTitle, setCurrentTitle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prev) => (prev + 1) % titles.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <div className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
              <span className="text-[#C7B8FF]">SMPL makes app building</span>
              <br />
              <div className="relative inline-block h-[1.2em] w-full">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentTitle}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                    className="absolute inset-0 text-white"
                  >
                    {titles[currentTitle]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h1>

            <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              SMPL turns messy app ideas, JSON, code, or schemas into clean, consistent, compressed blueprints that AI tools can execute instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
            <Button 
              size="lg" 
              className="group"
              onClick={() => trackEvent({ name: AnalyticsEvents.GET_STARTED_CLICKED })}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              asChild
            >
              <a
                href="https://github.com/Blitty9/SMPL-2"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View SMPL on GitHub (opens in new tab)"
                onClick={() => trackEvent({ name: AnalyticsEvents.GITHUB_CLICKED })}
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(199,184,255,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]" />
      </div>
    </div>
  );
}
