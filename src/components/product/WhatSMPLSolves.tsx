import { motion } from "framer-motion";
import { Box, Minimize2, Grid3x3, FileCode } from "lucide-react";

export function WhatSMPLSolves() {
  const features = [
    {
      icon: Box,
      title: "Clean Structure",
      description: "Converts messy ideas, JSON, or code into a normalized, canonical application schema that AI builders understand instantly.",
    },
    {
      icon: Minimize2,
      title: "Efficient & Structured",
      description: "Token-efficient format (60-80% savings vs JSON) that's also structured and parseable. Enables programmatic expansion into tool-specific prompts.",
    },
    {
      icon: Grid3x3,
      title: "Multi-Tool Exports",
      description: "Generate optimized prompts for Cursor, Bolt, v0.dev, Replit Agent, and other AI builders from a single source.",
    },
    {
      icon: FileCode,
      title: "Canonical AppSchema",
      description: "Universal schema that standardizes app structure across all AI tools, ensuring consistency and portability.",
    },
  ];

  return (
    <section className="py-20 bg-deep-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            What <span className="text-[#C8B3FF]">SMPL</span> Solves
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Stop wrestling with inconsistent formats and bloated prompts. SMPL creates a single source of truth for your application structure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative p-6 rounded-lg border border-[#2F333A] bg-[#1A1D21]/50 backdrop-blur-sm hover:border-[#C8B3FF]/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8B3FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-[#C8B3FF]/10 flex items-center justify-center mb-4 group-hover:bg-[#C8B3FF]/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[#C8B3FF]" />
                  </div>

                  <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
