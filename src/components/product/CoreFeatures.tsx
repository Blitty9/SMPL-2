import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Database, Code2, FileText, Zap } from "lucide-react";

export function CoreFeatures() {
  const features = [
    {
      icon: Sparkles,
      title: "Universal Input Parser",
      description: "Accepts natural language, existing JSON schemas, code snippets, or any structured format. SMPL intelligently normalizes everything into a canonical structure.",
      highlights: ["Natural language", "JSON/YAML schemas", "Code snippets", "Mixed formats"],
    },
    {
      icon: Database,
      title: "Canonical AppSchema",
      description: "The heart of SMPL - a universal schema that standardizes application structure across all AI tools. Type-safe, versioned, and extensible.",
      highlights: ["Type-safe structure", "Version controlled", "Universal format", "Extensible design"],
    },
    {
      icon: Code2,
      title: "SMPL DSL",
      description: "Structured, parseable format that bridges natural language and AI tools. While token-efficient (60-80% savings vs JSON), its real power is standardization, tool-specific expansion, and programmatic processing.",
      highlights: ["Structured & parseable", "Tool-specific expansion", "Standardized format", "60-80% token savings", "AI optimized"],
    },
    {
      icon: FileText,
      title: "Expanded Spec",
      description: "Full documentation format with detailed descriptions, relationships, and implementation notes. Perfect for human review and handoffs.",
      highlights: ["Complete documentation", "Implementation guides", "Relationship mapping", "Review friendly"],
    },
    {
      icon: Zap,
      title: "Export Prompts",
      description: "Generate tool-specific prompts optimized for Cursor, Bolt, v0.dev, Replit Agent, and more. Each export is tailored to the target builder's strengths.",
      highlights: ["Tool-specific output", "Optimized prompts", "Context aware", "Best practices built-in"],
    },
  ];

  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            Core <span className="text-[#C8B3FF]">Features</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            A complete toolkit for transforming application ideas into AI-ready blueprints
          </p>
        </div>

        <div className="space-y-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group grid md:grid-cols-2 gap-8 p-8 rounded-lg border border-[#2F333A] bg-[#1A1D21]/30 hover:border-[#C8B3FF]/50 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#C8B3FF]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C8B3FF]/20 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-[#C8B3FF]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                      <p className="text-neutral-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {feature.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <ArrowRight className="w-4 h-4 text-[#C8B3FF] flex-shrink-0" />
                      <span className="text-neutral-300">{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
