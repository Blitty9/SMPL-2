import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

export function ProductHero() {
  const titles = useMemo(
    () => ["structured", "consistent", "compressed", "type-safe", "universal"],
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
    <div className="relative min-h-[70vh] w-full flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="space-y-4 max-w-4xl">
            <div className="inline-block px-4 py-1.5 rounded-full border border-[#C8B3FF]/30 bg-[#C8B3FF]/5 mb-4">
              <span className="text-sm text-[#C8B3FF] font-medium">Product Overview</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
              <span className="text-white">Build apps that are</span>
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
                    className="absolute inset-0 text-[#C8B3FF]"
                  >
                    {titles[currentTitle]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h1>

            <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              SMPL transforms any input into a canonical application blueprint optimized for AI builders,
              reducing tokens while maintaining complete structural integrity.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,179,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]" />
      </div>
    </div>
  );
}
